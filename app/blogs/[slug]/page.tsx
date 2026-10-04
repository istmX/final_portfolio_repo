'use client'
import React from 'react'
import { useParams } from 'next/navigation'
function Blog(slug: string) {
const params = useParams()
  return (
    <div>{params.slug}</div>
  )
}

export default Blog