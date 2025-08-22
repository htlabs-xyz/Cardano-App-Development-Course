import { NextResponse } from 'next/server'
import { tasks } from './data'
 
export async function GET() {
  const data =  tasks
  return NextResponse.json(data)
}