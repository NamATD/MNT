"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
    _id: string;
    title: string;
    description: string;
    assignedTo: {
        _id: string;
        username: string;
    };
    createdBy: {
        _id: string;
        username: string;
    };
    progress: number;
    file?: string;
    projectId?: string;
}

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        // Fetch tasks
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:3000/tasks', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }

                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setError('Failed to load tasks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [router]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete task');
                }

                // Remove task from state
                setTasks(tasks.filter(task => task._id !== id));
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/dashboard/create')}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Create New Task
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                router.push('/');
                            }}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {loading && <p className="text-center py-4">Loading tasks...</p>}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {!loading && !error && tasks.length === 0 && (
                    <div className="text-center py-8 bg-white rounded shadow">
                        <p className="text-gray-600">No tasks found. Create your first task!</p>
                    </div>
                )}

                {tasks.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tasks.map(task => (
                                    <tr key={task._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{task.assignedTo?.username}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{ width: `${task.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500">{task.progress}%</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => router.push(`/dashboard/${task._id}`)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => router.push(`/dashboard/${task._id}/edit`)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}