# 💪 Muscle Meal

A comprehensive personal fitness and nutrition tracking application built with Next.js, TypeScript, and Prisma.

## 🚀 Features

### 📊 Dashboard
- Real-time daily nutrition and workout statistics
- Goal progress tracking with visual indicators
- Quick action buttons for logging workouts and nutrition
- Recent activity feed

### 🏋️ Workout Tracking
- Log individual exercise sessions with multiple sets
- Track reps, weight, and workout volume
- Set-specific tracking for progressive overload
- Workout history and progress visualization

### 🍎 Nutrition Logging
- Daily food intake tracking
- Macronutrient breakdown (calories, protein, carbs, fats)
- Real-time nutrition totals
- Food entry history

### 📈 Progress Analytics
- Weekly and monthly progress charts
- Daily nutrition and workout volume trends
- Performance insights and statistics
- Visual data representation with Recharts

### 📅 History
- Weekly workout and nutrition logs
- Expandable weekly cards with daily details
- Historical data visualization
- Progress tracking over time

### 🎯 Goal Setting
- Daily nutrition intake goals
- Progress tracking with visual indicators
- Goal management (create, edit, delete)
- Achievement monitoring

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Database**: SQLite with Prisma ORM
- **Charts**: Recharts for data visualization
- **Icons**: Heroicons
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Devronaut/Muscle_Meal.git
cd Muscle_Meal
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:generate
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

1. **Dashboard**: View your daily progress and quick stats
2. **Workouts**: Log your exercise sessions with sets, reps, and weights
3. **Nutrition**: Track your daily food intake and macronutrients
4. **Progress**: Analyze your fitness journey with charts and insights
5. **History**: Review past weeks of workouts and nutrition
6. **Goals**: Set and track your daily nutrition targets

## 🗄️ Database Schema

The application uses three main models:

- **Workout**: Exercise sessions with sets data
- **Nutrition**: Food entries with macronutrient information
- **Goal**: User-defined daily targets

## 📊 API Endpoints

- `GET/POST /api/workouts` - Workout CRUD operations
- `GET/POST /api/nutrition` - Nutrition CRUD operations
- `GET/POST /api/goals` - Goal management
- `GET /api/stats` - Daily statistics
- `GET /api/goals/progress` - Goal progress tracking

## 🎨 Design Features

- **Consistent UI**: Gradient headers across all pages
- **Responsive Design**: Mobile-first approach
- **Modern Styling**: Clean, professional interface
- **Interactive Elements**: Hover effects and smooth transitions
- **Visual Feedback**: Progress bars and loading states

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## 📈 Future Enhancements

- [ ] Dark mode toggle
- [x] Advanced analytics and insights ✅
- [ ] Workout templates and exercise library
- [ ] Food database integration
- [ ] Mobile app (PWA)
- [ ] Social features and sharing
- [ ] Export data functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created by [Devronaut](https://github.com/Devronaut)

---

**Muscle Meal** - Track your fitness journey, one meal and workout at a time! 💪🍽️