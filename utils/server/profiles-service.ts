import { supabaseAdmin } from '@/utils/supabase/admin'
import { requireAdmin } from '@/utils/server/auth'

/**
 * Get the total count of profiles (active students).
 * Requires admin authentication.
 * Returns null if not admin or on error.
 */
export async function getProfilesCount(): Promise<number | null> {
    try {
        await requireAdmin()

        const { count, error } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        if (error) {
            console.error('[ProfilesService] Error fetching profiles count:', error)
            return null
        }

        return count ?? 0
    } catch (err: unknown) {
        // Silently return null for auth errors (no console.error for 403)
        // Only log unexpected errors
        if (err instanceof Error) {
            const isAuthError =
                err.message === 'Unauthorized' ||
                err.message === 'Not authenticated' ||
                err.message === 'Failed to verify admin'

            if (!isAuthError) {
                console.error('[ProfilesService] Unexpected error:', err)
            }
        }

        return null
    }
}
