import { NextResponse } from 'next/server';
import { tasks } from '../tasks';


export async function GET({ params }: { params: { id: string } }) {
    const task = tasks.find((t: { id: number }) => t.id === Number(params.id));
    if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task);
}