'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ViewTask() {
    const [task, setTask] = useState<{ id: number; title: string; description: string } | null>(null);
    const params = useParams();
    const id = params.id;
    const router = useRouter();

    useEffect(() => {
        async function fetchTask() {
            const res = await fetch(`/api/tasks/${id}`);
            const task = await res.json();
            setTask(task);
        }
        fetchTask();
    }, [id, router]);

    if (!task) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Task Details (Client-Side)</h1>
            <div className="border p-4 rounded">
                <h2 className="text-xl font-semibold">Title: {task.title}</h2>
                <p className="mt-2">Description: {task.description}</p>
                <div className="mt-4 space-x-2">
                    <Link href="/" className="bg-gray-500 text-white px-4 py-2 rounded">
                        Back to List
                    </Link>

                </div>
            </div>
        </div>
    );
}