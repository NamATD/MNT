"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3999';

interface User {
    _id: string;
    username: string;
}

interface Task {
    _id: string;
    title: string;
    description: string;
    assignedTo: {
        _id: string;
    };
    projectId?: string;
}

export default function EditTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [projectId, setProjectId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const params = useParams();
    const taskId = params.id as string;

    // In a real app, you would fetch users from an API
    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        // Fetch task details
        const fetchTask = async () => {
            try {
                const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch task');
                }

                const task = await response.json();

                // Initialize form with task data
                setTitle(task.title);
                setDescription(task.description);
                setAssignedTo(task.assignedTo._id);
                setProjectId(task.projectId || '');
            } catch (error) {
                console.error('Error fetching task:', error);
                setError('Failed to load task. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        // This is a placeholder - in your real application,
        // you would fetch users from your API
        setUsers([
            { _id: '68593ab9f027cb8e98c59f35', username: 'admin' },
            // Add more mock users or fetch them from your API
        ]);

        fetchTask();
    }, [taskId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !assignedTo) {
            setError('Please fill all required fields.');
            return;
        }

        setSubmitting(true);
        setError(null);

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('assignedTo', assignedTo);

        if (projectId) {
            formData.append('projectId', projectId);
        }

        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: 'PUT',  // Note: You may need to implement this endpoint in your backend
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            router.push(`/dashboard/${taskId}`);
        } catch (error) {
            console.error('Error updating task:', error);
            setError('Failed to update task. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
                <p>Loading task details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Task</h1>
                    <button
                        onClick={() => router.push(`/dashboard/${taskId}`)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Cancel
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                            Assigned To *
                        </label>
                        <select
                            id="assignedTo"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a user</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                            Project ID (optional)
                        </label>
                        <input
                            id="projectId"
                            type="text"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                            New Attachment (optional)
                        </label>
                        <input
                            id="file"
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">Leave empty to keep the current file</p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}