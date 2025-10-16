export const workoutValidation = {
  exerciseName: (value: string) => {
    if (!value || value.trim().length === 0) {
      return 'Exercise name is required'
    }
    if (value.length > 100) {
      return 'Exercise name must be less than 100 characters'
    }
    return null
  },
  sets: (value: Array<{reps: number, weight: number}>) => {
    if (!value || value.length === 0) {
      return 'At least one set is required'
    }
    if (value.length > 50) {
      return 'Maximum 50 sets allowed'
    }
    for (const set of value) {
      if (set.reps < 1) {
        return 'Reps must be at least 1'
      }
      if (set.reps > 1000) {
        return 'Reps must be less than 1000'
      }
      if (set.weight < 0) {
        return 'Weight cannot be negative'
      }
      if (set.weight > 1000) {
        return 'Weight must be less than 1000kg'
      }
    }
    return null
  },
  date: (value: string | Date) => {
    if (!value) {
      return 'Date is required'
    }
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return 'Invalid date format'
    }
    return null
  }
}

export const nutritionValidation = {
  calories: (value: number) => {
    if (value < 0) {
      return 'Calories cannot be negative'
    }
    if (value > 10000) {
      return 'Calories must be less than 10,000'
    }
    return null
  },
  protein: (value: number) => {
    if (value < 0) {
      return 'Protein cannot be negative'
    }
    if (value > 1000) {
      return 'Protein must be less than 1000g'
    }
    return null
  },
  carbs: (value: number) => {
    if (value < 0) {
      return 'Carbs cannot be negative'
    }
    if (value > 1000) {
      return 'Carbs must be less than 1000g'
    }
    return null
  },
  fats: (value: number) => {
    if (value < 0) {
      return 'Fats cannot be negative'
    }
    if (value > 500) {
      return 'Fats must be less than 500g'
    }
    return null
  },
  date: (value: string | Date) => {
    if (!value) {
      return 'Date is required'
    }
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return 'Invalid date format'
    }
    return null
  }
}
