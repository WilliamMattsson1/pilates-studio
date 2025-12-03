'use client'
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react'

interface Profile {
    id: string
    name: string
    email: string
}

interface ProfilesContextType {
    profiles: Profile[]
    activeStudents: number
    reloadProfiles: () => void
}

const ProfilesContext = createContext<ProfilesContextType | undefined>(
    undefined
)

export const ProfilesProvider = ({ children }: { children: ReactNode }) => {
    const [profiles, setProfiles] = useState<Profile[]>([])

    const fetchProfiles = async () => {
        const res = await fetch('/api/profiles')
        const data = await res.json()
        setProfiles(data.profiles || [])
    }

    useEffect(() => {
        fetchProfiles()
    }, [])

    return (
        <ProfilesContext.Provider
            value={{
                profiles,
                activeStudents: profiles.length,
                reloadProfiles: fetchProfiles
            }}
        >
            {children}
        </ProfilesContext.Provider>
    )
}

export const useProfiles = () => {
    const context = useContext(ProfilesContext)
    if (!context)
        throw new Error('useProfiles must be used within ProfilesProvider')
    return context
}
