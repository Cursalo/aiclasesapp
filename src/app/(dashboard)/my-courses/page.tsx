'use client'

import React from 'react'
import { MyCourses } from '@/components/courses'

export default function MyCoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">
            Manage your enrolled courses and track your learning progress.
          </p>
        </div>
        
        <MyCourses />
      </div>
    </div>
  )
}