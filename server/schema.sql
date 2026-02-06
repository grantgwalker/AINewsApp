-- Create database schema for InsightStream

-- Users table to store user preferences and authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User interests/preferences
CREATE TABLE IF NOT EXISTS user_interests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cached news articles
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  source VARCHAR(255),
  author VARCHAR(255),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT UNIQUE NOT NULL,
  url_to_image TEXT,
  published_at TIMESTAMP,
  content TEXT,
  category VARCHAR(100),
  ai_summary TEXT,
  sentiment_score DECIMAL(3,2),
  sentiment_label VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User saved articles
CREATE TABLE IF NOT EXISTS saved_articles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, article_id)
);

-- Deep dive topics suggested by AI
CREATE TABLE IF NOT EXISTS deep_dive_topics (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(255) NOT NULL,
  description TEXT,
  related_keywords TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table for session management
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

-- User preferences logging table
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  preference_key VARCHAR(100) NOT NULL,
  preference_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, preference_key)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_articles_user_id ON saved_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
