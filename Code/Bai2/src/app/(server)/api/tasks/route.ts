import { NextResponse } from 'next/server';
import { tasks } from './tasks';

export async function GET() {
  return NextResponse.json(tasks);
}