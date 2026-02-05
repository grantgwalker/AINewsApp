const express = require('express');
const router = express.Router();
const newsService = require('../config/newsService');
const aiService = require('../config/aiService');
const pool = require('../config/database');

/**
 * GET /api/news/headlines
 * Fetch top headlines with optional category filter
 */
router.get('/headlines', async (req, res) => {
  try {
    const { category } = req.query;
    const articles = await newsService.getTopHeadlines({ category });
    
    res.json({
      success: true,
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error('Error fetching headlines:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch headlines'
    });
  }
});

/**
 * GET /api/news/search
 * Search for news articles
 */
router.get('/search', async (req, res) => {
  try {
    const { q, sortBy } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const articles = await newsService.searchNews({ query: q, sortBy });
    
    res.json({
      success: true,
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error('Error searching news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search news'
    });
  }
});

/**
 * POST /api/news/summarize
 * Summarize an article using AI
 */
router.post('/summarize', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      });
    }
    
    const summary = await aiService.summarizeArticle(title, content);
    
    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Error summarizing article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to summarize article'
    });
  }
});

/**
 * POST /api/news/sentiment
 * Analyze sentiment of a headline
 */
router.post('/sentiment', async (req, res) => {
  try {
    const { headline } = req.body;
    
    if (!headline) {
      return res.status(400).json({
        success: false,
        error: 'Headline is required'
      });
    }
    
    const sentiment = await aiService.analyzeSentiment(headline);
    
    res.json({
      success: true,
      sentiment
    });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze sentiment'
    });
  }
});

/**
 * POST /api/news/deep-dive
 * Generate deep dive topic suggestions
 */
router.post('/deep-dive', async (req, res) => {
  try {
    const { articles } = req.body;
    
    if (!articles || !Array.isArray(articles)) {
      return res.status(400).json({
        success: false,
        error: 'Articles array is required'
      });
    }
    
    const topics = await aiService.suggestDeepDiveTopics(articles);
    
    res.json({
      success: true,
      topics
    });
  } catch (error) {
    console.error('Error generating deep dive topics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate topics'
    });
  }
});

/**
 * GET /api/news/categories
 * Fetch news from multiple categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = ['technology', 'business', 'science', 'health'];
    const articles = await newsService.getNewsByCategories(categories);
    
    res.json({
      success: true,
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error('Error fetching categorized news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categorized news'
    });
  }
});

module.exports = router;
