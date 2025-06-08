'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useGamification } from '@/hooks/useGamification'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { Leaderboard as LeaderboardType, LeaderboardPeriod, LeaderboardEntry } from '@/lib/gamification/types'

interface LeaderboardProps {
  className?: string
}

export function Leaderboard({ className }: LeaderboardProps) {
  const { getLeaderboard, isLoading } = useGamification()
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardType | null>(null)
  const [activePeriod, setActivePeriod] = useState<LeaderboardPeriod>('all-time')

  useEffect(() => {
    loadLeaderboard()
  }, [activePeriod])

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard(activePeriod, 100)
      setLeaderboard(data)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Icons.crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Icons.medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Icons.award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const periods: { value: LeaderboardPeriod; label: string }[] = [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'all-time', label: 'All Time' }
  ]

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!leaderboard) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Icons.trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Unable to load leaderboard</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activePeriod} onValueChange={(value) => setActivePeriod(value as LeaderboardPeriod)}>
            <TabsList className="grid w-full grid-cols-4">
              {periods.map((period) => (
                <TabsTrigger key={period.value} value={period.value} className="text-xs">
                  {period.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activePeriod} className="mt-6">
              {/* Top 3 Podium */}
              {leaderboard.entries.length >= 3 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-center">Top Performers</h3>
                  <div className="flex items-end justify-center gap-4 mb-6">
                    {/* Second Place */}
                    <PodiumCard entry={leaderboard.entries[1]} position={2} />
                    
                    {/* First Place */}
                    <PodiumCard entry={leaderboard.entries[0]} position={1} />
                    
                    {/* Third Place */}
                    <PodiumCard entry={leaderboard.entries[2]} position={3} />
                  </div>
                </div>
              )}

              {/* Full Rankings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Rankings
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {leaderboard.total_participants} participants
                  </Badge>
                </div>

                {/* Current User Rank (if not in top visible) */}
                {leaderboard.user_rank && leaderboard.user_rank > 10 && (
                  <Card className="border-primary bg-primary/5">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Badge className={getRankBadgeColor(leaderboard.user_rank)}>
                          #{leaderboard.user_rank}
                        </Badge>
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              You
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Your Position</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm">{user?.user_metadata?.total_points || 0} pts</div>
                            <div className="text-xs text-muted-foreground">Level {user?.user_metadata?.current_level || 1}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Top Rankings List */}
                <div className="space-y-2">
                  {leaderboard.entries.slice(0, 10).map((entry) => (
                    <LeaderboardRow
                      key={entry.user_id}
                      entry={entry}
                      isCurrentUser={entry.user_id === user?.id}
                    />
                  ))}
                </div>

                {/* Show More Button */}
                {leaderboard.entries.length > 10 && (
                  <div className="text-center pt-4">
                    <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">
                      View Full Rankings
                    </Badge>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: number }) {
  const heights = { 1: 'h-24', 2: 'h-20', 3: 'h-16' }
  const podiumColors = {
    1: 'bg-gradient-to-t from-yellow-400 to-yellow-600',
    2: 'bg-gradient-to-t from-gray-300 to-gray-500',
    3: 'bg-gradient-to-t from-amber-400 to-amber-600'
  }

  return (
    <div className="flex flex-col items-center">
      <Card className={cn(
        'mb-2 border-2',
        position === 1 && 'border-yellow-400',
        position === 2 && 'border-gray-400',
        position === 3 && 'border-amber-400'
      )}>
        <CardContent className="p-3 text-center">
          <Avatar className="h-12 w-12 mx-auto mb-2">
            <AvatarImage src={entry.avatar_url || ''} />
            <AvatarFallback className="text-xs">
              {entry.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium text-sm truncate max-w-[80px]">
            {entry.username}
          </div>
          <div className="text-xs text-muted-foreground">
            {entry.points} pts
          </div>
          <div className="text-xs text-muted-foreground">
            Level {entry.level}
          </div>
        </CardContent>
      </Card>
      
      {/* Podium Base */}
      <div className={cn(
        'w-16 rounded-t-lg flex items-end justify-center text-white font-bold text-lg',
        heights[position as keyof typeof heights],
        podiumColors[position as keyof typeof podiumColors]
      )}>
        {position}
      </div>
    </div>
  )
}

function LeaderboardRow({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser: boolean }) {
  return (
    <Card className={cn(
      'transition-colors hover:bg-muted/50',
      isCurrentUser && 'border-primary bg-primary/5'
    )}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-12">
            {entry.rank <= 3 ? (
              <div className="flex items-center justify-center w-8 h-8">
                {entry.rank === 1 && <Icons.crown className="h-5 w-5 text-yellow-500" />}
                {entry.rank === 2 && <Icons.medal className="h-5 w-5 text-gray-400" />}
                {entry.rank === 3 && <Icons.award className="h-5 w-5 text-amber-600" />}
              </div>
            ) : (
              <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-xs">
                {entry.rank}
              </Badge>
            )}
          </div>

          <Avatar className="h-8 w-8">
            <AvatarImage src={entry.avatar_url || ''} />
            <AvatarFallback className="text-xs">
              {entry.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {entry.full_name || entry.username}
              {isCurrentUser && (
                <Badge variant="secondary" className="ml-2 text-xs">You</Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {entry.achievements_count} achievements
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold text-sm">{entry.points} pts</div>
            <div className="text-xs text-muted-foreground">Level {entry.level}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}