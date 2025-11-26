import { ClassItem } from '@/types/classes'

const mockClasses: ClassItem[] = [
    // Oktober klasser (redan gångna)
    {
        id: 1,
        title: 'Matta Pilates',
        date: '2025-10-16',
        startTime: '10:00',
        endTime: '11:00',
        maxSpots: 8
    },
    {
        id: 2,
        title: 'Reformer Classic',
        date: '2025-10-23',
        startTime: '15:00',
        endTime: '16:00',
        maxSpots: 8
    },

    // Denna vecka: 27/11 - 29/11 (v.48)
    {
        id: 3,
        title: 'Core Flow',
        date: '2025-11-25',
        startTime: '09:00',
        endTime: '10:00',
        maxSpots: 8
    },
    {
        id: 4,
        title: 'Matta Pilates',
        date: '2025-11-27',
        startTime: '14:00',
        endTime: '15:00',
        maxSpots: 8
    },
    {
        id: 5,
        title: 'Power Pilates',
        date: '2025-11-28',
        startTime: '16:00',
        endTime: '17:00',
        maxSpots: 8
    },
    {
        id: 6,
        title: 'Yoga Flow',
        date: '2025-11-29',
        startTime: '11:00',
        endTime: '12:00',
        maxSpots: 8
    },
    // Nästa vecka: 3/12 - 5/12 (v.49)
    {
        id: 7,
        title: 'Core Flow',
        date: '2025-12-03',
        startTime: '09:00',
        endTime: '10:00',
        maxSpots: 8
    },
    {
        id: 8,
        title: 'Reformer Classic',
        date: '2025-12-04',
        startTime: '14:00',
        endTime: '15:00',
        maxSpots: 8
    },
    {
        id: 9,
        title: 'Power Pilates',
        date: '2025-12-05',
        startTime: '10:00',
        endTime: '11:00',
        maxSpots: 8
    },

    // Vecka 2 nästa år: januari 2026
    {
        id: 10,
        title: 'Matta Pilates',
        date: '2026-01-08',
        startTime: '09:00',
        endTime: '10:00',
        maxSpots: 8
    },
    {
        id: 11,
        title: 'Core Flow',
        date: '2026-01-10',
        startTime: '15:00',
        endTime: '16:00',
        maxSpots: 8
    }
]

export { mockClasses }
