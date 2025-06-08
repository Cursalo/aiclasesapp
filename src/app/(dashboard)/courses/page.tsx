'use client'

import React from 'react'
import { CourseCatalog } from '@/components/courses'

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
          <p className="text-muted-foreground">
            Discover and enroll in courses to expand your knowledge and skills.
          </p>
        </div>
        
        <CourseCatalog />
      </div>
    </div>
  )
}