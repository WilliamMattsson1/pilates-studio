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
    activeStudents: number
}

const ProfilesContext = createContext<ProfilesContextType | undefined>(
    undefined
)

export const ProfilesProvider = ({ children }: { children: ReactNode }) => {
    const [profiles, setProfiles] = useState<Profile[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/profiles')
                const data: { profiles?: Profile[] } = await res.json()
                setProfiles(data.profiles || [])
            } catch (err) {
                console.error('Failed to fetch profiles', err)
            }
        }

        fetchData()
    }, [])

    return (
        <ProfilesContext.Provider
            value={{
                activeStudents: profiles.length
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
