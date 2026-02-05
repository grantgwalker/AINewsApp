const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Summarize an article using Gemini AI
   * @param {string} title - Article title
   * @param {string} content - Article content
   * @returns {Promise<string>} - AI-generated summary
   */
  async summarizeArticle(title, content) {
    try {
      const prompt = `Summarize the following news article in 2-3 concise sentences:
      
Title: ${title}
Content: ${content}

Provide a clear, informative summary that captures the key points.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error summarizing article:', error);
      throw new Error('Failed to summarize article');
    }
  }

  /**
   * Perform sentiment analysis on a headline
   * @param {string} headline - Article headline
   * @returns {Promise<Object>} - Sentiment score and label
   */
  async analyzeSentiment(headline) {
    try {
      const prompt = `Analyze the sentiment of this news headline and respond with ONLY a JSON object in this exact format:
{"score": <number between -1 and 1>, "label": "<positive|negative|neutral>"}

Headline: ${headline}

Score guidelines:
- 0.5 to 1.0: positive
- -0.5 to 0.5: neutral
- -1.0 to -0.5: negative`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const sentiment = JSON.parse(jsonMatch[0]);
        return {
          score: parseFloat(sentiment.score).toFixed(2),
          label: sentiment.label.toLowerCase()
        };
      }
      
      // Fallback to neutral if parsing fails
      return { score: 0.0, label: 'neutral' };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      // Return neutral sentiment on error
      return { score: 0.0, label: 'neutral' };
    }
  }

  /**
   * Generate deep dive topic suggestions based on current news
   * @param {Array} articles - Array of article titles
   * @returns {Promise<Array>} - Array of suggested topics
   */
  async suggestDeepDiveTopics(articles) {
    try {
      const titles = articles.slice(0, 10).map(a => a.title || a).join('\n');
      
      const prompt = `Based on these recent news headlines, suggest 5 interesting "deep dive" topics for further exploration. Return ONLY a JSON array of objects in this exact format:
[{"topic": "Topic Name", "description": "Brief description", "keywords": ["keyword1", "keyword2", "keyword3"]}]

Headlines:
${titles}

Provide diverse, thought-provoking topics that connect multiple themes from the news.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      // Extract JSON array from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const topics = JSON.parse(jsonMatch[0]);
        return topics.slice(0, 5);
      }
      
      return [];
    } catch (error) {
      console.error('Error generating deep dive topics:', error);
      return [];
    }
  }
}

module.exports = new AIService();
