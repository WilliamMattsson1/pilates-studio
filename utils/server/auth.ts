import { createClient } from '@/utils/supabase/server'

export async function requireAdmin() {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user?.user?.id) throw new Error('Not authenticated')

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.user.id)
        .single()

    if (error) throw new Error('Failed to verify admin')
    if (!profile?.is_admin) throw new Error('Unauthorized')

    return profile
}
