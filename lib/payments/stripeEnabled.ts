/**
 * Central feature flag for enabling/disabling Stripe payments.
 *
 * - When STRIPE_ENABLED === 'false' --> Stripe is considered OFF --> Here we use swish payments manually
 * - When STRIPE_ENABLED === 'true'  --> Stripe is considered ON
 * - When STRIPE_ENABLED is missing --> we default to ON
 *
 * This flag is evaluated on the server and in build-time client bundles.
 * Business expectation: operations can flip STRIPE_ENABLED to 'false'
 * to temporarily pause all stripe payments (e.g. incident, accounting),
 * without touching code.
 */
export function isStripeEnabled(): boolean {
    const flag = process.env.NEXT_PUBLIC_STRIPE_ENABLED
    if (flag === undefined) {
        // Default ON if not explicitly configured
        return true
    }
    return flag === 'true'
}
