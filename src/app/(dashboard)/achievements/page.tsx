'use client'

import React from 'react'
import { AchievementsGrid } from '@/components/gamification'

export default function AchievementsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground">
            Track your learning progress and unlock achievements as you grow your skills.
          </p>
        </div>
        
        <AchievementsGrid />
      </div>
    </div>
  )
}