"use client"
import { useParams } from 'next/navigation'
import React from 'react'


function page(params: { slug: string }) {
  const { slug } = useParams<{ slug: string }>()
  return (
    <div>
        <h1> {params.slug}</h1>
    </div>
  )
}

export default page