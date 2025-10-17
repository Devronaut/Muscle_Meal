#!/bin/bash

# Development Setup Script for Muscle Meal
echo "🏋️ Setting up Muscle Meal for development..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client for development
echo "🔧 Generating Prisma client for development..."
npm run db:dev:generate

# Push development database schema
echo "🗄️ Setting up development database..."
npm run db:dev:push

echo "🎉 Development setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To open Prisma Studio:"
echo "  npm run db:dev:studio"
