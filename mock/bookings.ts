import { BookingItem } from '@/types/bookings'

const mockBookings: BookingItem[] = [
    {
        id: 1,
        classId: 3,
        guestName: 'Alice Svensson',
        guestEmail: 'alice@example.com',
        bookedAt: '2025-11-20T10:00:00Z'
    },
    {
        id: 2,
        classId: 3,
        guestName: 'Bob Andersson',
        guestEmail: 'bob@example.com',
        bookedAt: '2025-11-20T11:30:00Z'
    },
    {
        id: 3,
        classId: 3,
        guestName: 'Carl Lind',
        guestEmail: 'carl@example.com',
        bookedAt: '2025-11-21T12:45:00Z'
    },
    {
        id: 4,
        classId: 3,
        guestName: 'Diana Ström',
        guestEmail: 'diana@example.com',
        bookedAt: '2025-11-21T14:20:00Z'
    },
    {
        id: 5,
        classId: 3,
        guestName: 'Eva Karlsson',
        guestEmail: 'eva@example.com',
        bookedAt: '2025-11-22T09:05:00Z'
    },
    {
        id: 6,
        classId: 3,
        guestName: 'Frank Bergman',
        guestEmail: 'frank@example.com',
        bookedAt: '2025-11-22T15:30:00Z'
    },
    {
        id: 7,
        classId: 3,
        guestName: 'Greta Nilsson',
        guestEmail: 'greta@example.com',
        bookedAt: '2025-11-23T11:00:00Z'
    },
    // Klass 4 (Matta Pilates, 27/11) - FULL (8 bokningar av 8)
    {
        id: 8,
        classId: 4,
        guestName: 'Henrik Holm',
        guestEmail: 'henrik@example.com',
        bookedAt: '2025-11-19T10:00:00Z'
    },
    {
        id: 9,
        classId: 4,
        guestName: 'Ingrid Johansson',
        guestEmail: 'ingrid@example.com',
        bookedAt: '2025-11-19T11:30:00Z'
    },
    {
        id: 10,
        classId: 4,
        guestName: 'Jens Lundström',
        guestEmail: 'jens@example.com',
        bookedAt: '2025-11-20T09:15:00Z'
    },
    {
        id: 11,
        classId: 4,
        guestName: 'Kristina Öberg',
        guestEmail: 'kristina@example.com',
        bookedAt: '2025-11-20T13:45:00Z'
    },
    {
        id: 12,
        classId: 4,
        guestName: 'Lars Pettersson',
        guestEmail: 'lars@example.com',
        bookedAt: '2025-11-21T08:30:00Z'
    },
    {
        id: 13,
        classId: 4,
        guestName: 'Maria Sundström',
        guestEmail: 'maria@example.com',
        bookedAt: '2025-11-21T16:00:00Z'
    },
    {
        id: 14,
        classId: 4,
        guestName: 'Niklas Bergström',
        guestEmail: 'niklas@example.com',
        bookedAt: '2025-11-22T10:20:00Z'
    },
    {
        id: 15,
        classId: 4,
        guestName: 'Olivia Forsberg',
        guestEmail: 'olivia@example.com',
        bookedAt: '2025-11-22T14:50:00Z'
    },
    // Klass 5 (Power Pilates, 28/11) - 2 platser kvar (6 bokningar av 8)
    {
        id: 16,
        classId: 5,
        guestName: 'Pär Gustafsson',
        guestEmail: 'par@example.com',
        bookedAt: '2025-11-21T09:00:00Z'
    },
    {
        id: 17,
        classId: 5,
        guestName: 'Quintin Hansson',
        guestEmail: 'quintin@example.com',
        bookedAt: '2025-11-21T10:30:00Z'
    },
    {
        id: 18,
        classId: 5,
        guestName: 'Rune Ivarsson',
        guestEmail: 'rune@example.com',
        bookedAt: '2025-11-22T11:00:00Z'
    },
    {
        id: 19,
        classId: 5,
        guestName: 'Sonja Jakobsson',
        guestEmail: 'sonja@example.com',
        bookedAt: '2025-11-22T14:15:00Z'
    },
    {
        id: 20,
        classId: 5,
        guestName: 'Torsten Karlén',
        guestEmail: 'torsten@example.com',
        bookedAt: '2025-11-23T08:45:00Z'
    },
    {
        id: 21,
        classId: 5,
        guestName: 'Ulrika Lundqvist',
        guestEmail: 'ulrika@example.com',
        bookedAt: '2025-11-23T12:30:00Z'
    },
    // Klass 6 (Yoga Flow, 29/11) - 3 platser kvar (5 bokningar av 8)
    {
        id: 22,
        classId: 6,
        guestName: 'Viktor Malmström',
        guestEmail: 'viktor@example.com',
        bookedAt: '2025-11-22T09:00:00Z'
    },
    {
        id: 23,
        classId: 6,
        guestName: 'Wendy Nordin',
        guestEmail: 'wendy@example.com',
        bookedAt: '2025-11-22T10:30:00Z'
    },
    {
        id: 24,
        classId: 6,
        guestName: 'Xavier Olsson',
        guestEmail: 'xavier@example.com',
        bookedAt: '2025-11-23T11:00:00Z'
    },
    {
        id: 25,
        classId: 6,
        guestName: 'Yvonne Pehrsson',
        guestEmail: 'yvonne@example.com',
        bookedAt: '2025-11-23T13:20:00Z'
    },
    {
        id: 26,
        classId: 6,
        guestName: 'Zacharias Qvist',
        guestEmail: 'zacharias@example.com',
        bookedAt: '2025-11-24T09:15:00Z'
    },
    // Klass 7 (Core Flow, 3/12) - några bokningar
    {
        id: 27,
        classId: 7,
        guestName: 'Åsa Rosén',
        guestEmail: 'asa@example.com',
        bookedAt: '2025-11-25T10:00:00Z'
    },
    {
        id: 28,
        classId: 7,
        guestName: 'Börje Samuelsson',
        guestEmail: 'borje@example.com',
        bookedAt: '2025-11-25T11:30:00Z'
    },
    // Klass 8 (Reformer Classic, 4/12) - några bokningar
    {
        id: 29,
        classId: 8,
        guestName: 'Cecilia Torstenson',
        guestEmail: 'cecilia@example.com',
        bookedAt: '2025-11-25T09:00:00Z'
    },
    // Klass 9 (Power Pilates, 5/12) - några bokningar
    {
        id: 30,
        classId: 9,
        guestName: 'Dag Uhlmann',
        guestEmail: 'dag@example.com',
        bookedAt: '2025-11-25T14:00:00Z'
    },
    {
        id: 31,
        classId: 9,
        guestName: 'Elvira Vänström',
        guestEmail: 'elvira@example.com',
        bookedAt: '2025-11-25T15:30:00Z'
    },
    // Klass 10 (Matta Pilates, 8/1) - några bokningar
    {
        id: 32,
        classId: 10,
        guestName: 'Filip Wahlberg',
        guestEmail: 'filip@example.com',
        bookedAt: '2025-12-01T10:00:00Z'
    },
    // Klass 11 (Core Flow, 10/1) - några bokningar
    {
        id: 33,
        classId: 11,
        guestName: 'Gunnar Xström',
        guestEmail: 'gunnar@example.com',
        bookedAt: '2025-12-02T11:00:00Z'
    },
    {
        id: 34,
        classId: 11,
        guestName: 'Hedda Yfeldt',
        guestEmail: 'hedda@example.com',
        bookedAt: '2025-12-02T13:30:00Z'
    }
]

export { mockBookings }
