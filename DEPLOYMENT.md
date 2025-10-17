# 🚀 Production Deployment Guide

## Prerequisites
- Vercel account
- GitHub repository with your code

## Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account

2. **Select Your Project**
   - Click on your `muscle-meal` project
   - Go to the **"Storage"** tab in the left sidebar

3. **Create Database**
   - Click **"Create Database"**
   - Select **"Postgres"**
   - Choose **"Hobby"** plan (free tier)
   - Name it: `muscle-meal-db`
   - Click **"Create"**

4. **Get Connection Details**
   - After creation, Vercel will show you:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`
     - `POSTGRES_USER`
     - `POSTGRES_HOST`
     - `POSTGRES_PASSWORD`
     - `POSTGRES_DATABASE`

## Step 2: Configure Environment Variables

1. **In Vercel Dashboard**
   - Go to your project settings
   - Click **"Environment Variables"**
   - Add the following variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
POSTGRES_URL=postgresql://username:password@host:port/database
POSTGRES_PRISMA_URL=postgresql://username:password@host:port/database?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://username:password@host:port/database
POSTGRES_USER=username
POSTGRES_HOST=host
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=database
```

2. **Set Environment**
   - Make sure all variables are set for **Production** environment
   - Click **"Save"**

## Step 3: Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add production database support"
   git push origin main
   ```

2. **Vercel Auto-Deploy**
   - Vercel will automatically detect the push
   - It will start building and deploying
   - The build will use the production database

## Step 4: Run Database Migrations

1. **In Vercel Dashboard**
   - Go to your project
   - Click **"Functions"** tab
   - Look for build logs

2. **If Migration Fails**
   - Go to **"Storage"** tab
   - Click on your database
   - Use the **"Query"** tab to run:
   ```sql
   -- This will be handled by Prisma automatically
   ```

## Step 5: Verify Deployment

1. **Check Your App**
   - Visit your Vercel URL
   - Try adding a workout
   - Try adding nutrition data
   - Check if data persists

2. **Test All Features**
   - ✅ Add workouts
   - ✅ Add nutrition
   - ✅ Set goals
   - ✅ View analytics
   - ✅ Check progress tracking

## Troubleshooting

### Database Connection Issues
- Verify environment variables are set correctly
- Check that `DATABASE_URL` matches your Postgres connection string
- Ensure the database is created and accessible

### Build Failures
- Check build logs in Vercel dashboard
- Verify all dependencies are installed
- Ensure Prisma schema is correct

### Runtime Errors
- Check function logs in Vercel dashboard
- Verify API routes are working
- Test database queries manually

## Development vs Production

### Development (Local)
- Uses SQLite database (`dev.db`)
- Schema: `prisma/schema.dev.prisma`
- Commands: `npm run db:dev:*`

### Production (Vercel)
- Uses PostgreSQL database
- Schema: `prisma/schema.prisma`
- Commands: `npm run db:*`

## Next Steps

1. **Monitor Performance**
   - Check Vercel analytics
   - Monitor database usage
   - Watch for errors

2. **Scale Up**
   - Upgrade to Pro plan if needed
   - Add more database storage
   - Implement caching

3. **Add Features**
   - User authentication
   - Data export
   - Mobile app
   - Social features

## Support

If you encounter issues:
1. Check Vercel documentation
2. Review Prisma documentation
3. Check GitHub issues
4. Contact support if needed

---

**🎉 Congratulations! Your Muscle Meal app is now live with a production database!**
