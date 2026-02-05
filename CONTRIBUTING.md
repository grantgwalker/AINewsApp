# Contributing to InsightStream

Thank you for your interest in contributing to InsightStream! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

1. Follow the installation instructions in the README.md
2. Ensure you have the required API keys configured
3. Run the application locally to verify everything works

## Code Style

### JavaScript
- Use ES6+ features
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic

### CSS
- Use CSS custom properties (variables) for theming
- Follow BEM naming convention where applicable
- Ensure responsive design for all new components

### HTML
- Use semantic HTML5 elements
- Include appropriate ARIA labels for accessibility
- Validate HTML structure

## Adding New Features

### Backend (API Endpoints)
1. Add new routes in `server/routes/`
2. Update the API documentation in README.md
3. Test the endpoint thoroughly
4. Handle errors appropriately

### Frontend
1. Update HTML structure in `public/index.html` if needed
2. Add new styles to `public/css/styles.css`
3. Implement functionality in `public/js/app.js`
4. Ensure mobile responsiveness

### Database
1. Add migration scripts for schema changes
2. Update `server/schema.sql`
3. Document new tables/columns in README.md

## Testing

Before submitting a PR:
- Test all new features manually
- Verify existing functionality still works
- Test on different screen sizes for responsive design
- Check browser console for errors
- Validate API responses

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation for any API changes
3. Ensure your code follows the existing style
4. Write clear commit messages
5. Reference any related issues in your PR description

## Code Review

All submissions require review before being merged. Please be patient and responsive to feedback.

## Reporting Bugs

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/environment information
- Screenshots if applicable

## Feature Requests

Feature requests are welcome! Please:
- Clearly describe the feature
- Explain the use case
- Discuss any potential implementation approaches

## Questions?

Feel free to open an issue for any questions or concerns.

Thank you for contributing to InsightStream! 🚀
