import { BookingItem } from '@/types/bookings'

const mockBookings: BookingItem[] = [
    {
        id: '1',
        class_id: '3',
        guest_name: 'Alice Svensson',
        guest_email: 'alice@example.com',
        created_at: '2025-11-20T10:00:00Z'
    },
    {
        id: '2',
        class_id: '3',
        guest_name: 'Bob Andersson',
        guest_email: 'bob@example.com',
        created_at: '2025-11-20T11:30:00Z'
    },
    {
        id: '3',
        class_id: '3',
        guest_name: 'Carl Lind',
        guest_email: 'carl@example.com',
        created_at: '2025-11-21T12:45:00Z'
    },
    {
        id: '4',
        class_id: '3',
        guest_name: 'Diana Ström',
        guest_email: 'diana@example.com',
        created_at: '2025-11-21T14:20:00Z'
    },
    {
        id: '5',
        class_id: '3',
        guest_name: 'Eva Karlsson',
        guest_email: 'eva@example.com',
        created_at: '2025-11-22T09:05:00Z'
    },
    {
        id: '6',
        class_id: '3',
        guest_name: 'Frank Bergman',
        guest_email: 'frank@example.com',
        created_at: '2025-11-22T15:30:00Z'
    },
    {
        id: '7',
        class_id: '3',
        guest_name: 'Greta Nilsson',
        guest_email: 'greta@example.com',
        created_at: '2025-11-23T11:00:00Z'
    },
    // Klass 4
    {
        id: '8',
        class_id: '4',
        guest_name: 'Henrik Holm',
        guest_email: 'henrik@example.com',
        created_at: '2025-11-19T10:00:00Z'
    },
    {
        id: '9',
        class_id: '4',
        guest_name: 'Ingrid Johansson',
        guest_email: 'ingrid@example.com',
        created_at: '2025-11-19T11:30:00Z'
    },
    {
        id: '10',
        class_id: '4',
        guest_name: 'Jens Lundström',
        guest_email: 'jens@example.com',
        created_at: '2025-11-20T09:15:00Z'
    },
    {
        id: '11',
        class_id: '4',
        guest_name: 'Kristina Öberg',
        guest_email: 'kristina@example.com',
        created_at: '2025-11-20T13:45:00Z'
    },
    {
        id: '12',
        class_id: '4',
        guest_name: 'Lars Pettersson',
        guest_email: 'lars@example.com',
        created_at: '2025-11-21T08:30:00Z'
    },
    {
        id: '13',
        class_id: '4',
        guest_name: 'Maria Sundström',
        guest_email: 'maria@example.com',
        created_at: '2025-11-21T16:00:00Z'
    },
    {
        id: '14',
        class_id: '4',
        guest_name: 'Niklas Bergström',
        guest_email: 'niklas@example.com',
        created_at: '2025-11-22T10:20:00Z'
    },
    {
        id: '15',
        class_id: '4',
        guest_name: 'Olivia Forsberg',
        guest_email: 'olivia@example.com',
        created_at: '2025-11-22T14:50:00Z'
    },
    // Klass 5
    {
        id: '16',
        class_id: '5',
        guest_name: 'Pär Gustafsson',
        guest_email: 'par@example.com',
        created_at: '2025-11-21T09:00:00Z'
    },
    {
        id: '17',
        class_id: '5',
        guest_name: 'Quintin Hansson',
        guest_email: 'quintin@example.com',
        created_at: '2025-11-21T10:30:00Z'
    },
    {
        id: '18',
        class_id: '5',
        guest_name: 'Rune Ivarsson',
        guest_email: 'rune@example.com',
        created_at: '2025-11-22T11:00:00Z'
    },
    {
        id: '19',
        class_id: '5',
        guest_name: 'Sonja Jakobsson',
        guest_email: 'sonja@example.com',
        created_at: '2025-11-22T14:15:00Z'
    },
    {
        id: '20',
        class_id: '5',
        guest_name: 'Torsten Karlén',
        guest_email: 'torsten@example.com',
        created_at: '2025-11-23T08:45:00Z'
    },
    {
        id: '21',
        class_id: '5',
        guest_name: 'Ulrika Lundqvist',
        guest_email: 'ulrika@example.com',
        created_at: '2025-11-23T12:30:00Z'
    },
    // Klass 6
    {
        id: '22',
        class_id: '6',
        guest_name: 'Viktor Malmström',
        guest_email: 'viktor@example.com',
        created_at: '2025-11-22T09:00:00Z'
    },
    {
        id: '23',
        class_id: '6',
        guest_name: 'Wendy Nordin',
        guest_email: 'wendy@example.com',
        created_at: '2025-11-22T10:30:00Z'
    },
    {
        id: '24',
        class_id: '6',
        guest_name: 'Xavier Olsson',
        guest_email: 'xavier@example.com',
        created_at: '2025-11-23T11:00:00Z'
    },
    {
        id: '25',
        class_id: '6',
        guest_name: 'Yvonne Pehrsson',
        guest_email: 'yvonne@example.com',
        created_at: '2025-11-23T13:20:00Z'
    },
    {
        id: '26',
        class_id: '6',
        guest_name: 'Zacharias Qvist',
        guest_email: 'zacharias@example.com',
        created_at: '2025-11-24T09:15:00Z'
    },
    // Klass 7
    {
        id: '27',
        class_id: '7',
        guest_name: 'Åsa Rosén',
        guest_email: 'asa@example.com',
        created_at: '2025-11-25T10:00:00Z'
    },
    {
        id: '28',
        class_id: '7',
        guest_name: 'Börje Samuelsson',
        guest_email: 'borje@example.com',
        created_at: '2025-11-25T11:30:00Z'
    },
    // Klass 8
    {
        id: '29',
        class_id: '8',
        guest_name: 'Cecilia Torstenson',
        guest_email: 'cecilia@example.com',
        created_at: '2025-11-25T09:00:00Z'
    },
    // Klass 9
    {
        id: '30',
        class_id: '9',
        guest_name: 'Dag Uhlmann',
        guest_email: 'dag@example.com',
        created_at: '2025-11-25T14:00:00Z'
    },
    {
        id: '31',
        class_id: '9',
        guest_name: 'Elvira Vänström',
        guest_email: 'elvira@example.com',
        created_at: '2025-11-25T15:30:00Z'
    },
    // Klass 10
    {
        id: '32',
        class_id: '10',
        guest_name: 'Filip Wahlberg',
        guest_email: 'filip@example.com',
        created_at: '2025-12-01T10:00:00Z'
    },
    // Klass 11
    {
        id: '33',
        class_id: '11',
        guest_name: 'Gunnar Xström',
        guest_email: 'gunnar@example.com',
        created_at: '2025-12-02T11:00:00Z'
    },
    {
        id: '34',
        class_id: '11',
        guest_name: 'Hedda Yfeldt',
        guest_email: 'hedda@example.com',
        created_at: '2025-12-02T13:30:00Z'
    }
]

export { mockBookings }
