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

export function getMotivationalMessage(progress: number): { message: string; emoji: string; color: string } {
  if (progress >= 100) {
    return {
      message: "🎉 Amazing! You've crushed all your goals today! You're unstoppable!",
      emoji: "🏆",
      color: "text-green-600"
    }
  } else if (progress >= 90) {
    return {
      message: "🔥 Incredible! You're so close to perfection! Just a little more push!",
      emoji: "💪",
      color: "text-green-500"
    }
  } else if (progress >= 75) {
    return {
      message: "⭐ Fantastic! You're doing exceptionally well! Keep up the momentum!",
      emoji: "🚀",
      color: "text-blue-600"
    }
  } else if (progress >= 50) {
    return {
      message: "👍 Great progress! You're halfway there! You've got this!",
      emoji: "🎯",
      color: "text-yellow-600"
    }
  } else if (progress >= 25) {
    return {
      message: "💪 Good start! Every step counts. Keep building that momentum!",
      emoji: "🌱",
      color: "text-orange-600"
    }
  } else {
    return {
      message: "🌟 Ready to make today count? Let's start your fitness journey!",
      emoji: "🚀",
      color: "text-gray-600"
    }
  }
}

export function calculateWorkoutVolume(sets: Array<{reps: number, weight: number}>): number {
  return sets.reduce((total, set) => total + (set.reps * set.weight), 0)
}

export function calculateOverallProgress(goalProgress: any[]): number {
  if (!goalProgress || goalProgress.length === 0) return 0
  
  const progressValues = goalProgress.map(gp => {
    const progress = gp.progress
    return Math.max(
      progress.calories || 0,
      progress.protein || 0,
      progress.carbs || 0,
      progress.fats || 0
    )
  })
  
  return Math.max(...progressValues)
}
