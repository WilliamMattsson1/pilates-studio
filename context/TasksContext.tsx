'use client'

import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback
} from 'react'

export interface Task {
    id: string
    title: string
    desc: string
}

interface TasksContextType {
    tasks: Task[]
    fetchTasks: () => Promise<void>
    addTask: (task: Omit<Task, 'id'>) => Promise<void>
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([])

    // Fetch tasks from API
    const fetchTasks = useCallback(async () => {
        try {
            const res = await fetch('/api/tasks')
            if (!res.ok) throw new Error('Failed to fetch tasks')
            const data = await res.json()
            setTasks(data)
        } catch (err) {
            console.error(err)
        }
    }, [])

    // Add a new task via API
    const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            })
            if (!res.ok) throw new Error('Failed to add task')

            const data: Task[] = await res.json() // detta är den nya tasken från insert

            // Lägg till den nya tasken i befintlig state
            setTasks((prev) => [...prev, ...data])
        } catch (err) {
            console.error(err)
        }
    }, [])

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    return (
        <TasksContext.Provider value={{ tasks, fetchTasks, addTask }}>
            {children}
        </TasksContext.Provider>
    )
}

// Custom hook
export const useTasks = () => {
    const context = useContext(TasksContext)
    if (!context) {
        throw new Error('useTasks must be used within TasksProvider')
    }
    return context
}
