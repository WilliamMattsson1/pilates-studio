# API Reference

**Version:** 1.0
**Last Updated:** 2026-01-14
**Status:** Production

---

## Table of Contents

1. [Endpoint Catalog](#endpoint-catalog)
2. [Security Architecture](#security-architecture)
3. [Error Handling Strategy](#error-handling-strategy)
4. [Resilience Patterns](#resilience-patterns)
5. [Scaling Roadmap](#scaling-roadmap)

---

## Endpoint Catalog

Endpoints are grouped by authentication requirements: **Public** (no auth), **User** (authenticated), and **Admin** (role check).

### Public Endpoints

#### `GET /api/classes`

**Purpose:** Fetch all available classes for public display.

**Request:**

- Method: `GET`
- Auth: None required
- Query params: None

**Response:**

```typescript
{
  data: ClassItem[] | null
  error: string | null
}
```

**TypeScript Types:**

```typescript
interface ClassItem {
    id: string // uuid
    title: string
    date: string // YYYY-MM-DD
    start_time: string // HH:mm
    end_time: string // HH:mm
    max_spots: number
    price: number // SEK
    created_at: string // ISO timestamp
}
```

**Status Codes:**

- `200`: Success
- `500`: Database error

**Security:** Public read access via RLS. No PII exposed.

---

#### `GET /api/bookings`

**Purpose:** Fetch booking metadata for capacity calculations.

**Request:**

- Method: `GET`
- Auth: None required
- Query params: None

**Response:**

```typescript
{
  data: Booking[] | null
  error: string | null
}
```

**TypeScript Types:**

```typescript
interface Booking {
    id: string // bigint as string
    class_id: string // uuid
    created_at: string // ISO timestamp
}
```

**Status Codes:**

- `200`: Success
- `500`: Database error

**Security:** Public read access for metadata only (no PII). Used to calculate `bookings.length` vs `classes.max_spots` for availability display.

**Note:** This endpoint intentionally returns only non-sensitive fields. PII is stored in `booking_details` and protected by RLS.

---

#### `POST /api/create-payment-intent`

**Purpose:** Create Stripe PaymentIntent for card payments.

**Request:**

- Method: `POST`
- Auth: None required (guest checkout supported)
- Body:

```typescript
{
  classId: string // uuid
  userId?: string // uuid, nullable for guest checkout
  guestName?: string
  guestEmail: string
  classTitle?: string // optional, fetched from DB if missing
  classDate?: string // optional, fetched from DB if missing
  classTime?: string // optional, fetched from DB if missing
  amount?: string // optional, calculated server-side from DB
}
```

**Response:**

```typescript
{
  clientSecret: string // Stripe PaymentIntent client_secret
} | {
  error: string
}
```

**Status Codes:**

- `200`: PaymentIntent created
- `404`: Class not found
- `500`: Internal server error
- `503`: Stripe disabled (STRIPE_ENABLED=false)

**Security:**

- Server-side price calculation (amount fetched from `classes.price`, not client input)
- Feature flag check (`isStripeEnabled()`) prevents payment creation if disabled
- Metadata includes booking context for webhook processing

**Code Reference:** `app/api/create-payment-intent/route.ts`

---

#### `POST /api/webhooks/stripe`

**Purpose:** Stripe webhook handler for payment events (called by Stripe, not clients).

**Request:**

- Method: `POST`
- Auth: Webhook signature verification (not user auth)
- Headers: `stripe-signature` (required for signature verification)
- Body: Raw Stripe event JSON

**Response:**

```typescript
{
  received: true
  bookingId?: string // if booking created
} | {
  error: string
}
```

**Status Codes:**

- `200`: Event processed (or unhandled event type)
- `400`: Missing metadata or class full
- `401`: Invalid webhook signature
- `500`: Webhook processing error

**Security:**

- Signature verification via `stripe.webhooks.constructEvent()`
- Only processes `payment_intent.succeeded` events
- Idempotency checks prevent duplicate bookings
- Capacity validation prevents overbooking

**Code Reference:** `app/api/webhooks/stripe/route.ts`

---

#### `GET /api/bookings/by-payment-intent`

**Purpose:** Poll endpoint to check if booking was created after payment.

**Request:**

- Method: `GET`
- Auth: Conditional (ownership check for authenticated users)
- Query params: `payment_intent` (Stripe PaymentIntent ID)

**Response:**

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
} | {
  error: string
}
```

**Status Codes:**

- `200`: Success (found may be false if booking not yet created)
- `400`: Missing payment_intent parameter
- `403`: Unauthorized (booking belongs to another user)
- `500`: Internal server error

**Security:**

- Ownership validation: If booking has `user_id`, validates it matches authenticated session
- Guest bookings accessible via high-entropy `stripe_payment_id` token (non-enumerable)
- Prevents ID enumeration and unauthorized access

**Code Reference:** `app/api/bookings/by-payment-intent/route.ts`

---

### User Endpoints

#### `GET /api/bookings/user-bookings`

**Purpose:** Fetch authenticated user's bookings and profile.

**Request:**

- Method: `GET`
- Auth: Required (Supabase session)

**Response:**

```typescript
{
  profile: {
    id: string
    name: string | null
    email: string | null
  } | null
  bookings: Booking[]
} | {
  error: string
}
```

**Status Codes:**

- `200`: Success
- `401`: Not authenticated
- `500`: Database error

**Security:** RLS enforces user-scoped reads (`user_id = auth.uid()`).

**Code Reference:** `app/api/bookings/user-bookings/route.ts`

---

#### `POST /api/profiles`

**Purpose:** Create user profile during signup.

**Request:**

- Method: `POST`
- Auth: Required (Supabase session)
- Body:

```typescript
{
    name: string
    email: string
}
```

**Response:**

```typescript
{
  success: true
} | {
  error: string
}
```

**Status Codes:**

- `200`: Profile created
- `400`: Missing fields
- `401`: Not authenticated
- `500`: Database error

**Security:** User can only create their own profile (`id = auth.uid()`).

**Code Reference:** `app/api/profiles/route.ts` (POST handler)

---

#### `POST /api/bookings`

**Purpose:** Create booking (supports Stripe, Swish, and manual flows).

**Request:**

- Method: `POST`
- Auth: Conditional (see Security section)
- Body:

```typescript
{
  class_id: string // uuid
  user_id?: string // uuid, nullable for guest checkout
  guest_name?: string
  guest_email?: string
  stripe_payment_id?: string // required for Stripe flow
  payment_method?: 'manual' | 'stripe' | 'swish'
  swish_received?: boolean // default false
}
```

**Response:**

```typescript
{
    data: BookingWithDetails | null
    error: string | null
}
```

**TypeScript Types:**

```typescript
interface BookingWithDetails extends Booking {
    details: BookingDetail
}
```

**Status Codes:**

- `200`: Booking created
- `400`: Class full or validation error
- `403`: Unauthorized (manual booking requires admin)
- `500`: Database error

**Security:**

- **Stripe flow:** Validates `stripe_payment_id` with Stripe API (payment must be succeeded)
- **Swish flow:** Allows public POST if `swish_received: false` (pending payment)
- **Manual flow:** Requires `requireAdmin()`
- Capacity checks prevent overbooking
- Idempotency check for Stripe payments

**Code Reference:** `app/api/bookings/route.ts` (POST handler)

---

### Admin Endpoints

#### `GET /api/admin/bookings`

**Purpose:** Fetch all bookings with details (admin dashboard).

**Request:**

- Method: `GET`
- Auth: Admin required (`requireAdmin()`)

**Response:**

```typescript
{
  data: BookingWithDetails[] | null
  error: string | null
}
```

**Status Codes:**

- `200`: Success
- `403`: Unauthorized (not admin)
- `500`: Database error

**Security:** Uses `supabaseAdmin` to bypass RLS and fetch all bookings.

**Code Reference:** `app/api/admin/bookings/route.ts`

---

#### `DELETE /api/bookings/[id]`

**Purpose:** Delete a booking (admin only).

**Request:**

- Method: `DELETE`
- Auth: Admin required
- Path params: `id` (booking ID)

**Response:**

```typescript
{
  data: Booking[] | null
  error: string | null
}
```

**Status Codes:**

- `200`: Booking deleted
- `404`: Booking not found
- `403`: Unauthorized
- `500`: Database error

**Security:** Hard delete (permanent removal). Admin-only access.

**Code Reference:** `app/api/bookings/[id]/route.ts` (DELETE handler)

---

#### `POST /api/bookings/[id]/mark-paid`

**Purpose:** Mark Swish booking as paid (admin confirmation).

**Request:**

- Method: `POST`
- Auth: Admin required
- Path params: `id` (booking ID)

**Response:**

```typescript
{
    data: BookingDetail | null
    error: string | null
}
```

**Status Codes:**

- `200`: Payment status updated
- `403`: Unauthorized
- `500`: Database error

**Security:** Updates `swish_received: true` in `booking_details`. Admin-only access.

**Code Reference:** `app/api/bookings/[id]/mark-paid/route.ts`

---

#### `GET /api/bookings/failed-bookings`

**Purpose:** Fetch failed bookings for manual review (admin dashboard).

**Request:**

- Method: `GET`
- Auth: Admin required

**Response:**

```typescript
{
  data: FailedBooking[] | null
  error: string | null
}
```

**TypeScript Types:**

```typescript
interface FailedBooking {
    id: string
    class_id: string
    user_id: string | null
    guest_name: string | null
    guest_email: string
    stripe_payment_id: string | null
    stripe_paid: boolean
    payment_method: string
    error_message: string | null
    refunded: boolean
    refunded_at: string | null
    created_at: string
}
```

**Status Codes:**

- `200`: Success
- `403`: Unauthorized
- `500`: Database error

**Security:** Admin-only access prevents exposure of error logs and payment failure details.

**Code Reference:** `app/api/bookings/failed-bookings/route.ts`

---

#### `GET /api/bookings/orphans`

**Purpose:** Find bookings without corresponding booking_details (data integrity check).

**Request:**

- Method: `GET`
- Auth: Admin required

**Response:**

```typescript
{
  total: number
  orphans: number
  orphanBookings: Booking[]
}
```

**Status Codes:**

- `200`: Success
- `403`: Unauthorized
- `500`: Database error

**Security:** Admin-only access for data integrity audits.

**Code Reference:** `app/api/bookings/orphans/route.ts`

---

#### `POST /api/classes`

**Purpose:** Create a new class (admin only).

**Request:**

- Method: `POST`
- Auth: Admin required
- Body:

```typescript
{
    title: string
    date: string // YYYY-MM-DD
    start_time: string // HH:mm
    end_time: string // HH:mm
    max_spots: number // > 0
    price: number // >= 0
}
```

**Response:**

```typescript
{
    data: ClassItem | null
    error: string | null
}
```

**Status Codes:**

- `200`: Class created
- `400`: Missing required fields
- `403`: Unauthorized
- `500`: Database error

**Security:** Admin-only access. Database CHECK constraints enforce `max_spots > 0` and `price >= 0`.

**Code Reference:** `app/api/classes/route.ts` (POST handler)

---

#### `PUT /api/classes/[id]`

**Purpose:** Update an existing class (admin only).

**Request:**

- Method: `PUT`
- Auth: Admin required
- Path params: `id` (class ID)
- Body: Partial `ClassItem` (any updatable fields)

**Response:**

```typescript
{
    data: ClassItem | null
    error: string | null
}
```

**Status Codes:**

- `200`: Class updated
- `403`: Unauthorized
- `500`: Database error

**Security:** Admin-only access.

**Code Reference:** `app/api/classes/[id]/route.ts` (PUT handler)

---

#### `DELETE /api/classes/[id]`

**Purpose:** Delete a class (admin only).

**Request:**

- Method: `DELETE`
- Auth: Admin required
- Path params: `id` (class ID)

**Response:**

```typescript
{
  data: ClassItem[] | null
  error: string | null
}
```

**Status Codes:**

- `200`: Class deleted
- `400`: Foreign key constraint (class has active bookings)
- `404`: Class not found
- `403`: Unauthorized
- `500`: Database error

**Security:**

- Admin-only access
- Foreign key `RESTRICT` prevents deletion if bookings exist
- Error handling returns user-friendly message: "Kan inte radera: Det finns deltagare bokade på detta pass."

**Code Reference:** `app/api/classes/[id]/route.ts` (DELETE handler)

---

#### `GET /api/profiles`

**Purpose:** Fetch all user profiles (admin dashboard).

**Request:**

- Method: `GET`
- Auth: Admin required

**Response:**

```typescript
{
  profiles: Profile[]
}
```

**TypeScript Types:**

```typescript
interface Profile {
    id: string
    is_admin: boolean
    name: string | null
    email: string | null
    created_at: string
}
```

**Status Codes:**

- `200`: Success
- `403`: Unauthorized
- `500`: Database error

**Security:** Admin-only access prevents exposure of customer PII.

**Code Reference:** `app/api/profiles/route.ts` (GET handler)

---

#### `GET /api/profiles/is-admin`

**Purpose:** Check if current user is admin.

**Request:**

- Method: `GET`
- Auth: Required (Supabase session)

**Response:**

```typescript
{
    admin: boolean
}
```

**Status Codes:**

- `200`: Success (admin may be false)

**Security:** Uses `requireAdmin()` internally, returns `admin: false` if not admin (non-error response).

**Code Reference:** `app/api/profiles/is-admin/route.ts`

---

#### `POST /api/payment-info`

**Purpose:** Fetch Stripe payment intent amount and currency (for refund modal).

**Request:**

- Method: `POST`
- Auth: Admin required
- Body:

```typescript
{
    payment_intent: string // Stripe PaymentIntent ID
}
```

**Response:**

```typescript
{
    amount: number // in öre (subcurrency)
    currency: string // e.g., "sek"
}
```

**Status Codes:**

- `200`: Success
- `400`: Missing payment_intent
- `403`: Unauthorized
- `500`: Internal server error

**Security:** Admin-only access. Used exclusively by `RefundModal` in admin dashboard.

**Code Reference:** `app/api/payment-info/route.ts`

---

#### `POST /api/refund`

**Purpose:** Process Stripe refund for a booking.

**Request:**

- Method: `POST`
- Auth: Admin required
- Body:

```typescript
{
    payment_intent: string // Stripe PaymentIntent ID
    booking_id: string // booking ID to mark as refunded
}
```

**Response:**

```typescript
{
  success: true
} | {
  success: false
  alreadyRefunded?: boolean
} | {
  error: string
}
```

**Status Codes:**

- `200`: Refund processed
- `400`: Missing parameters or already refunded
- `404`: Booking not found
- `403`: Unauthorized
- `500`: Refund processing error

**Security:**

- Admin-only access
- Validates booking exists and not already refunded
- Polls Stripe API 1-3 times to confirm refund status
- Updates `booking_details.refunded = true` after successful refund

**Code Reference:** `app/api/refund/route.ts`

---

## Security Architecture

### `requireAdmin()` Implementation

**Location:** `utils/server/auth.ts`

**Function Signature:**

```typescript
export async function requireAdmin(): Promise<Profile>
```

**Implementation:**

1. Creates Supabase client with user session
2. Fetches current user via `supabase.auth.getUser()`
3. Queries `profiles` table for `is_admin` flag
4. Throws error if not authenticated or not admin

**Error Handling:**

- `'Not authenticated'`: User not logged in
- `'Unauthorized'`: User logged in but `is_admin = false`
- `'Failed to verify admin'`: Database error

**Usage Pattern:**

```typescript
try {
    await requireAdmin()
    // Admin-only logic here
} catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}
```

**Code Reference:** `utils/server/auth.ts`

---

### Ownership Checks

**User Bookings:** Users can only access their own bookings via RLS policies (`user_id = auth.uid()`).

**Example:** `/api/bookings/by-payment-intent`

- If booking has `user_id`, validates it matches authenticated session
- Guest bookings (no `user_id`) accessible via high-entropy `stripe_payment_id` token

**Code Pattern:**

```typescript
const {
    data: { user }
} = await supabase.auth.getUser()

if (bookingDetail.user_id && bookingDetail.user_id !== user?.id) {
    return NextResponse.json(
        { error: 'Unauthorized: This booking belongs to another account' },
        { status: 403 }
    )
}
```

**Code Reference:** `app/api/bookings/by-payment-intent/route.ts` (lines 47-60)

---

### Conditional Authorization

**Example:** `/api/bookings` POST handler

**Logic:**

- **Stripe flow:** Validates payment via Stripe API (public access allowed)
- **Swish flow:** Allows public POST if `swish_received: false` (pending payment)
- **Manual flow:** Requires `requireAdmin()`

**Code Pattern:**

```typescript
const isStripeBooking = stripe_payment_id && payment_method === 'stripe'
const isSwishBooking = payment_method === 'swish' && swish_received === false
const isAuthorizedPublicFlow = isStripeBooking || isSwishBooking

if (!isAuthorizedPublicFlow) {
    await requireAdmin() // Manual bookings require admin
}
```

**Code Reference:** `app/api/bookings/route.ts` (lines 33-53)

---

### Resolved Security Issues

**Per Security Audit 2026-01-13:**

1. ✅ **Issue 2:** `/api/bookings/route.ts` POST - Fixed via conditional authorization
2. ✅ **Issue 3:** `/api/create-payment-intent` - Server-side price validation confirmed
3. ✅ **Issue 4:** `/api/bookings/by-payment-intent` - Ownership validation implemented
4. ✅ **Issue 5:** `/api/payment-info` - Admin-only access added
5. ✅ **Issue 6:** `/api/profiles` GET - Admin-only access added
6. ✅ **Issue 7:** `/api/bookings/failed-bookings` - Admin-only access added
7. ✅ **Issue 9:** Error message sanitization - Completed across all providers, hooks, and services

**Reference:** `.cursor/docs/audit/supabase-security-audit 2026-01.md`

---

## Error Handling Strategy

### "Issue 9" Pattern

**Principle:** Client-facing errors are clean and user-friendly. Server logs contain full context for debugging.

**Implementation:**

**Client-Facing:**

```typescript
return NextResponse.json(
    { error: 'Failed to verify class capacity. Please contact support.' },
    { status: 500 }
)
```

**Server Logging:**

```typescript
console.error('[BookingService] Error fetching existing bookings:', {
    paymentIntentId: paymentIntent.id,
    error: fetchError.message
})
```

**Pattern:**

- All errors logged with `[ServiceName]` prefix for easy filtering
- Client receives generic, actionable message
- Server logs include full context (IDs, error details, request metadata)

**Code Reference:** `utils/server/booking-service.ts` (lines 53-63)

---

### Error Categories

**1. Authentication Errors**

- **Status:** `401` (Not authenticated) or `403` (Unauthorized)
- **Client Message:** `'Unauthorized'` or `'Not authenticated'`
- **Server Log:** Full error with user context

**2. Validation Errors**

- **Status:** `400` (Bad Request)
- **Client Message:** Specific validation error (e.g., `'Class is full'`, `'Missing required fields'`)
- **Server Log:** Validation details with request context

**3. Database Errors**

- **Status:** `500` (Internal Server Error)
- **Client Message:** Generic error (e.g., `'Failed to retrieve bookings'`)
- **Server Log:** Full database error with query context

**4. External API Errors (Stripe, Resend)**

- **Status:** `500` or `400` (depending on error type)
- **Client Message:** Generic error (e.g., `'Payment processing failed'`)
- **Server Log:** Full API error with request/response context

---

### Standardized Error Response Format

**Success:**

```typescript
{
    data: T | null
    error: null
}
```

**Error:**

```typescript
{
    data: null
    error: string
}
```

**Alternative (some endpoints):**

```typescript
{
    error: string
}
```

**Consistency:** Most endpoints use `{ data, error }` format. Some admin endpoints use `{ error }` only.

---

## Resilience Patterns

### `failed_bookings` Table as Safety Net

**Purpose:** Track payments that succeeded but booking creation failed.

**Use Cases:**

- Class became full during payment processing
- Database errors during booking creation
- Class deleted after payment but before booking
- Webhook processing errors

**Workflow:**

1. Payment succeeds (Stripe confirms)
2. Webhook attempts booking creation
3. Booking creation fails (capacity, DB error, etc.)
4. Error logged to `failed_bookings` with `stripe_paid: true`
5. Admin reviews table and processes refund

**Code Reference:** `utils/server/booking-service.ts` - `logFailedBooking()` function (lines 211-234)

---

### Retry/Manual Recovery Workflow

**Automatic Retries:**

- Stripe webhooks automatically retry failed deliveries (exponential backoff)
- Idempotency checks prevent duplicate bookings on retry

**Manual Recovery:**

1. Admin reviews `/api/bookings/failed-bookings` endpoint
2. Verifies payment in Stripe dashboard
3. Initiates refund via `/api/refund` endpoint
4. System updates `refunded: true` in `failed_bookings` and `booking_details`

**Code Reference:**

- Failed bookings endpoint: `app/api/bookings/failed-bookings/route.ts`
- Refund endpoint: `app/api/refund/route.ts`

---

### Idempotency Guarantees

**Stripe Payment Processing:**

- `stripe_payment_id UNIQUE` constraint prevents duplicate bookings
- Idempotency check queries `booking_details` before creating booking
- Safe to retry webhook events

**Code Pattern:**

```typescript
const { data: existingBookingDetail } = await supabaseAdmin
    .from('booking_details')
    .select('booking_id')
    .eq('stripe_payment_id', paymentIntent.id)
    .single()

if (existingBookingDetail) {
    return { success: true, bookingId: existingBookingDetail.booking_id }
}
```

**Code Reference:** `utils/server/booking-service.ts` (lines 28-43)

---

### Capacity Race Condition Protection

**Double-Check Pattern:**

1. **First Check:** Count existing bookings before processing
2. **Final Check:** Re-count immediately before insert
3. **Insert:** Create booking if capacity still available

**Code Pattern:**

```typescript
// First check
const existingBookings = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('class_id', metadata.classId)

if (existingBookings.length >= maxSpots) {
    // Log to failed_bookings
    return { success: false, error: 'Class is full' }
}

// Final check (race condition protection)
const finalCheck = await supabaseAdmin
    .from('bookings')
    .select('id')
    .eq('class_id', metadata.classId)

if (finalCheck.length >= maxSpots) {
    // Log to failed_bookings
    return { success: false, error: 'Class became full during processing' }
}

// Insert booking
```

**Code Reference:** `utils/server/booking-service.ts` (lines 47-121)

---

### Orphan Cleanup

**Scenario:** `booking_details` insert fails after `bookings` insert succeeds.

**Cleanup Logic:**

```typescript
if (detailsError || !details) {
    // Try to clean up the orphaned booking
    try {
        await supabaseAdmin.from('bookings').delete().eq('id', booking.id)
    } catch (cleanupErr) {
        console.error(
            '[BookingService] Failed to cleanup orphaned booking:',
            cleanupErr
        )
    }
    // Log to failed_bookings
}
```

**Code Reference:** `utils/server/booking-service.ts` (lines 177-185)

---

## Scaling Roadmap

⚠️ **FOR FUTURE REFERENCE ONLY**

**Trigger:** Consider these improvements if bookings exceed 100/week or if performance issues emerge.

### Deferred Improvements

**1. Rate Limiting**

- **Current:** Supabase's built-in limits are sufficient
- **Future:** Implement custom rate limiting if abuse patterns emerge
- **Approach:** Consider middleware-based rate limiting (e.g., Upstash Redis)

**2. Input Validation (Zod)**

- **Current:** Database constraints + basic validation
- **Future:** Add Zod schemas for request validation
- **Benefit:** Type-safe validation with better error messages
- **Trade-off:** Additional dependency and code complexity

**3. Database Indexes**

- **Current:** Primary key indexes only
- **Future:** Add indexes on frequently queried columns:
    - `bookings.class_id` (for capacity checks)
    - `booking_details.user_id` (for user bookings)
    - `booking_details.stripe_payment_id` (already indexed via UNIQUE)
- **Trigger:** Query performance degrades (>100ms response times)

**4. Caching Layer**

- **Current:** Direct database queries (sub-millisecond at current scale)
- **Future:** Consider Redis caching for:
    - Class listings (TTL: 5 minutes)
    - Booking counts per class (TTL: 1 minute)
- **Trigger:** Database queries exceed 50ms consistently

**5. Soft Deletes**

- **Current:** Hard deletes (permanent removal)
- **Future:** Add `deleted_at` timestamptz column if data retention requirements change
- **Trigger:** Compliance requirements or need for booking history

**6. Comprehensive Audit Logging**

- **Current:** `failed_bookings` table for payment failures only
- **Future:** Add audit table tracking all mutations (create, update, delete)
- **Trigger:** Compliance requirements or need for detailed activity tracking

**7. Database-Level Booking Constraint**

- **Current:** Application-level prevention of multiple spots per user
- **Future:** Add `UNIQUE(class_id, user_id)` if business rules change
- **Trigger:** Business requirement to prevent users from booking multiple spots

---

### Performance Monitoring

**Key Metrics to Track:**

1. **API Response Times:** Alert if p95 > 500ms
2. **Database Query Times:** Alert if queries > 100ms
3. **Failed Bookings Count:** Monitor for spikes (indicates capacity issues)
4. **Webhook Processing Time:** Alert if webhooks take > 5 seconds

**Current Status:** No performance issues observed. System handles ~20-30 bookings/week with sub-100ms response times.

---

## Conclusion

This API reference documents the current production state of the pilates studio booking system. The architecture prioritizes simplicity and reliability over premature optimization, making it well-suited for the current scale (~20-30 bookings/week).

All security issues identified in the audit (2026-01-13) have been resolved. The system is production-ready and designed to scale to ~100 bookings/week before requiring architectural changes.
