const pool = require('../config/database');

/**
 * Authentication middleware
 * Checks if user has a valid session
 */
async function requireAuth(req, res, next) {
  try {
    const sessionId = req.session?.sessionId;
    
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Check session in database
    const result = await pool.query(
      `SELECT s.*, u.id as user_id, u.username, u.email 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.session_id = $1 AND s.expires_at > NOW()`,
      [sessionId]
    );

    if (result.rows.length === 0) {
      // Session expired or invalid
      req.session.destroy();
      return res.status(401).json({
        success: false,
        error: 'Session expired or invalid'
      });
    }

    const session = result.rows[0];
    
    // Check for inactivity timeout (30 minutes)
    const inactivityTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
    const lastActivity = new Date(session.last_activity);
    const now = new Date();
    
    if (now - lastActivity > inactivityTimeout) {
      // Session timed out due to inactivity
      await pool.query('DELETE FROM sessions WHERE session_id = $1', [sessionId]);
      req.session.destroy();
      return res.status(401).json({
        success: false,
        error: 'Session timed out due to inactivity'
      });
    }

    // Update last activity
    await pool.query(
      'UPDATE sessions SET last_activity = NOW() WHERE session_id = $1',
      [sessionId]
    );

    // Attach user to request
    req.user = {
      id: session.user_id,
      username: session.username,
      email: session.email
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Optional authentication middleware
 * Adds user to request if authenticated, but doesn't require it
 */
async function optionalAuth(req, res, next) {
  try {
    const sessionId = req.session?.sessionId;
    
    if (!sessionId) {
      return next();
    }

    const result = await pool.query(
      `SELECT s.*, u.id as user_id, u.username, u.email 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.session_id = $1 AND s.expires_at > NOW()`,
      [sessionId]
    );

    if (result.rows.length > 0) {
      const session = result.rows[0];
      
      // Check for inactivity timeout (30 minutes)
      const inactivityTimeout = 30 * 60 * 1000;
      const lastActivity = new Date(session.last_activity);
      const now = new Date();
      
      if (now - lastActivity > inactivityTimeout) {
        // Session timed out - delete and don't attach user
        await pool.query('DELETE FROM sessions WHERE session_id = $1', [sessionId]);
        req.session.destroy();
        return next();
      }

      // Update last activity only for valid sessions
      await pool.query(
        'UPDATE sessions SET last_activity = NOW() WHERE session_id = $1',
        [sessionId]
      );

      req.user = {
        id: session.user_id,
        username: session.username,
        email: session.email
      };
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
}

module.exports = {
  requireAuth,
  optionalAuth
};
