// InsightStream Frontend Application
class InsightStream {
    constructor() {
        this.currentCategory = '';
        this.currentArticles = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadNews();
    }

    setupEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryChange(e.target);
            });
        });

        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                this.searchNews(query);
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    this.searchNews(query);
                }
            }
        });

        // Deep dive topics button
        const generateTopicsBtn = document.getElementById('generateTopicsBtn');
        generateTopicsBtn.addEventListener('click', () => {
            this.generateDeepDiveTopics();
        });

        // Modal close
        const modal = document.getElementById('articleModal');
        const closeBtn = document.querySelector('.modal-close');
        
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    handleCategoryChange(button) {
        // Update active state
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Get category
        const category = button.dataset.category;
        this.currentCategory = category;
        
        // Load news
        this.loadNews(category);
    }

    async loadNews(category = '') {
        try {
            this.showLoading(true);
            
            const url = category 
                ? `/api/news/headlines?category=${category}`
                : '/api/news/headlines';
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                this.currentArticles = data.articles;
                await this.displayNews(data.articles);
            } else {
                this.showError('Failed to load news');
            }
        } catch (error) {
            console.error('Error loading news:', error);
            this.showError('Failed to load news');
        } finally {
            this.showLoading(false);
        }
    }

    async searchNews(query) {
        try {
            this.showLoading(true);
            
            const response = await fetch(`/api/news/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success) {
                this.currentArticles = data.articles;
                await this.displayNews(data.articles);
            } else {
                this.showError('Failed to search news');
            }
        } catch (error) {
            console.error('Error searching news:', error);
            this.showError('Failed to search news');
        } finally {
            this.showLoading(false);
        }
    }

    async displayNews(articles) {
        const newsGrid = document.getElementById('newsGrid');
        newsGrid.innerHTML = '';

        if (articles.length === 0) {
            newsGrid.innerHTML = '<p class="placeholder-text">No articles found</p>';
            return;
        }

        // Process first 12 articles with AI analysis
        const displayArticles = articles.slice(0, 12);
        
        for (const article of displayArticles) {
            const card = await this.createNewsCard(article);
            newsGrid.appendChild(card);
        }
    }

    async createNewsCard(article) {
        const card = document.createElement('div');
        card.className = 'news-card';

        // Get sentiment analysis for the headline
        let sentimentHTML = '';
        try {
            const sentiment = await this.analyzeSentiment(article.title);
            if (sentiment) {
                sentimentHTML = `
                    <div class="sentiment-badge sentiment-${sentiment.label}">
                        ${sentiment.label.toUpperCase()} (${sentiment.score})
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
        }

        // Format date
        const publishedDate = article.publishedAt 
            ? new Date(article.publishedAt).toLocaleDateString()
            : 'Unknown date';

        // Create card HTML
        card.innerHTML = `
            ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}" class="news-card-image" onerror="this.style.display='none'">` : ''}
            <div class="news-card-content">
                ${this.currentCategory ? `<span class="news-card-category">${this.currentCategory}</span>` : ''}
                <h4 class="news-card-title">${article.title}</h4>
                <p class="news-card-description">${article.description || ''}</p>
                ${sentimentHTML}
                <div class="news-card-meta">
                    <span class="news-card-source">${article.source?.name || 'Unknown'}</span>
                    <span class="news-card-date">${publishedDate}</span>
                </div>
            </div>
        `;

        // Add click event to show details
        card.addEventListener('click', () => {
            this.showArticleDetails(article);
        });

        return card;
    }

    async showArticleDetails(article) {
        const modal = document.getElementById('articleModal');
        const modalBody = document.getElementById('modalBody');

        // Show loading in modal
        modalBody.innerHTML = '<div class="loading-indicator"><div class="spinner"></div><p>Loading article details...</p></div>';
        modal.classList.add('active');

        try {
            // Get AI summary
            let summaryHTML = '';
            if (article.content || article.description) {
                const summary = await this.summarizeArticle(
                    article.title,
                    article.content || article.description
                );
                if (summary) {
                    summaryHTML = `
                        <div class="ai-summary">
                            <span class="ai-badge">AI SUMMARY</span>
                            <p>${summary}</p>
                        </div>
                    `;
                }
            }

            // Get sentiment
            const sentiment = await this.analyzeSentiment(article.title);
            const sentimentHTML = sentiment ? `
                <div class="sentiment-badge sentiment-${sentiment.label}">
                    Sentiment: ${sentiment.label.toUpperCase()} (${sentiment.score})
                </div>
            ` : '';

            const publishedDate = article.publishedAt 
                ? new Date(article.publishedAt).toLocaleString()
                : 'Unknown date';

            modalBody.innerHTML = `
                <h2>${article.title}</h2>
                <div style="margin: 1rem 0;">
                    <strong>Source:</strong> ${article.source?.name || 'Unknown'} | 
                    <strong>Published:</strong> ${publishedDate}
                </div>
                ${sentimentHTML}
                ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}" style="width: 100%; border-radius: 12px; margin: 1rem 0;">` : ''}
                ${summaryHTML}
                <p style="margin: 1rem 0; line-height: 1.8;">${article.description || ''}</p>
                ${article.content ? `<p style="margin: 1rem 0; line-height: 1.8;">${article.content}</p>` : ''}
                <a href="${article.url}" target="_blank" class="btn btn-primary" style="display: inline-block; margin-top: 1rem;">Read Full Article</a>
            `;
        } catch (error) {
            console.error('Error loading article details:', error);
            modalBody.innerHTML = '<p>Failed to load article details</p>';
        }
    }

    async analyzeSentiment(headline) {
        try {
            const response = await fetch('/api/news/sentiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ headline })
            });
            
            const data = await response.json();
            return data.success ? data.sentiment : null;
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            return null;
        }
    }

    async summarizeArticle(title, content) {
        try {
            const response = await fetch('/api/news/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            
            const data = await response.json();
            return data.success ? data.summary : null;
        } catch (error) {
            console.error('Error summarizing article:', error);
            return null;
        }
    }

    async generateDeepDiveTopics() {
        try {
            const btn = document.getElementById('generateTopicsBtn');
            btn.disabled = true;
            btn.textContent = 'Generating...';

            const topicsGrid = document.getElementById('topicsGrid');
            topicsGrid.innerHTML = '<div class="loading-indicator"><div class="spinner"></div><p>AI is analyzing current news trends...</p></div>';

            const response = await fetch('/api/news/deep-dive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articles: this.currentArticles })
            });
            
            const data = await response.json();
            
            if (data.success && data.topics.length > 0) {
                this.displayTopics(data.topics);
            } else {
                topicsGrid.innerHTML = '<p class="placeholder-text">No topics generated. Try loading some news first.</p>';
            }
        } catch (error) {
            console.error('Error generating topics:', error);
            const topicsGrid = document.getElementById('topicsGrid');
            topicsGrid.innerHTML = '<p class="placeholder-text">Failed to generate topics. Please try again.</p>';
        } finally {
            const btn = document.getElementById('generateTopicsBtn');
            btn.disabled = false;
            btn.textContent = 'Generate Topics';
        }
    }

    displayTopics(topics) {
        const topicsGrid = document.getElementById('topicsGrid');
        topicsGrid.innerHTML = '';

        topics.forEach(topic => {
            const card = document.createElement('div');
            card.className = 'topic-card';

            const keywordsHTML = topic.keywords?.map(keyword => 
                `<span class="keyword-tag">${keyword}</span>`
            ).join('') || '';

            card.innerHTML = `
                <h4 class="topic-card-title">${topic.topic}</h4>
                <p class="topic-card-description">${topic.description}</p>
                <div class="topic-keywords">${keywordsHTML}</div>
            `;

            topicsGrid.appendChild(card);
        });
    }

    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const newsGrid = document.getElementById('newsGrid');
        
        if (show) {
            loadingIndicator.style.display = 'block';
            newsGrid.style.display = 'none';
        } else {
            loadingIndicator.style.display = 'none';
            newsGrid.style.display = 'grid';
        }
    }

    showError(message) {
        const newsGrid = document.getElementById('newsGrid');
        newsGrid.innerHTML = `<p class="placeholder-text" style="color: var(--danger-color);">${message}</p>`;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new InsightStream();
});
