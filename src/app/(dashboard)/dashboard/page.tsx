'use client'

import React from 'react'
import { 
  DashboardHeader,
  ContinueLearning,
  RecentAchievements,
  LearningGoals,
  RecommendedCourses,
  QuickActions
} from '@/components/dashboard'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <DashboardHeader />

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning */}
          <ContinueLearning />
          
          {/* Recommended Courses */}
          <RecommendedCourses />
          
          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Learning Goals */}
          <LearningGoals />
          
          {/* Recent Achievements */}
          <RecentAchievements />
        </div>
      </div>
    </div>
  )
}