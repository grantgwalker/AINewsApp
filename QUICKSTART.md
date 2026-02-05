# Quick Start Guide - InsightStream

This guide will help you get InsightStream up and running quickly.

## Prerequisites Checklist

- [ ] Node.js v14+ installed
- [ ] PostgreSQL v12+ installed
- [ ] NewsAPI.org account and API key
- [ ] Google Gemini API key

## 5-Minute Setup

### Step 1: Get Your API Keys (2 minutes)

#### NewsAPI Key
1. Go to https://newsapi.org/register
2. Fill in your details and register
3. Copy your API key from the dashboard

#### Google Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key

### Step 2: Configure Environment (1 minute)

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your favorite text editor
nano .env  # or vim, code, etc.
```

Add your API keys:
```env
NEWSAPI_KEY=your_actual_newsapi_key_here
GEMINI_API_KEY=your_actual_gemini_key_here
```

### Step 3: Set Up Database (1 minute)

```bash
# Run the setup script
./setup-db.sh
```

Or manually:
```bash
createdb insightstream
psql -d insightstream -f server/schema.sql
```

### Step 4: Start the Application (1 minute)

```bash
npm start
```

Open your browser to: **http://localhost:3000**

## First Steps After Launch

1. **Browse Top Headlines**: Click on category buttons to filter news
2. **Search News**: Use the search bar to find specific topics
3. **View Article Details**: Click on any news card to see AI summary and sentiment
4. **Generate Deep Dive Topics**: Scroll down and click "Generate Topics"

## Troubleshooting

### Server won't start?
- Check if port 3000 is available: `lsof -i :3000`
- Verify .env file exists and has correct API keys
- Check Node.js version: `node --version`

### No news articles showing?
- Verify your NewsAPI key is correct
- Check browser console for errors (F12)
- Ensure you have internet connection

### AI features not working?
- Verify Google Gemini API key is correct
- Check if you've exceeded free tier limits
- Look at server logs for error messages

### Database errors?
- Ensure PostgreSQL is running: `pg_isready`
- Verify database exists: `psql -l | grep insightstream`
- Check database credentials in .env

## Testing the Application

### Test News API
```bash
curl http://localhost:3000/api/news/headlines
```

### Test Search
```bash
curl "http://localhost:3000/api/news/search?q=technology"
```

### Test Sentiment Analysis
```bash
curl -X POST http://localhost:3000/api/news/sentiment \
  -H "Content-Type: application/json" \
  -d '{"headline":"AI breakthrough leads to major advancement"}'
```

## Development Tips

- Use `npm run dev` for development mode
- Check server logs in the terminal
- Use browser DevTools (F12) to debug frontend
- Database can be accessed with: `psql insightstream`

## Next Steps

- Customize the categories in the frontend
- Add more AI features
- Implement user authentication
- Deploy to a cloud platform

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review [FEATURES.md](FEATURES.md) for feature details
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub if you encounter problems

Happy news reading! 📰✨
