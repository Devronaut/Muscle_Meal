const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedDummyData() {
  console.log('🌱 Seeding dummy data...')

  try {
    // Clear existing data
    await prisma.nutrition.deleteMany()
    await prisma.workout.deleteMany()
    console.log('✅ Cleared existing data')

    // Generate data for the last 3 weeks
    const today = new Date()
    const data = []
    
    console.log(`📅 Today is: ${today.toLocaleDateString()}`)

    // Week 1: Current week (last 7 days)
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      // Set time to morning to ensure proper date handling
      date.setHours(9, 0, 0, 0)
      
      // Add some nutrition entries
      const nutritionEntries = [
        {
          date: new Date(date),
          foodName: 'Breakfast Bowl',
          calories: 450,
          protein: 25,
          carbs: 35,
          fats: 18,
        },
        {
          date: new Date(date),
          foodName: 'Chicken Salad',
          calories: 320,
          protein: 28,
          carbs: 15,
          fats: 16,
        },
        {
          date: new Date(date),
          foodName: 'Protein Shake',
          calories: 180,
          protein: 30,
          carbs: 8,
          fats: 3,
        }
      ]

      // Add workout entries (every other day)
      if (i % 2 === 0) {
        const workouts = [
          {
            date: new Date(date),
            exerciseName: 'Bench Press',
            sets: JSON.stringify([
              { reps: 8, weight: 80 },
              { reps: 6, weight: 85 },
              { reps: 5, weight: 90 }
            ]),
            notes: 'Great session, felt strong'
          },
          {
            date: new Date(date),
            exerciseName: 'Squats',
            sets: JSON.stringify([
              { reps: 10, weight: 100 },
              { reps: 8, weight: 105 },
              { reps: 6, weight: 110 }
            ]),
            notes: 'Legs felt heavy today'
          }
        ]
        data.push(...workouts)
      }

      // Add more workouts for some days
      if (i === 1 || i === 3) {
        const additionalWorkouts = [
          {
            date: new Date(date),
            exerciseName: 'Deadlifts',
            sets: JSON.stringify([
              { reps: 5, weight: 120 },
              { reps: 5, weight: 125 },
              { reps: 3, weight: 130 }
            ]),
            notes: 'Focus on form'
          }
        ]
        data.push(...additionalWorkouts)
      }

      data.push(...nutritionEntries)
    }

    // Week 2: Previous week
    for (let i = 8; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(9, 0, 0, 0)
      
      const nutritionEntries = [
        {
          date: new Date(date),
          foodName: 'Oatmeal',
          calories: 300,
          protein: 12,
          carbs: 45,
          fats: 8,
        },
        {
          date: new Date(date),
          foodName: 'Grilled Salmon',
          calories: 280,
          protein: 35,
          carbs: 5,
          fats: 12,
        },
        {
          date: new Date(date),
          foodName: 'Greek Yogurt',
          calories: 150,
          protein: 20,
          carbs: 12,
          fats: 2,
        }
      ]

      // Add workouts every other day
      if (i % 2 === 1) {
        const workouts = [
          {
            date: new Date(date),
            exerciseName: 'Pull-ups',
            sets: JSON.stringify([
              { reps: 8, weight: 0 },
              { reps: 6, weight: 0 },
              { reps: 5, weight: 0 }
            ]),
            notes: 'Bodyweight only'
          },
          {
            date: new Date(date),
            exerciseName: 'Overhead Press',
            sets: JSON.stringify([
              { reps: 8, weight: 50 },
              { reps: 6, weight: 55 },
              { reps: 4, weight: 60 }
            ]),
            notes: 'Shoulders felt good'
          }
        ]
        data.push(...workouts)
      }

      data.push(...nutritionEntries)
    }

    // Week 3: Two weeks ago
    for (let i = 15; i <= 21; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(9, 0, 0, 0)
      
      const nutritionEntries = [
        {
          date: new Date(date),
          foodName: 'Protein Pancakes',
          calories: 380,
          protein: 30,
          carbs: 25,
          fats: 15,
        },
        {
          date: new Date(date),
          foodName: 'Turkey Wrap',
          calories: 420,
          protein: 25,
          carbs: 30,
          fats: 20,
        }
      ]

      // Add workouts twice a week
      if (i === 15 || i === 18) {
        const workouts = [
          {
            date: new Date(date),
            exerciseName: 'Barbell Rows',
            sets: JSON.stringify([
              { reps: 10, weight: 70 },
              { reps: 8, weight: 75 },
              { reps: 6, weight: 80 }
            ]),
            notes: 'Back day'
          }
        ]
        data.push(...workouts)
      }

      data.push(...nutritionEntries)
    }

    // Insert all data
    console.log(`📊 Creating ${data.length} entries...`)
    console.log(`📅 Date range: ${new Date(Math.min(...data.map(d => new Date(d.date).getTime()))).toLocaleDateString()} to ${new Date(Math.max(...data.map(d => new Date(d.date).getTime()))).toLocaleDateString()}`)
    
    // Insert nutrition data
    const nutritionData = data.filter(item => item.foodName)
    await prisma.nutrition.createMany({
      data: nutritionData,
    })
    console.log(`✅ Created ${nutritionData.length} nutrition entries`)

    // Insert workout data
    const workoutData = data.filter(item => item.exerciseName)
    await prisma.workout.createMany({
      data: workoutData,
    })
    console.log(`✅ Created ${workoutData.length} workout entries`)

    console.log('🎉 Dummy data seeding completed!')
    console.log('📅 Data covers the last 3 weeks with varying activity levels')

  } catch (error) {
    console.error('❌ Error seeding data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDummyData()
