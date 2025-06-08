'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/ui/icons'
import { CourseCard } from './course-card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useCourses } from '@/hooks/useCourses'
import type { Course, CourseCatalogFilters, CourseCatalogSort } from '@/lib/courses/types'

interface CourseCatalogProps {
  initialFilters?: CourseCatalogFilters
  showFilters?: boolean
  maxCourses?: number
  className?: string
}

export function CourseCatalog({ 
  initialFilters = {}, 
  showFilters = true, 
  maxCourses,
  className 
}: CourseCatalogProps) {
  const { getCourses, isLoading } = useCourses()
  const [courses, setCourses] = useState<Course[]>([])
  const [totalCourses, setTotalCourses] = useState(0)
  const [filters, setFilters] = useState<CourseCatalogFilters>(initialFilters)
  const [sort, setSort] = useState<CourseCatalogSort>({ field: 'created_at', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  
  const coursesPerPage = 12

  useEffect(() => {
    loadCourses()
  }, [filters, sort, currentPage])

  const loadCourses = async () => {
    try {
      const offset = (currentPage - 1) * coursesPerPage
      const limit = maxCourses ? Math.min(maxCourses, coursesPerPage) : coursesPerPage
      
      const { courses: fetchedCourses, total } = await getCourses(
        filters,
        sort,
        limit,
        offset
      )
      
      setCourses(fetchedCourses)
      setTotalCourses(total)
    } catch (error) {
      console.error('Error loading courses:', error)
    }
  }

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchQuery }))
    setCurrentPage(1)
  }

  const handleFilterChange = (key: keyof CourseCatalogFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(totalCourses / coursesPerPage)

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'UI/UX Design',
    'Database',
    'Cybersecurity',
  ]

  const tags = [
    'JavaScript',
    'React',
    'Python',
    'Node.js',
    'TypeScript',
    'AWS',
    'Docker',
    'MongoDB',
  ]

  return (
    <div className={className}>
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button size="sm" onClick={handleSearch}>
                      <Icons.search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={filters.category || ''}
                    onValueChange={(value) => handleFilterChange('category', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={filters.difficulty || ''}
                    onValueChange={(value) => handleFilterChange('difficulty', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Select
                    value={filters.price || ''}
                    onValueChange={(value) => handleFilterChange('price', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select
                    value={filters.duration || ''}
                    onValueChange={(value) => handleFilterChange('duration', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any duration</SelectItem>
                      <SelectItem value="short">Short (&lt; 2 hours)</SelectItem>
                      <SelectItem value="medium">Medium (2-10 hours)</SelectItem>
                      <SelectItem value="long">Long (&gt; 10 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Minimum Rating */}
                <div className="space-y-2">
                  <Label>Minimum Rating</Label>
                  <Select
                    value={filters.rating?.toString() || ''}
                    onValueChange={(value) => handleFilterChange('rating', value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any rating</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="2">2+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {tags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag}
                          checked={filters.tags?.includes(tag) || false}
                          onCheckedChange={(checked) => {
                            const currentTags = filters.tags || []
                            const newTags = checked
                              ? [...currentTags, tag]
                              : currentTags.filter(t => t !== tag)
                            handleFilterChange('tags', newTags.length > 0 ? newTags : undefined)
                          }}
                        />
                        <Label htmlFor={tag} className="text-sm">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Course Grid */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {filters.search ? `Search results for "${filters.search}"` : 'Courses'}
              </h2>
              <p className="text-muted-foreground">
                {totalCourses} course{totalCourses !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Label className="text-sm">Sort by:</Label>
              <Select
                value={`${sort.field}-${sort.direction}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split('-') as [string, 'asc' | 'desc']
                  setSort({ field: field as any, direction })
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at-desc">Newest First</SelectItem>
                  <SelectItem value="created_at-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                  <SelectItem value="price-asc">Price Low to High</SelectItem>
                  <SelectItem value="price-desc">Price High to Low</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                  <SelectItem value="popularity-desc">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Applied Filters */}
          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.category && (
                <Badge variant="secondary">
                  Category: {filters.category}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => handleFilterChange('category', undefined)}
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.difficulty && (
                <Badge variant="secondary">
                  Level: {filters.difficulty}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => handleFilterChange('difficulty', undefined)}
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.price && (
                <Badge variant="secondary">
                  Price: {filters.price}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => handleFilterChange('price', undefined)}
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.tags && filters.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => {
                      const newTags = filters.tags!.filter(t => t !== tag)
                      handleFilterChange('tags', newTags.length > 0 ? newTags : undefined)
                    }}
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Loading State */}
          {isLoading && <LoadingSpinner />}

          {/* Course Grid */}
          {!isLoading && (
            <>
              {courses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icons.search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms.
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}

              {/* Pagination */}
              {!maxCourses && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <Icons.chevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                      if (page > totalPages) return null
                      
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <Icons.chevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}