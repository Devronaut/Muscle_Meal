import { type ClassValue, clsx } from 'clsx'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function formatDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm')
}

export function getTodayRange() {
  const today = new Date()
  return {
    start: startOfDay(today),
    end: endOfDay(today)
  }
}

export function getWeekRange(date: Date = new Date()) {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }), // Monday
    end: endOfWeek(date, { weekStartsOn: 1 })
  }
}

export function calculateWorkoutVolume(sets: Array<{reps: number, weight: number}>): number {
  return sets.reduce((total, set) => total + (set.reps * set.weight), 0)
}
