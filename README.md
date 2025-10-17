# 💪 Muscle Meal

A comprehensive fitness and nutrition tracking application built with Next.js 14, Prisma, and PostgreSQL.

## ✨ Features

- **Workout Tracking**: Log exercises, sets, reps, and weights
- **Nutrition Tracking**: Track calories, protein, carbs, and fats
- **Goal Setting**: Set and track daily nutrition goals
- **Progress Analytics**: View detailed analytics and insights
- **Performance Insights**: Get motivational messages based on progress
- **History**: View past workouts and nutrition data
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd muscle-meal
   ```

2. **Run the development setup script**
   ```bash
   ./scripts/setup-dev.sh
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Visit [http://localhost:3000](http://localhost:3000)

### Manual Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```

3. **Set up development database**
   ```bash
   npm run db:dev:generate
   npm run db:dev:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

### Development (SQLite)
- Uses local SQLite database
- Schema: `prisma/schema.dev.prisma`
- Commands: `npm run db:dev:*`

### Production (PostgreSQL)
- Uses Vercel Postgres
- Schema: `prisma/schema.prisma`
- Commands: `npm run db:*`

## 📦 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run db:dev:generate` - Generate Prisma client for development
- `npm run db:dev:push` - Push schema to development database
- `npm run db:dev:migrate` - Run migrations for development
- `npm run db:dev:studio` - Open Prisma Studio for development

### Production
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client for production
- `npm run db:push` - Push schema to production database
- `npm run db:migrate` - Run migrations for production
- `npm run db:studio` - Open Prisma Studio for production

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deployment to Vercel

1. **Create Vercel Postgres Database**
   - Go to Vercel Dashboard → Your Project → Storage
   - Create Postgres database (Hobby plan)

2. **Set Environment Variables**
   - Add `DATABASE_URL` and other Postgres variables
   - Set for Production environment

3. **Deploy**
   ```bash
   git push origin main
   ```

## 🏗️ Project Structure

```
muscle-meal/
├── prisma/
│   ├── schema.prisma          # Production schema (PostgreSQL)
│   └── schema.dev.prisma      # Development schema (SQLite)
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── workouts/          # Workouts page
│   │   ├── nutrition/         # Nutrition page
│   │   ├── progress/          # Progress page
│   │   ├── analytics/         # Analytics page
│   │   ├── goals/             # Goals page
│   │   └── history/           # History page
│   ├── components/            # React components
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript types
├── scripts/
│   └── setup-dev.sh          # Development setup script
├── public/                    # Static assets
└── DEPLOYMENT.md             # Deployment guide
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (dev), PostgreSQL (prod)
- **Deployment**: Vercel
- **Icons**: Heroicons
- **Charts**: Recharts
- **Date Handling**: date-fns

## 📱 Features Overview

### Dashboard
- Today's workout and nutrition summary
- Goal progress tracking
- Performance insights with motivational messages
- Quick actions for adding data
- Recent activity feed

### Workouts
- Add workout sessions
- Track exercises, sets, reps, and weights
- Calculate workout volume
- Edit and delete workouts

### Nutrition
- Log daily food intake
- Track calories, protein, carbs, and fats
- Edit and delete nutrition entries

### Goals
- Set daily nutrition goals
- Track progress towards goals
- Edit and delete goals
- Visual progress indicators

### Analytics
- Detailed performance analytics
- Trend analysis
- Achievement tracking
- Personal records
- Consistency scoring

### Progress
- Visual progress tracking
- Workout volume trends
- Nutrition trends over time

### History
- View past 12 weeks of data
- Weekly summaries
- Daily breakdowns

## 🔧 Configuration

### Environment Variables

#### Development (.env.local)
```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Production (Vercel)
```
DATABASE_URL="postgresql://..."
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://...?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://..."
POSTGRES_USER="username"
POSTGRES_HOST="host"
POSTGRES_PASSWORD="password"
POSTGRES_DATABASE="database"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review the troubleshooting section
3. Check GitHub issues
4. Contact support if needed

---

**Built with ❤️ for fitness enthusiasts**