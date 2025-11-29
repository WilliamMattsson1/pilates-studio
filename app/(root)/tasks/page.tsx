'use client'

import { useState } from 'react'
import { useTasks } from '@/context/TasksContext'

const TasksPage = () => {
    const { tasks, addTask } = useTasks()
    const [newTask, setNewTask] = useState({ title: '', desc: '' })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTask.title) return
        await addTask(newTask)
        setNewTask({ title: '', desc: '' })
    }

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                <input
                    value={newTask.title}
                    onChange={(e) =>
                        setNewTask((prev) => ({
                            ...prev,
                            title: e.target.value
                        }))
                    }
                    placeholder="Title"
                    className="border px-2 py-1 rounded"
                />
                <input
                    value={newTask.desc}
                    onChange={(e) =>
                        setNewTask((prev) => ({
                            ...prev,
                            desc: e.target.value
                        }))
                    }
                    placeholder="Description"
                    className="border px-2 py-1 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                    Add Task
                </button>
            </form>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id} className="mb-2">
                        <strong>{task.title}</strong>: {task.desc}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TasksPage
