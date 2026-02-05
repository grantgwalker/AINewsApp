# InsightStream - Feature Documentation

## Application Screenshots and Features

### Home Page
The main landing page features:
- **Hero Section**: Welcome message with search bar
- **Category Filters**: Quick access to different news categories
- **News Grid**: Responsive grid layout displaying news articles
- **Glassmorphism Design**: Modern, translucent card designs

### News Cards
Each news card displays:
- Article image (if available)
- Article title and description
- Source and publication date
- AI-powered sentiment badge (Positive/Neutral/Negative)
- Sentiment score from -1.0 to 1.0

### AI Features

#### 1. Article Summarization
- Click on any article to view details
- AI generates a concise 2-3 sentence summary
- Powered by Google Gemini AI
- Helps users quickly understand key points

#### 2. Sentiment Analysis
- Automatic sentiment detection on headlines
- Three categories: Positive, Neutral, Negative
- Visual color coding:
  - Green for positive
  - Yellow/Orange for neutral
  - Red for negative
- Numerical score for precise sentiment measurement

#### 3. Deep Dive Topics
- Click "Generate Topics" button
- AI analyzes current news trends
- Suggests 5 interesting topics for exploration
- Each topic includes:
  - Topic name
  - Brief description
  - Related keywords
- Great for discovering connections between stories

### User Interface Elements

#### Search Bar
- Full-text search across news articles
- Real-time results
- Enter key support

#### Category Filters
Available categories:
- All (default)
- Technology
- Business
- Science
- Health
- Entertainment
- Sports

#### Modal Window
- Detailed article view
- Full AI summary
- Sentiment analysis
- Link to original article
- Responsive design

### Responsive Design
- Desktop: Multi-column grid layout
- Tablet: Adjusted grid columns
- Mobile: Single column, optimized for touch

### Performance Features
- Lazy loading of images
- Optimized API calls
- Caching of AI responses
- Smooth animations and transitions

## API Integration

### NewsAPI.org
- Fetches latest news from reliable sources
- Multiple categories support
- Search functionality
- Sorted by relevance and date

### Google Gemini AI
- Natural language processing
- Article summarization
- Sentiment analysis
- Topic generation
- Fast response times with free tier

## Database Schema

### Tables
1. **users**: User accounts and preferences
2. **user_interests**: User interest categories and keywords
3. **articles**: Cached news articles with AI metadata
4. **saved_articles**: User-saved articles
5. **deep_dive_topics**: AI-generated topics

### Indexes
- Optimized for category and date filtering
- Fast user-specific queries
- Efficient article lookups

## Color Scheme

### Theme Colors
- Primary: Indigo (#6366f1)
- Secondary: Purple (#8b5cf6)
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Danger: Red (#ef4444)

### Background
- Dark gradient: Navy to Purple
- Glass effects: Transparent with blur
- Text: Light colors for contrast

## Accessibility

- Semantic HTML5 structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast ratios meet WCAG standards
- Screen reader friendly

## Browser Compatibility

Tested and works on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

Potential features for future development:
- User authentication and profiles
- Personalized news feeds
- Article bookmarking
- Social sharing
- Email digests
- Mobile app
- Multilingual support
- Dark/Light theme toggle
- Advanced search filters
