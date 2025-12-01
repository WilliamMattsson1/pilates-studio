import { ClassItem } from '@/types/classes'

const mockClasses: ClassItem[] = [
    // Oktober klasser (redan gångna)
    {
        id: '1',
        title: 'Matta Pilates',
        date: '2025-10-16',
        start_time: '10:00',
        end_time: '11:00',
        max_spots: 8,
        created_at: '2025-12-01:39:33.25876+00'
    },
    {
        id: '2',
        title: 'Reformer Classic',
        date: '2025-10-23',
        start_time: '15:00',
        end_time: '16:00',
        max_spots: 8,
        created_at: '2025-12-01:39:33.25876+00'
    },

    // Denna vecka: 27/11 - 29/11 (v.48)
    {
        id: '3',
        title: 'Core Flow',
        date: '2025-11-25',
        start_time: '09:00',
        end_time: '10:00',
        max_spots: 8,
        created_at: '2025-12-01:39:33.25876+00'
    },
    {
        id: '4',
        title: 'Matta Pilates',
        date: '2025-11-27',
        start_time: '14:00',
        end_time: '15:00',
        max_spots: 8,
        created_at: '2025-12-01:39:33.25876+00'
    },
    {
        id: '5',
        title: 'Power Pilates',
        date: '2025-11-28',
        start_time: '16:00',
        end_time: '17:00',
        max_spots: 8,
        created_at: '2025-12-01:39:33.25876+00'
    },
    {
        id: '6',
        title: 'Yoga Flow',
        date: '2025-11-29',
        start_time: '11:00',
        end_time: '12:00',
        max_spots: 8,
        created_at: '2025-12-01:39:33.25876+00'
    },
    // Nästa vecka: 3/12 - 5/12 (v.49)
    {
        id: '7',
        title: 'Core Flow',
        date: '2025-12-03',
        start_time: '09:00',
        end_time: '10:00',
        max_spots: 8,
        created_at: '2025-12-01:39:33.25876+00'
    },
    {
        id: '8',
        title: 'Reformer Classic',
        date: '2025-12-04',
        start_time: '14:00',
        end_time: '15:00',
        max_spots: 8,
        created_at: '2025-12-01:39:33.25876+00'
    },
    {
        id: '9',
        title: 'Power Pilates',
        date: '2025-12-05',
        start_time: '10:00',
        end_time: '11:00',
        max_spots: 8,
        created_at: '2025-12-01:39:33.25876+00'
    },

    // Vecka 2 nästa år: januari 2026
    {
        id: '10',
        title: 'Matta Pilates',
        date: '2026-01-08',
        start_time: '09:00',
        end_time: '10:00',
        max_spots: 8,
        created_at: '2025-12-01:39:33.25876+00'
    },
    {
        id: '11',
        title: 'Core Flow',
        date: '2026-01-10',
        start_time: '15:00',
        end_time: '16:00',
        max_spots: 8,
        created_at: '2025-12-01:39:33.25876+00'
    }
]

export { mockClasses }
