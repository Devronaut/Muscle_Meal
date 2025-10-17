export interface WorkoutSet {
  reps: number
  weight: number
}

export interface Workout {
  id: string
  date: Date
  exerciseName: string
  sets: WorkoutSet[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Nutrition {
  id: string
  date: Date
  foodName?: string
  calories: number
  protein: number
  carbs: number
  fats: number
  createdAt: Date
  updatedAt: Date
}

export interface DailyStats {
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
  totalWorkoutVolume: number
}

export interface WeeklyStats {
  week: string
  avgCalories: number
  avgProtein: number
  avgCarbs: number
  avgFats: number
  totalWorkoutVolume: number
}

export interface Goal {
  id: string
  name: string
  type: string
  category: string
  calories?: number
  protein?: number
  carbs?: number
  fats?: number
  workouts?: number
  volume?: number
  isActive: boolean
  startDate: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface GoalProgress {
  goal: Goal
  current: {
    calories: number
    protein: number
    carbs: number
    fats: number
    workouts: number
    volume: number
  }
  progress: {
    calories: number // percentage
    protein: number
    carbs: number
    fats: number
    workouts: number
    volume: number
  }
}

export type CreateWorkoutData = Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>
export type CreateNutritionData = Omit<Nutrition, 'id' | 'createdAt' | 'updatedAt'>
export type CreateGoalData = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>

// Analytics interfaces
export interface TrendData {
  period: string
  calories: number
  protein: number
  carbs: number
  fats: number
  workoutVolume: number
  workoutCount: number
}

export interface PerformancePattern {
  bestDay: string
  mostConsistentDay: string
  averageWorkoutsPerWeek: number
  consistencyScore: number
  improvementRate: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  category: 'streak' | 'milestone' | 'improvement' | 'consistency'
}

export interface PersonalRecord {
  exerciseName: string
  recordType: 'maxWeight' | 'maxVolume' | 'maxReps'
  value: number
  date: Date
  previousRecord?: number
}

export interface AnalyticsData {
  trends: TrendData[]
  patterns: PerformancePattern
  achievements: Achievement[]
  personalRecords: PersonalRecord[]
  improvements: {
    caloriesImprovement: number
    proteinImprovement: number
    workoutVolumeImprovement: number
    workoutCountImprovement: number
  }
  summary: {
    totalWeeks: number
    totalAchievements: number
    totalRecords: number
    averageConsistency: number
  }
}
