# InsightStream - AI News Aggregator

InsightStream is a full-stack web application that aggregates live news and social trends based on user interests. Unlike a standard news site, it uses AI to summarize articles, perform sentiment analysis on headlines, and suggest "deep dive" topics using an LLM.

## 🌟 Features

- **Live News Aggregation**: Real-time news from NewsAPI.org across multiple categories
- **AI-Powered Summaries**: Intelligent article summarization using Google Gemini AI
- **Sentiment Analysis**: Automatic sentiment detection on news headlines
- **Deep Dive Topics**: AI-generated topic suggestions based on current news trends
- **Modern UI**: Glassmorphism design with responsive layout
- **Category Filtering**: Browse news by technology, business, science, health, and more
- **Search Functionality**: Search for specific news topics

## 🛠️ Technical Stack

- **Frontend**: HTML5 (Semantic), CSS3 (Flex/Grid/Glassmorphism), JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **AI Integration**: Google Gemini API (Free Tier)
- **Public APIs**: NewsAPI.org
- **Persistence**: PostgreSQL

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/grantgwalker/AINewsApp.git
cd AINewsApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=insightstream
DB_USER=postgres
DB_PASSWORD=your_password_here

# API Keys
NEWSAPI_KEY=your_newsapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Get API Keys

#### NewsAPI Key
1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key to the `.env` file

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to the `.env` file

### 5. Set Up PostgreSQL Database

```bash
# Create the database
createdb insightstream

# Run the schema
psql -d insightstream -f server/schema.sql
```

Alternatively, you can use a PostgreSQL client:

```sql
CREATE DATABASE insightstream;
```

Then connect to the database and execute the contents of `server/schema.sql`.

### 6. Start the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
AINewsApp/
├── server/
│   ├── config/
│   │   ├── database.js      # PostgreSQL connection
│   │   ├── aiService.js     # Google Gemini AI integration
│   │   └── newsService.js   # NewsAPI integration
│   ├── routes/
│   │   └── news.js          # API routes for news operations
│   └── schema.sql           # Database schema
├── public/
│   ├── css/
│   │   └── styles.css       # Glassmorphism styling
│   ├── js/
│   │   └── app.js           # Frontend JavaScript application
│   └── index.html           # Main HTML page
├── server.js                # Express server entry point
├── package.json
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### News Endpoints

- `GET /api/news/headlines?category={category}` - Fetch top headlines
- `GET /api/news/search?q={query}` - Search for news articles
- `POST /api/news/summarize` - Summarize an article using AI
- `POST /api/news/sentiment` - Analyze sentiment of a headline
- `POST /api/news/deep-dive` - Generate deep dive topic suggestions
- `GET /api/news/categories` - Fetch news from multiple categories

### Example Requests

**Get Top Headlines:**
```bash
curl http://localhost:3000/api/news/headlines?category=technology
```

**Search News:**
```bash
curl http://localhost:3000/api/news/search?q=artificial+intelligence
```

**Analyze Sentiment:**
```bash
curl -X POST http://localhost:3000/api/news/sentiment \
  -H "Content-Type: application/json" \
  -d '{"headline":"Tech stocks rally on AI breakthrough"}'
```

## 🎨 Features in Detail

### AI-Powered Summarization
Uses Google Gemini AI to generate concise 2-3 sentence summaries of news articles, making it easy to quickly understand the key points.

### Sentiment Analysis
Automatically analyzes the sentiment of news headlines, categorizing them as:
- **Positive** (score: 0.5 to 1.0)
- **Neutral** (score: -0.5 to 0.5)
- **Negative** (score: -1.0 to -0.5)

### Deep Dive Topics
AI analyzes current news trends and suggests 5 interesting "deep dive" topics for further exploration, complete with:
- Topic name
- Brief description
- Related keywords

### Glassmorphism UI
Modern, visually appealing interface featuring:
- Transparent, frosted glass effects
- Smooth animations and transitions
- Responsive grid layouts
- Gradient backgrounds

## 🔧 Development

### Running in Development Mode

```bash
npm run dev
```

### Database Management

The application includes a complete PostgreSQL schema with tables for:
- Users and user preferences
- Cached news articles
- Saved articles
- Deep dive topics

## 🌐 Deployment

### Environment Variables for Production

Update your `.env` file:

```env
NODE_ENV=production
PORT=3000
```

### Database Setup

Ensure your PostgreSQL database is configured and the schema is applied.

### Starting the Server

```bash
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [NewsAPI.org](https://newsapi.org/) for news data
- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- Inspired by modern news aggregation platforms

## 📧 Support

For issues and questions, please open an issue on the GitHub repository.
