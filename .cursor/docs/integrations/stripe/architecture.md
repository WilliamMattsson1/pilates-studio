# Stripe Booking Architecture

**Version:** 2.0 (Webhook-Based)
**Last Updated:** 2025-01-27
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Booking Lifecycle](#booking-lifecycle)
4. [Component Breakdown](#component-breakdown)
5. [Webhook as Single Source of Truth](#webhook-as-single-source-of-truth)
6. [Polling Mechanism & UX](#polling-mechanism--ux)
7. [Security Model](#security-model)
8. [Error Handling & Resilience](#error-handling--resilience)
9. [Data Flow Diagrams](#data-flow-diagrams)

---

## Overview

This document describes the **webhook-based Stripe booking architecture** that replaced the previous client-side implementation. The system ensures secure, reliable, and idempotent booking creation through asynchronous webhook processing.

### Key Design Decisions

- **Webhook-First:** All booking creation happens server-side via Stripe webhooks
- **Idempotency:** Duplicate webhooks don't create duplicate bookings
- **Race Condition Protection:** Double-check pattern prevents overbooking
- **Non-Blocking UX:** Frontend polls for confirmation while webhook processes asynchronously
- **Comprehensive Logging:** All failures logged to `failed_bookings` for manual review

---

## Architecture Principles

### 1. Server-Side Authority

- Payment amounts calculated from database, never from client input
- Webhook signature verification ensures requests are from Stripe
- All business logic (capacity checks, booking creation) happens server-side

### 2. Idempotency

- Every webhook event is idempotent (safe to retry)
- Duplicate events return existing booking without creating duplicates
- Payment intent ID used as unique identifier

### 3. Eventual Consistency

- Booking creation is asynchronous (webhook-driven)
- Frontend polls for confirmation, providing immediate feedback
- Users see "processing" state until booking is confirmed

### 4. Fail-Safe Design

- Payment success doesn't guarantee booking success
- Failed bookings logged for manual review and refund
- Email failures don't block booking creation

---

## Booking Lifecycle

### Step-by-Step Flow

```
┌─────────────┐
│  1. USER    │
│  Initiates  │
│   Booking   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  2. FRONTEND                        │
│  StripeCheckoutPage.tsx             │
│  - Fetches class data               │
│  - Calls /api/create-payment-intent │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  3. CREATE PAYMENT INTENT           │
│  /api/create-payment-intent         │
│  - Validates Stripe is enabled      │
│  - Fetches class from DB            │
│  - Calculates amount server-side    │
│  - Creates PaymentIntent with       │
│    metadata (classId, userId, etc.) │
│  - Returns clientSecret             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  4. STRIPE PAYMENT                  │
│  - User enters payment details      │
│  - Stripe processes payment         │
│  - Payment succeeds                 │
│  - Stripe redirects to              │
│    /payment-success?payment_intent= │
└──────┬──────────────────────────────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│  5A. FRONTEND        │    │  5B. STRIPE WEBHOOK          │
│  PaymentSuccess.tsx  │    │  (Asynchronous)             │
│  - Extracts          │    │  /api/webhooks/stripe       │
│    payment_intent ID │    │  - Verifies signature        │
│  - Starts polling    │    │  - Checks idempotency        │
│    /api/bookings/    │    │  - Validates capacity        │
│    by-payment-intent │    │  - Creates booking           │
│  - Shows loading     │    │  - Sends email               │
│    state             │    │  - Returns success            │
└──────┬───────────────┘    └──────────────────────────────┘
       │
       │ (Polling every 2s, max 5 attempts)
       │
       ▼
┌─────────────────────────────────────┐
│  6. BOOKING CONFIRMED               │
│  /api/bookings/by-payment-intent    │
│  - Queries booking_details by       │
│    stripe_payment_id                │
│  - Returns booking + class data     │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  7. SUCCESS UI                      │
│  PaymentSuccess.tsx                 │
│  - Shows booking confirmation       │
│  - Displays class details           │
│  - Confetti animation               │
└─────────────────────────────────────┘
```

### Timeline Example

```
T+0s:   User clicks "Pay"
T+0.5s: PaymentIntent created
T+2s:   User completes payment
T+2.1s: Stripe redirects to /payment-success
T+2.2s: Frontend starts polling
T+3s:   Stripe webhook received
T+3.5s: Booking created in database
T+4s:   Polling finds booking → Success UI
T+4.5s: Confirmation email sent
```

---

## Component Breakdown

### 1. Payment Intent Creation

**File:** `app/api/create-payment-intent/route.ts`

**Responsibilities:**

- Server-side feature flag check (`isStripeEnabled()`)
- Fetch class data from database
- Calculate payment amount from class price (server-side)
- Create Stripe PaymentIntent with metadata
- Return `clientSecret` to frontend

**Key Security Features:**

- ✅ Amount calculated from database, not client input
- ✅ Feature flag prevents payment creation if disabled
- ✅ Metadata includes all booking context

**Metadata Structure:**

```typescript
{
    classId: string
    userId: string | null
    guestName: string | null
    guestEmail: string
    classTitle: string
    classDate: string
    classTime: string
    amount: string // For reference/auditing
}
```

---

### 2. Webhook Handler (Single Source of Truth)

**File:** `app/api/webhooks/stripe/route.ts`

**Responsibilities:**

- Verify webhook signature (security)
- Process `payment_intent.succeeded` events
- Check idempotency (prevent duplicates)
- Validate capacity (prevent overbooking)
- Create booking and booking_details
- Send confirmation email
- Log failures to `failed_bookings`

**Processing Steps:**

#### Step 1: Signature Verification

```typescript
event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
```

- Ensures request is from Stripe
- Prevents unauthorized webhook calls
- Returns 401 if signature invalid

#### Step 2: Event Filtering

- Only processes `payment_intent.succeeded`
- Other events logged but not processed
- Returns 200 for unhandled events

#### Step 3: Metadata Validation

```typescript
if (!metadata.classId || !metadata.guestEmail) {
    return 400 // Missing required fields
}
```

#### Step 4: Idempotency Check

```typescript
const existingBooking = await supabaseAdmin
    .from('booking_details')
    .select('booking_id')
    .eq('stripe_payment_id', paymentIntent.id)
    .single()

if (existingBooking) {
    return 200 // Already processed
}
```

- Prevents duplicate bookings
- Safe to retry webhook events
- Returns existing booking ID

#### Step 5: Capacity Validation (First Check)

```typescript
const existingBookings = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('class_id', metadata.classId)

const classData = await supabaseAdmin
    .from('classes')
    .select('max_spots')
    .eq('id', metadata.classId)
    .single()

if (existingBookings.length >= classData.max_spots) {
    // Log to failed_bookings
    return 400 // Class is full
}
```

#### Step 6: Capacity Validation (Final Check)

```typescript
// Double-check right before insert (race condition protection)
const finalCheck = await supabaseAdmin
    .from('bookings')
    .select('id')
    .eq('class_id', metadata.classId)

if (finalCheck.length >= classData.max_spots) {
    // Log to failed_bookings
    return 400 // Class became full during processing
}
```

#### Step 7: Booking Creation

```typescript
// Create booking
const booking = await supabaseAdmin
    .from('bookings')
    .insert([{ class_id: metadata.classId }])
    .select()
    .single()

// Create booking_details
const details = await supabaseAdmin
    .from('booking_details')
    .insert([
        {
            booking_id: booking.id,
            user_id: metadata.userId || null,
            guest_name: metadata.guestName || null,
            guest_email: metadata.guestEmail,
            stripe_payment_id: paymentIntent.id,
            payment_method: 'stripe',
            swish_received: false,
            refunded: false
        }
    ])
    .select()
    .single()
```

#### Step 8: Email Sending (Non-Blocking)

```typescript
try {
  await fetch('/api/send-email', { ... })
} catch (emailErr) {
  // Log error but don't fail webhook
  console.error('Email sending error (non-fatal):', emailErr)
}
```

**Error Handling:**

- All errors logged to `failed_bookings` table
- Payment succeeded but booking failed → logged with `stripe_paid: true`
- Orphaned bookings cleaned up if `booking_details` insert fails

---

### 3. Frontend Checkout

**File:** `components/checkout/StripeCheckoutPage.tsx`

**Responsibilities:**

- Display class information
- Initialize Stripe PaymentElement
- Create payment intent on mount
- Handle payment submission
- Redirect to success page

**Key Features:**

- ✅ Slimmed down (no booking logic)
- ✅ Server-side payment intent creation
- ✅ Automatic redirect on success

---

### 4. Success Page with Polling

**File:** `app/(root)/payment-success/PaymentSuccess.tsx`

**Responsibilities:**

- Extract `payment_intent` from URL
- Poll `/api/bookings/by-payment-intent` for booking
- Show loading state during polling
- Display success UI when booking found
- Fallback to "processing" message if not found

**Polling Logic:**

```typescript
const pollForBooking = async () => {
    const maxAttempts = 5
    const pollInterval = 2000 // 2 seconds

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const res = await fetch(
            `/api/bookings/by-payment-intent?payment_intent=${paymentIntentId}`
        )

        if (data.found && data.booking) {
            setBookingFound(true)
            setBookingData(data.booking)
            return
        }

        if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, pollInterval))
        }
    }

    // Not found after all attempts
    setLoading(false)
    setBookingFound(false)
}
```

**States:**

1. **Loading:** Polling in progress (shows spinner)
2. **Success:** Booking found (shows confirmation with confetti)
3. **Processing:** Booking not found (shows "payment received, processing" message)

---

### 5. Verification API

**File:** `app/api/bookings/by-payment-intent/route.ts`

**Responsibilities:**

- Query `booking_details` by `stripe_payment_id`
- Fetch associated `booking` and `class` data
- Return combined booking object

**Response Format:**

```typescript
{
  found: boolean
  booking: {
    id: string
    class_id: string
    created_at: string
    details: {
      booking_id: string
      user_id: string | null
      guest_name: string | null
      guest_email: string
      stripe_payment_id: string
    }
    class: {
      id: string
      title: string
      date: string
      start_time: string
      end_time: string
      price: number
    } | null
  } | null
}
```

---

## Webhook as Single Source of Truth

### Why Webhooks?

**Traditional Client-Side Approach (Old):**

```
Client → Payment → Client → Create Booking
```

- ❌ Race conditions
- ❌ Client can manipulate data
- ❌ Payment success != booking success
- ❌ No idempotency

**Webhook-Based Approach (Current):**

```
Client → Payment → Stripe → Webhook → Create Booking
```

- ✅ Server-side authority
- ✅ Payment success verified by Stripe
- ✅ Idempotent (safe to retry)
- ✅ Single source of truth

### Webhook Guarantees

1. **Authenticity:** Signature verification ensures webhook is from Stripe
2. **Idempotency:** Duplicate events don't create duplicate bookings
3. **Reliability:** Stripe retries failed webhooks automatically
4. **Ordering:** Events processed in order (per payment intent)

### What Happens If Webhook Fails?

1. **Stripe Retries:** Stripe automatically retries failed webhooks (exponential backoff)
2. **Idempotency Protection:** If webhook succeeds on retry, idempotency check prevents duplicate
3. **Manual Recovery:** Failed bookings logged to `failed_bookings` for manual review
4. **User Experience:** Frontend polling continues, user sees "processing" message

---

## Polling Mechanism & UX

### Design Philosophy

**Problem:** Webhooks are asynchronous. User completes payment, but booking creation happens server-side with potential delays.

**Solution:** Frontend polls for booking confirmation while webhook processes in background.

### Polling Strategy

**Configuration:**

- **Interval:** 2 seconds
- **Max Attempts:** 5
- **Total Timeout:** 10 seconds

**Rationale:**

- Webhooks typically process in 1-3 seconds
- 10 seconds covers most cases
- Falls back gracefully if booking not found

### User Experience Flow

```
┌─────────────────────────────────────────┐
│  Payment Success Redirect               │
│  /payment-success?payment_intent=pi_... │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  State: Loading                         │
│  - Shows spinner                        │
│  - "Confirming your booking..."         │
│  - Polls every 2s                       │
└───────────────┬─────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
┌──────────────┐  ┌──────────────────────┐
│ Booking      │  │ Booking Not Found    │
│ Found        │  │ (after 5 attempts)   │
│              │  │                      │
│ - Confetti   │  │ - "Payment Received" │
│ - Details    │  │ - "Processing..."    │
│ - Success UI │  │ - Email notification │
└──────────────┘  └──────────────────────┘
```

### Edge Cases Handled

1. **Webhook Faster Than Polling:**
    - First poll finds booking immediately
    - User sees success UI quickly

2. **Webhook Slower Than Polling:**
    - Polling times out after 10 seconds
    - User sees "processing" message
    - Booking still created (webhook processes)
    - User receives email confirmation

3. **Webhook Fails:**
    - Polling never finds booking
    - User sees "processing" message
    - Failed booking logged to `failed_bookings`
    - Admin can manually review and refund

4. **Network Issues:**
    - Polling requests fail
    - User sees "processing" message
    - Booking may still succeed (webhook independent)

### High-End UX Features

- ✅ **Immediate Feedback:** Loading state shows immediately
- ✅ **Visual Confirmation:** Confetti animation on success
- ✅ **Graceful Degradation:** Falls back to "processing" if booking not found
- ✅ **Email Backup:** Users receive email even if UI doesn't update
- ✅ **Clear Messaging:** Explains what's happening at each step

---

## Security Model

### 1. Webhook Signature Verification

**Implementation:**

```typescript
const signature = request.headers.get('stripe-signature')
event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
```

**Protection:**

- Ensures webhook is from Stripe
- Prevents replay attacks
- Validates request integrity

### 2. Server-Side Price Validation

**Implementation:**

```typescript
// Payment Intent Creation
const classData = await supabaseAdmin
    .from('classes')
    .select('price')
    .eq('id', classId)
    .single()

const amount = convertToSubcurrency(classData.price)
```

**Protection:**

- Price calculated from database, not client
- Client cannot manipulate payment amount
- Metadata includes amount for auditing only

### 3. Feature Flag

**Implementation:**

```typescript
if (!isStripeEnabled()) {
    return NextResponse.json(
        { error: 'Card payments are temporarily paused.' },
        { status: 503 }
    )
}
```

**Protection:**

- Server-side check prevents payment creation
- Can disable Stripe without code deployment
- Graceful degradation to Swish

### 4. Metadata Validation

**Implementation:**

```typescript
if (!metadata.classId || !metadata.guestEmail) {
    return NextResponse.json(
        { error: 'Missing required metadata fields' },
        { status: 400 }
    )
}
```

**Protection:**

- Required fields validated before processing
- Prevents incomplete bookings
- Ensures data integrity

### 5. Capacity Validation

**Implementation:**

- Double-check pattern (two capacity checks)
- Race condition protection
- Failed bookings logged for review

**Protection:**

- Prevents overbooking
- Handles concurrent requests
- Logs edge cases for analysis

---

## Error Handling & Resilience

### Error Categories

#### 1. Webhook Signature Failure

- **Status:** 401 Unauthorized
- **Action:** Stripe retries automatically
- **Logging:** Error logged to console

#### 2. Missing Metadata

- **Status:** 400 Bad Request
- **Action:** Webhook fails, booking not created
- **Logging:** Error logged, payment succeeded but booking failed

#### 3. Class Full

- **Status:** 400 Bad Request
- **Action:** Booking not created, logged to `failed_bookings`
- **Logging:** `stripe_paid: true`, `error_message: "Class is full"`
- **Recovery:** Manual refund required

#### 4. Database Errors

- **Status:** 500 Internal Server Error
- **Action:** Booking not created, logged to `failed_bookings`
- **Logging:** Full error message logged
- **Recovery:** Manual review and refund

#### 5. Email Sending Failure

- **Status:** Webhook succeeds (non-blocking)
- **Action:** Booking created, email not sent
- **Logging:** Error logged to console
- **Recovery:** Email can be resent manually

### Failed Bookings Table

**Purpose:** Track payments that succeeded but bookings failed

**Schema:**

```typescript
{
    class_id: string
    user_id: string | null
    guest_name: string | null
    guest_email: string
    stripe_payment_id: string
    stripe_paid: boolean // true if payment succeeded
    payment_method: 'stripe'
    error_message: string
    refunded: boolean
    created_at: string
}
```

**Use Cases:**

- Class full during payment
- Database errors
- Class deleted
- Webhook processing errors

**Recovery Process:**

1. Admin reviews `failed_bookings` table
2. Verifies payment in Stripe dashboard
3. Initiates refund if needed
4. Marks as `refunded: true`

### Idempotency Guarantees

**Scenario 1: Duplicate Webhook Events**

```
Webhook 1: Creates booking → Success
Webhook 2: Finds existing booking → Returns 200 (idempotent)
```

**Scenario 2: Network Retry**

```
Webhook 1: Network timeout → Stripe retries
Webhook 2: Finds existing booking → Returns 200 (idempotent)
```

**Scenario 3: Manual Retry**

```
Admin retries webhook → Finds existing booking → Returns 200 (idempotent)
```

---

## Data Flow Diagrams

### Happy Path

```
User → Frontend → PaymentIntent API → Stripe
                                    ↓
                              Payment Success
                                    ↓
                    ┌───────────────┴───────────────┐
                    │                               │
            Frontend (Polling)              Stripe Webhook
                    │                               │
                    │                       Verify Signature
                    │                               │
                    │                       Check Idempotency
                    │                               │
                    │                       Validate Capacity
                    │                               │
                    │                       Create Booking
                    │                               │
                    │                       Send Email
                    │                               │
                    └───────────────┬───────────────┘
                                    ↓
                            Booking Found
                                    ↓
                            Success UI
```

### Error Path (Class Full)

```
User → Payment → Stripe → Webhook
                        ↓
                  Payment Succeeded
                        ↓
                  Check Capacity
                        ↓
                  Class is Full
                        ↓
            Log to failed_bookings
            (stripe_paid: true)
                        ↓
            Return 400 Error
                        ↓
            Frontend Polling Times Out
                        ↓
            Show "Processing" Message
                        ↓
            Admin Reviews failed_bookings
                        ↓
            Manual Refund Required
```

### Race Condition Protection

```
Time    Webhook A              Webhook B
─────────────────────────────────────────
T+0s    Check capacity (5/10)
T+0.1s                        Check capacity (5/10)
T+0.2s  Final check (5/10)
T+0.3s                        Final check (6/10) ← Webhook A inserted
T+0.4s  Insert booking ✅
T+0.5s                        Insert booking ❌ (capacity exceeded)
                                Log to failed_bookings
```

---

## Monitoring & Observability

### Key Metrics to Monitor

1. **Webhook Success Rate**
    - Track 200 vs 400/500 responses
    - Alert on high failure rate

2. **Failed Bookings Count**
    - Monitor `failed_bookings` table
    - Alert on new entries

3. **Polling Timeout Rate**
    - Track users seeing "processing" message
    - Indicates webhook delays

4. **Email Delivery Rate**
    - Monitor email sending failures
    - Track Resend API errors

### Logging Points

- ✅ Payment intent creation
- ✅ Webhook signature verification
- ✅ Idempotency checks
- ✅ Capacity validation
- ✅ Booking creation
- ✅ Email sending
- ✅ Error conditions

### Alerting Recommendations

1. **High Failed Bookings:** Alert when `failed_bookings` entries increase
2. **Webhook Failures:** Alert on 500 errors from webhook
3. **Email Failures:** Alert on email sending errors
4. **Capacity Issues:** Alert when classes frequently full

---

## Conclusion

This webhook-based architecture provides a **robust, secure, and scalable** solution for Stripe bookings. The system:

- ✅ Ensures payment security through server-side validation
- ✅ Prevents duplicate bookings through idempotency
- ✅ Handles race conditions through double-check pattern
- ✅ Provides excellent UX through polling mechanism
- ✅ Logs all failures for manual review
- ✅ Gracefully handles edge cases

**The webhook is the single source of truth** for booking creation, ensuring data integrity and reliability.
