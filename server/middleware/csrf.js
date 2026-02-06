/**
 * CSRF Protection Middleware
 * Validates Origin/Referer headers for state-changing requests
 */
function csrfProtection(req, res, next) {
  // Only check for state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.get('origin');
    const referer = req.get('referer');
    const host = req.get('host');
    
    // In development, allow requests without origin/referer
    if (process.env.NODE_ENV === 'development') {
      return next();
    }

    // Check if origin matches our host
    if (origin) {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return res.status(403).json({
          success: false,
          error: 'CSRF validation failed'
        });
      }
    } else if (referer) {
      const refererUrl = new URL(referer);
      if (refererUrl.host !== host) {
        return res.status(403).json({
          success: false,
          error: 'CSRF validation failed'
        });
      }
    } else {
      // No origin or referer header - potential CSRF attack
      return res.status(403).json({
        success: false,
        error: 'CSRF validation failed - missing origin/referer'
      });
    }
  }

  next();
}

module.exports = csrfProtection;
