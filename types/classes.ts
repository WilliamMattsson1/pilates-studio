// types som har med classes att göra

interface ClassItem {
    id: string // uuid från Supabase
    title: string // "Core pilates"
    date: string // lagras som "YYYY-MM-DD" i Supabase
    start_time: string // t.ex. "14:00"
    end_time: string // t.ex. "15:00"
    max_spots: number // int2
    price: number // int2
    created_at: string // timestamptz från Supabase
}

interface WeekGroup {
    year: number
    week: number
    classes: ClassItem[]
}

export type { ClassItem, WeekGroup }
