import { cn } from '@/lib/utils'
import { Icons } from '@/components/ui/icons'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={cn('flex items-center justify-center min-h-[200px]', className)}>
      <Icons.spinner className={cn('animate-spin text-primary', sizeClasses[size])} />
    </div>
  )
}