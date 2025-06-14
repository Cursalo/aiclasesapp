'use client'

import React from 'react'
import { Leaderboard } from '@/components/gamification'

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you rank among other learners in the community.
          </p>
        </div>
        
        <Leaderboard />
      </div>
    </div>
  )
}