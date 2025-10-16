import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('card', className)}>
      {children}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  className?: string
}

export function StatCard({ title, value, subtitle, icon, className }: StatCardProps) {
  return (
    <div className={cn('stat-card group', className)}>
      <div className="flex items-center">
        {icon && (
          <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-200">
            {icon}
          </div>
        )}
        <div className="ml-4 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                {value}
              </div>
              {subtitle && (
                <div className="ml-2 text-sm text-gray-500">
                  {subtitle}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}
