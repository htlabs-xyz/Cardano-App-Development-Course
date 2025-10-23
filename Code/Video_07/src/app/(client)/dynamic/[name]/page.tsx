
"use client"
import React from 'react'
import { useParams } from 'next/navigation';

export default function DynamicPage() {
  const params = useParams();
  const p = params.name;
  return (
    <div>dynamic page :  {p}</div>
  )
}