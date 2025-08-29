import { NextResponse } from 'next/server';
import { tasks } from '../data';


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const task = tasks.find((t: { id: number }) => t.id === Number(id));
    if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task);
}
