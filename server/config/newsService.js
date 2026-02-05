const axios = require('axios');
require('dotenv').config();

const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;

class NewsService {
  /**
   * Fetch top headlines from NewsAPI
   * @param {Object} options - Query parameters
   * @returns {Promise<Array>} - Array of news articles
   */
  async getTopHeadlines(options = {}) {
    try {
      const { category, country = 'us', pageSize = 20 } = options;
      
      const params = {
        apiKey: NEWSAPI_KEY,
        country,
        pageSize
      };
      
      if (category) {
        params.category = category;
      }
      
      const response = await axios.get(`${NEWSAPI_BASE_URL}/top-headlines`, { params });
      return response.data.articles || [];
    } catch (error) {
      console.error('Error fetching top headlines:', error.message);
      throw new Error('Failed to fetch news');
    }
  }

  /**
   * Search for news articles
   * @param {Object} options - Search parameters
   * @returns {Promise<Array>} - Array of news articles
   */
  async searchNews(options = {}) {
    try {
      const { query, sortBy = 'publishedAt', pageSize = 20, from } = options;
      
      if (!query) {
        throw new Error('Search query is required');
      }
      
      const params = {
        apiKey: NEWSAPI_KEY,
        q: query,
        sortBy,
        pageSize,
        language: 'en'
      };
      
      if (from) {
        params.from = from;
      }
      
      const response = await axios.get(`${NEWSAPI_BASE_URL}/everything`, { params });
      return response.data.articles || [];
    } catch (error) {
      console.error('Error searching news:', error.message);
      throw new Error('Failed to search news');
    }
  }

  /**
   * Get news by multiple categories
   * @param {Array} categories - Array of category names
   * @returns {Promise<Array>} - Combined array of news articles
   */
  async getNewsByCategories(categories = []) {
    try {
      const promises = categories.map(category => 
        this.getTopHeadlines({ category, pageSize: 10 })
      );
      
      const results = await Promise.all(promises);
      return results.flat();
    } catch (error) {
      console.error('Error fetching news by categories:', error.message);
      throw new Error('Failed to fetch categorized news');
    }
  }
}

module.exports = new NewsService();
