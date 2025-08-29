'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [tasks, setTasks] = useState<{ id: number; title: string; description: string }[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    }
    fetchTasks();
  }, []);


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task List (Client-Side)</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <div className="mt-2 space-x-2">
              <Link href={`/view/${task.id}`} className=" bg-green-800 text-white px-4 py-2 rounded ">
                View
              </Link>
             
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}