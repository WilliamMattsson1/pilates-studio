# Resend Email System Documentation

**Version:** 1.0
**Last Updated:** 2026-01-21
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Technical Setup](#technical-setup)
3. [Email Flow Architecture](#email-flow-architecture)
4. [Templates](#templates)
5. [Implementation Guide](#implementation-guide)
6. [Testing & Debugging](#testing--debugging)
7. [Maintenance Notes](#maintenance-notes)

---

## Overview

The email system is a critical component of the booking confirmation workflow, providing users with immediate confirmation after successful payment. Emails are sent automatically via **Resend**, a modern transactional email service that offers excellent deliverability, React-based templates, and developer-friendly APIs.

### Role in Application

Transactional emails serve a single, focused purpose: **booking confirmation**. When a user completes a Stripe payment for a Pilates class, the system automatically sends a confirmation email containing:

- Booking details (class title, date, time, price)
- Cancellation policy reminder
- Links to view all classes
- Social media links (Instagram, TikTok)

The email system is **non-blocking**—if email sending fails, the booking is still created successfully. This ensures payment processing reliability while maintaining a smooth user experience.

### Why Resend?

Resend was chosen for several reasons:

1. **React Email Integration:** Templates are written as React components using `@react-email/components`, allowing for type-safe, reusable email templates that can be previewed in the browser
2. **Developer Experience:** Simple API, excellent TypeScript support, and clear error messages
3. **Deliverability:** High inbox placement rates and built-in domain verification
4. **Cost-Effective:** Generous free tier (3,000 emails/month) suitable for current scale (~20-30 bookings/week)
5. **Modern Stack:** Aligns with Next.js and React ecosystem

### High-Level Architecture

```
┌─────────────────┐
│  Stripe Payment │
│     Success     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Stripe Webhook Handler │
│  /api/webhooks/stripe   │
└────────┬────────────────┘
         │
         ├──► Create Booking (Database)
         │
         └──► Send Email (Non-blocking)
              │
              ▼
         ┌──────────────────┐
         │  Email Service   │
         │  (Resend Client) │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  Resend API      │
         │  (Delivery)      │
         └──────────────────┘
```

**Key Design Principles:**

- **Non-Blocking:** Email failures don't prevent booking creation
- **Server-Side Only:** Email service runs exclusively on the server (never exposed to client)
- **Type-Safe:** Full TypeScript support for templates and service functions
- **Error Resilient:** Errors are logged but don't crash the webhook handler

---

## Technical Setup

### Required Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `RESEND_API_KEY` | Resend API key from dashboard | `re_1234567890abcdef` | Yes |

**Location:** Set in `.env.local` for development, environment variables in production (Vercel, etc.)

**Security Note:** Never commit API keys to version control. The service throws an error at module initialization if the key is missing.

### Resend Dashboard Configuration

1. **Create Account:** Sign up at [resend.com](https://resend.com)
2. **Generate API Key:**
   - Navigate to **API Keys** in dashboard
   - Click **Create API Key**
   - Copy the key (starts with `re_`)
   - Store securely in environment variables

3. **Domain Verification (Production):**
   - Navigate to **Domains** in dashboard
   - Add your sending domain (e.g., `williammattsson.se`)
   - Add DNS records (SPF, DKIM, DMARC) as instructed
   - Wait for verification (typically 5-15 minutes)
   - Once verified, update `from` address in `email-service.ts`

### Development vs Production

**Development:**
- Uses Resend's test mode (emails sent but may not deliver)
- Can use any `from` address (e.g., `onboarding@resend.dev`)
- No domain verification required
- API key from development environment

**Production:**
- Requires verified domain for `from` address
- Current production `from`: `Pilates Team <kontakt@williammattsson.se>`
- Must use production API key
- Monitor delivery rates in Resend dashboard

**Current Configuration:**

```typescript
// utils/server/email-service.ts
from: 'Pilates Team <kontakt@williammattsson.se>'
```

**Note:** The domain `williammattsson.se` must be verified in Resend dashboard for production emails to deliver successfully.

---

## Email Flow Architecture

### Booking Confirmation Email Flow

The booking confirmation email is triggered automatically after a successful Stripe payment. Here's the complete flow:

#### Step-by-Step Flow

```
1. USER ACTION
   └─► User completes Stripe payment on checkout page
       │
       ▼
2. STRIPE PROCESSING
   └─► Stripe processes payment
       │
       ▼
3. WEBHOOK EVENT
   └─► Stripe sends payment_intent.succeeded event
       │
       ▼
4. WEBHOOK HANDLER
   └─► /api/webhooks/stripe receives event
       │
       ├─► Verify webhook signature (security)
       ├─► Extract payment metadata
       ├─► Check idempotency (prevent duplicates)
       ├─► Validate class capacity
       │
       ▼
5. BOOKING CREATION
   └─► Create booking in database
       │
       ├─► Insert into bookings table
       └─► Insert into booking_details table
       │
       ▼
6. EMAIL TRIGGER (Non-blocking)
   └─► Call sendBookingEmail() with booking data
       │
       ├─► If email succeeds: Log success
       └─► If email fails: Log error (booking still created)
       │
       ▼
7. RESEND API
   └─► Resend receives email request
       │
       ├─► Renders React template to HTML
       └─► Sends email to recipient
       │
       ▼
8. DELIVERY
   └─► Email delivered to user's inbox
```

#### Error States and Retry Logic

**Email Sending Failures:**

The email system is designed to be **non-blocking**. If email sending fails:

1. **Error is logged** to console with `[EmailService]` prefix
2. **Booking is still created** (payment succeeded, booking confirmed)
3. **Webhook returns success** (200 status)
4. **User receives booking confirmation** via UI (payment success page)

**Error Handling Pattern:**

```typescript
// In webhook handler
const emailResult = await sendBookingEmail({ ... })

if (!emailResult.success) {
    console.error('[Webhook] Email sending failed (non-fatal):', {
        paymentIntentId: paymentIntent.id,
        bookingId: bookingResult.bookingId,
        error: emailResult.error
    })
    // Webhook still returns 200 - booking was created successfully
}
```

**Resend API Failures:**

Resend automatically retries failed API requests. If Resend's API is temporarily unavailable:

- Resend SDK will retry the request
- If all retries fail, error is caught and logged
- Booking creation is unaffected

**No Manual Retry Mechanism:**

Currently, there's no automatic retry for failed emails. If an email fails to send:

- Error is logged in server logs
- Admin can manually resend via Resend dashboard (if needed)
- User still has booking confirmation in UI

**Future Improvement:** Consider adding a retry queue for failed emails (e.g., using a job queue like Bull or Upstash Queue).

---

## Templates

### File Locations and Naming Conventions

**Template Component:**
- **Location:** `components/email/BookingConfirmationEmail.tsx`
- **Naming:** PascalCase, descriptive of email purpose
- **Export:** Named export (default export also available for preview)

**Email Service:**
- **Location:** `utils/server/email-service.ts`
- **Naming:** `sendBookingEmail()` function

**Preview Page:**
- **Location:** `app/(root)/email-preview/page.tsx`
- **Purpose:** Visual preview of email template in browser

### Template Structure

Templates use **React Email** (`@react-email/components`), which provides:

- Email-safe HTML components
- Tailwind CSS support (with limitations)
- Responsive design utilities
- Type-safe props

**Key Components Used:**

- `Html`, `Head`, `Body` - Email document structure
- `Container`, `Section` - Layout components
- `Heading`, `Text`, `Link` - Typography
- `Img` - Images (must use absolute URLs)
- `Tailwind` - Tailwind CSS wrapper (limited support)

### Editing Copy and Styling

**To Edit Email Copy:**

1. Open `components/email/BookingConfirmationEmail.tsx`
2. Modify text content in `Text` or `Heading` components
3. Save and test via preview page (`/email-preview`)

**To Edit Styling:**

1. Use inline `style` props for reliable email client support
2. Use Tailwind classes (limited support, test in email clients)
3. Use `className` props (converted to inline styles by React Email)

**Email Client Limitations:**

- Not all CSS properties work in email clients
- Use inline styles for critical styling
- Test in multiple email clients (Gmail, Outlook, Apple Mail)
- Images must use absolute URLs (not relative paths)

### Props/Data Passed to Template

**Interface:** `BookingConfirmationEmailProps`

```typescript
interface BookingConfirmationEmailProps {
    guestName: string           // User's name (or "Guest" if not provided)
    classTitle: string          // Class title from database
    classDate: string          // Class date (YYYY-MM-DD format)
    classTime: string          // Class time range (e.g., "09:00 - 10:00")
    price: string              // Formatted price (e.g., "200kr")
    linkUrl: string            // URL to view all classes
    tiktokUrl?: string          // Optional TikTok link (default provided)
    instagramUrl?: string      // Optional Instagram link (default provided)
}
```

**Data Source:**

All data comes from Stripe PaymentIntent metadata, which is set during payment intent creation:

```typescript
// In /api/create-payment-intent
metadata: {
    classId: string
    userId: string | null
    guestName: string | null
    guestEmail: string
    classTitle: string
    classDate: string
    classTime: string
    amount: string
}
```

### Complete Template Example

```typescript
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Section,
    Tailwind,
    Text
} from '@react-email/components'

interface BookingConfirmationEmailProps {
    guestName: string
    classTitle: string
    classDate: string
    classTime: string
    price: string
    linkUrl: string
    tiktokUrl?: string
    instagramUrl?: string
}

export const BookingConfirmationEmail = ({
    guestName,
    classTitle,
    classDate,
    classTime,
    price,
    linkUrl,
    tiktokUrl = 'https://www.tiktok.com/@krittayapra',
    instagramUrl = 'https://www.instagram.com/pilateswith.krittaya/'
}: BookingConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Tailwind>
                <Body
                    className="bg-white font-raycast p-4"
                    style={{
                        backgroundColor: '#ebe5e0'
                    }}
                >
                    <Container className="mx-auto my-0 pt-5 px-1 pb-1 bg-secondary-bg max-w-[650px]">
                        {/* Logo */}
                        <Img
                            src="https://pilates-studio-xi.vercel.app/images/logo.png"
                            width={140}
                            height={54}
                            alt="Pilates Logo"
                            className="flex justify-center mx-auto"
                        />

                        {/* Heading */}
                        <Heading className="text-[26px] font-bold mt-12 text-center">
                            🎉 Din Pilatesbokning är bekräftad!
                        </Heading>

                        {/* Greeting */}
                        <Text className="text-base mt-4 text-center">
                            Hej {guestName}, tack för att du bokat en Pilates klass
                            hos oss!
                        </Text>

                        {/* Booking Details */}
                        <Section className="mt-6 p-3 flex justify-center">
                            <Text className="text-base leading-6">
                                <strong>Klass:</strong> {classTitle}
                            </Text>
                            <Text className="text-base leading-6">
                                <strong>Datum:</strong> {classDate} Tid: {classTime}
                            </Text>
                            <Text className="text-base leading-6">
                                <strong>Pris:</strong> {price}
                            </Text>
                            <Text className="leading-6 mt-2 italic text-gray-600 text-sm">
                                Fri avbokning om du avbryter minst 12 timmar innan sessionen startar
                            </Text>
                        </Section>

                        {/* Social Links */}
                        <Section className="mt-6 text-center">
                            <Text className="text-base mb-2">
                                Följ oss på sociala medier:
                            </Text>
                            <div className="flex justify-center gap-4">
                                <Link href={tiktokUrl} className="text-black underline">
                                    TikTok
                                </Link>
                                <Link href={instagramUrl} className="text-black underline">
                                    Instagram
                                </Link>
                            </div>
                        </Section>

                        {/* CTA Button */}
                        <Section className="mt-10 flex justify-center">
                            <Link
                                className="text-white text-center bg-btn rounded-lg p-4"
                                style={{
                                    backgroundColor: '#704f44'
                                }}
                                href={linkUrl}
                            >
                                Klicka här för att se alla klasser
                            </Link>
                        </Section>

                        {/* Signature */}
                        <Section className="mt-10 flex justify-center">
                            <table role="presentation" style={{ borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ paddingRight: '8px', verticalAlign: 'middle' }}>
                                            <Img
                                                src="https://pilates-studio-xi.vercel.app/images/logo.png"
                                                width={140}
                                                height={40}
                                                alt="Pilates Logo"
                                                style={{ display: 'block' }}
                                            />
                                        </td>
                                        <td>
                                            <Text className="text-base leading-6.5">
                                                Vänliga hälsningar,
                                                <br />
                                                <span className="italic fancy-font font-semibold">
                                                    Pilates With Krittaya
                                                </span>
                                            </Text>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        <Hr className="border-[#dddddd] mt-12" />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
```

**Key Design Notes:**

- Uses Swedish language (`Din Pilatesbokning är bekräftad!`)
- Includes cancellation policy reminder
- Social media links (TikTok, Instagram)
- CTA button linking to classes page
- Branded signature with logo

---

## Implementation Guide

### Booking Confirmation Email

#### Trigger Conditions

**Automatic Trigger:**
- Stripe payment succeeds (`payment_intent.succeeded` event)
- Booking is successfully created in database
- Email is sent regardless of user authentication status (works for guests)

**Manual Trigger (Future):**
- Currently no manual resend functionality
- Could be added to admin dashboard for failed emails

#### API Endpoint

**Not a direct API endpoint.** Email is triggered internally from:

- **File:** `app/api/webhooks/stripe/route.ts`
- **Function:** `POST` handler
- **Line:** ~127 (after booking creation)

#### Template Used

- **Component:** `BookingConfirmationEmail`
- **Location:** `components/email/BookingConfirmationEmail.tsx`
- **Service Function:** `sendBookingEmail()`
- **Location:** `utils/server/email-service.ts`

#### Data Passed

**From Stripe PaymentIntent Metadata:**

```typescript
{
    guestName: metadata.guestName || 'Guest',
    guestEmail: metadata.guestEmail,
    classTitle: metadata.classTitle,
    classDate: metadata.classDate,
    classTime: metadata.classTime,
    price: `${metadata.amount}kr`,
    linkUrl: 'https://pilates-studio-xi.vercel.app/classes#available-classes'
}
```

**Metadata Source:**

Set during payment intent creation in `/api/create-payment-intent`:

```typescript
metadata: {
    classId: string
    userId: string | null
    guestName: string | null
    guestEmail: string
    classTitle: string
    classDate: string
    classTime: string
    amount: string
}
```

#### Example Implementation

**Service Function Call:**

```typescript
// In app/api/webhooks/stripe/route.ts
const emailResult = await sendBookingEmail({
    guestName: metadata.guestName || 'Guest',
    guestEmail: metadata.guestEmail,
    classTitle: metadata.classTitle,
    classDate: metadata.classDate,
    classTime: metadata.classTime,
    price: `${metadata.amount}kr`,
    linkUrl: 'https://pilates-studio-xi.vercel.app/classes#available-classes'
})

if (!emailResult.success) {
    console.error('[Webhook] Email sending failed (non-fatal):', {
        paymentIntentId: paymentIntent.id,
        bookingId: bookingResult.bookingId,
        error: emailResult.error
    })
}
```

**Service Function Implementation:**

```typescript
// In utils/server/email-service.ts
export async function sendBookingEmail(
    params: SendBookingEmailParams
): Promise<SendBookingEmailResponse> {
    try {
        await resend.emails.send({
            from: 'Pilates Team <kontakt@williammattsson.se>',
            to: [params.guestEmail],
            subject: 'Your Pilates Booking is Confirmed!',
            react: BookingConfirmationEmail(params)
        })

        return { success: true }
    } catch (error: unknown) {
        console.error('[EmailService] Email sending failed:', error)

        return {
            success: false,
            error: 'Failed to send confirmation email. Please check your dashboard.'
        }
    }
}
```

#### Example cURL Request

**Note:** Email sending is not exposed as a public API endpoint. It's only called internally from the webhook handler. However, for testing purposes, you could create a test endpoint:

```bash
# This would require a test endpoint (not currently implemented)
curl -X POST https://your-domain.com/api/test-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "guestName": "Test User",
    "guestEmail": "test@example.com",
    "classTitle": "Morning Pilates Flow",
    "classDate": "2025-12-05",
    "classTime": "09:00 - 10:00",
    "price": "200kr",
    "linkUrl": "https://pilates-studio-xi.vercel.app/classes"
  }'
```

**Current Testing Method:** Use the email preview page at `/email-preview` to visually test the template.

---

## Testing & Debugging

### Local Testing Setup

**1. Preview Email Template:**

Navigate to `/email-preview` in your browser to see a rendered version of the email template with sample data.

**File:** `app/(root)/email-preview/page.tsx`

**Preview Data:**
```typescript
guestName="Alice Svensson"
classTitle="Morning Pilates Flow"
classDate="2025-12-05"
classTime="09:00 - 10:00"
price="200kr"
```

**2. Test Email Sending (Development):**

**Option A: Use Resend Test Mode**

1. Set `RESEND_API_KEY` in `.env.local` (use a test API key)
2. Trigger a test booking via Stripe test mode
3. Check Resend dashboard for sent emails (may not deliver in test mode)

**Option B: Use React Email CLI (Recommended for Template Development)**

```bash
# Install React Email CLI (if not already installed)
npm install -g react-email

# Start preview server
npx react-email dev
```

This starts a local server at `http://localhost:3000` where you can preview and test email templates.

**3. Test with Real Email (Development):**

1. Use a real email address in test booking
2. Complete Stripe test payment
3. Check email inbox (may go to spam in test mode)
4. Verify email content and links

### Testing Without Sending Real Emails

**Method 1: Preview Page**

- Navigate to `/email-preview`
- Visual inspection of template
- No email sent

**Method 2: React Email Dev Server**

```bash
npx react-email dev
```

- Edit template in real-time
- Preview in browser
- Export HTML for email client testing
- No API calls made

**Method 3: Mock Resend Service (Advanced)**

Create a mock version of `email-service.ts` for unit tests:

```typescript
// __mocks__/email-service.ts
export async function sendBookingEmail() {
    return { success: true }
}
```

### Common Issues and Solutions

#### Issue 1: "RESEND_API_KEY is missing"

**Error:**
```
Error: RESEND_API_KEY is missing
```

**Solution:**
1. Check `.env.local` file exists
2. Verify `RESEND_API_KEY=re_...` is set
3. Restart development server after adding environment variable
4. In production, verify environment variable is set in hosting platform (Vercel, etc.)

#### Issue 2: Emails Not Delivering

**Symptoms:**
- Email service returns success
- No email received
- No errors in logs

**Solutions:**

1. **Check Resend Dashboard:**
   - Navigate to Resend dashboard → Logs
   - Check for delivery failures or bounces
   - Verify domain is verified (production)

2. **Check Spam Folder:**
   - Test emails often go to spam
   - Check spam/junk folder
   - Add sender to contacts

3. **Verify Domain (Production):**
   - Ensure sending domain is verified in Resend
   - Check DNS records (SPF, DKIM, DMARC)
   - Wait for DNS propagation (up to 24 hours)

4. **Check Email Address:**
   - Verify recipient email is valid
   - Test with a different email provider (Gmail, Outlook)

#### Issue 3: Template Rendering Issues

**Symptoms:**
- Email received but styling broken
- Images not displaying
- Layout misaligned

**Solutions:**

1. **Use Inline Styles:**
   - Email clients have limited CSS support
   - Prefer inline `style` props over Tailwind classes
   - Test in multiple email clients

2. **Absolute Image URLs:**
   - Images must use absolute URLs (not relative)
   - Current: `https://pilates-studio-xi.vercel.app/images/logo.png`
   - Verify images are publicly accessible

3. **Test in Email Clients:**
   - Use React Email's export feature
   - Test in Gmail, Outlook, Apple Mail
   - Use email testing services (Litmus, Email on Acid)

#### Issue 4: Email Sending Fails Silently

**Symptoms:**
- No error in UI
- Email not sent
- No logs visible

**Solutions:**

1. **Check Server Logs:**
   - Look for `[EmailService]` prefixed logs
   - Check webhook handler logs for email errors
   - Verify error handling is working

2. **Check Resend Dashboard:**
   - Navigate to Resend → Logs
   - Check for API errors or rate limits
   - Verify API key is valid

3. **Add More Logging:**
   ```typescript
   console.log('[EmailService] Attempting to send email:', {
       to: params.guestEmail,
       subject: 'Your Pilates Booking is Confirmed!'
   })
   ```

### Relevant Logs and Error Messages

**Success Log:**
```
[Webhook] Confirmation email sent: {
    paymentIntentId: 'pi_...',
    bookingId: '123',
    guestEmail: 'user@example.com'
}
```

**Error Log:**
```
[EmailService] Email sending failed: [Error details]
[Webhook] Email sending failed (non-fatal): {
    paymentIntentId: 'pi_...',
    bookingId: '123',
    error: 'Failed to send confirmation email...'
}
```

**Module Initialization Error:**
```
Error: RESEND_API_KEY is missing
```

**Resend API Error:**
```
[EmailService] Email sending failed: {
    message: 'Invalid API key',
    status: 401
}
```

**Where to Find Logs:**

- **Development:** Terminal/console output
- **Production:** Vercel logs, or your hosting platform's log viewer
- **Resend Dashboard:** Logs section shows all API requests and responses

---

## Maintenance Notes

### Rate Limits and Quotas

**Resend Free Tier:**
- **3,000 emails/month** (free)
- **100 emails/day** (free tier limit)
- **No rate limit per second** (reasonable use)

**Current Usage:**
- ~20-30 bookings/week
- ~80-120 emails/month
- Well within free tier limits

**Upgrade Considerations:**

If email volume exceeds free tier:

1. **Pro Tier:** $20/month for 50,000 emails
2. **Monitor Usage:** Check Resend dashboard monthly
3. **Set Alerts:** Configure usage alerts in Resend dashboard

**Rate Limiting:**

Resend doesn't enforce strict rate limits, but:

- Avoid sending bursts of >100 emails/second
- Current implementation sends one email per booking (no bulk sends)
- No rate limiting code needed at current scale

### Monitoring Recommendations

**1. Resend Dashboard Monitoring:**

- **Weekly Check:** Review delivery rates
- **Monthly Check:** Review usage vs. quota
- **Alert Setup:** Configure email alerts for:
  - Delivery failures
  - Bounce rate increases
  - Quota approaching limits

**2. Application Logs:**

Monitor for email-related errors:

```bash
# Filter logs for email errors
grep -i "EmailService" logs.txt
grep -i "email sending failed" logs.txt
```

**3. Key Metrics to Track:**

- **Delivery Rate:** % of emails successfully delivered
- **Bounce Rate:** % of emails bounced (invalid addresses)
- **Open Rate:** % of emails opened (if tracking enabled)
- **Error Rate:** % of email sends that fail

**4. Alert Thresholds:**

Set up alerts if:
- Email failure rate > 5%
- Bounce rate > 10%
- Quota usage > 80% of limit

### Future Improvements

**1. Email Retry Queue**

**Current Limitation:** Failed emails are not automatically retried.

**Proposed Solution:**
- Implement job queue (Bull, Upstash Queue)
- Retry failed emails with exponential backoff
- Max 3 retry attempts
- Log permanently failed emails

**2. Email Templates for Other Events**

**Potential New Templates:**
- Class cancellation notification
- Reminder email (24 hours before class)
- Welcome email (new user signup)
- Password reset email (currently handled by Supabase)

**3. Email Preferences**

**Future Feature:**
- Allow users to opt-out of marketing emails
- Keep transactional emails (booking confirmations) mandatory
- Store preferences in user profile

**4. A/B Testing**

**Future Feature:**
- Test different email subject lines
- Test different CTA button text
- Measure open rates and click-through rates

**5. Email Analytics**

**Future Feature:**
- Track email opens (pixel tracking)
- Track link clicks
- Dashboard showing email performance metrics

### Known Limitations

**1. No Manual Resend**

- Currently no way to manually resend failed emails
- Workaround: Use Resend dashboard to resend (if needed)
- Future: Add admin dashboard feature for manual resend

**2. No Email Queue**

- Emails sent synchronously (blocking call, but non-fatal)
- If Resend API is slow, webhook response time increases
- Future: Implement async email queue

**3. Limited Error Recovery**

- Failed emails are logged but not automatically retried
- Admin must manually review failed emails
- Future: Implement automatic retry mechanism

**4. Single Email Type**

- Only booking confirmation emails currently implemented
- Other transactional emails (cancellations, reminders) not yet added
- Future: Expand email system for additional events

**5. No Email Tracking**

- No open tracking or click tracking
- Cannot measure email engagement
- Future: Enable Resend's tracking features (if needed)

---

## Conclusion

The Resend email system provides a reliable, developer-friendly solution for transactional emails in the Pilates booking application. The system is designed for simplicity and reliability, with non-blocking email sending that ensures booking creation is never delayed by email failures.

**Key Strengths:**
- ✅ React-based templates (type-safe, previewable)
- ✅ Non-blocking design (booking creation unaffected by email failures)
- ✅ Simple API and excellent developer experience
- ✅ Generous free tier suitable for current scale

**Areas for Future Enhancement:**
- Email retry queue for failed sends
- Additional email templates (cancellations, reminders)
- Manual resend functionality in admin dashboard
- Email analytics and tracking

The system is production-ready and handles the current email volume (~80-120 emails/month) efficiently. As the application scales, consider implementing the improvements outlined in the "Future Improvements" section.
