#!/bin/bash

# InsightStream Setup Script
# This script helps set up the PostgreSQL database

echo "🚀 InsightStream Database Setup"
echo "================================"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client (psql) not found. Please install PostgreSQL first."
    exit 1
fi

echo "📊 Setting up PostgreSQL database..."
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  .env file not found. Using defaults."
    DB_NAME="insightstream"
    DB_USER="postgres"
fi

# Create database if it doesn't exist
echo "Creating database '$DB_NAME'..."
createdb -U "$DB_USER" "$DB_NAME" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "ℹ️  Database may already exist (this is OK)"
fi

# Run schema
echo ""
echo "Running database schema..."
psql -U "$DB_USER" -d "$DB_NAME" -f server/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database schema created successfully"
else
    echo "❌ Failed to create database schema"
    exit 1
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure you have added your API keys to the .env file"
echo "2. Run 'npm start' to start the application"
echo ""
