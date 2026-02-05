const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { validatePassword, hashPassword, verifyPassword, generateSessionId } = require('../utils/passwordUtils');
const { requireAuth } = require('../middleware/auth');

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Password does not meet requirements',
        details: passwordValidation.errors
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Username or email already exists'
      });
    }

    // Hash password
    const { hash, salt } = await hashPassword(password);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, salt, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, NOW(), NOW()) 
       RETURNING id, username, email, created_at`,
      [username, email, hash, salt]
    );

    const user = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and create session
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, username, email, password_hash, salt FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Generate session
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create session in database
    await pool.query(
      `INSERT INTO sessions (session_id, user_id, last_activity, created_at, expires_at) 
       VALUES ($1, $2, NOW(), NOW(), $3)`,
      [sessionId, user.id, expiresAt]
    );

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Store session in express-session
    req.session.sessionId = sessionId;
    req.session.userId = user.id;

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      sessionId
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user and destroy session
 */
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const sessionId = req.session.sessionId;

    // Delete session from database
    await pool.query('DELETE FROM sessions WHERE session_id = $1', [sessionId]);

    // Destroy express session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to logout'
    });
  }
});

/**
 * GET /api/auth/session
 * Check if user has an active session
 */
router.get('/session', async (req, res) => {
  try {
    const sessionId = req.session?.sessionId;

    if (!sessionId) {
      return res.json({
        success: true,
        authenticated: false
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
      req.session.destroy();
      return res.json({
        success: true,
        authenticated: false
      });
    }

    const session = result.rows[0];

    // Check for inactivity timeout
    const inactivityTimeout = 30 * 60 * 1000; // 30 minutes
    const lastActivity = new Date(session.last_activity);
    const now = new Date();

    if (now - lastActivity > inactivityTimeout) {
      await pool.query('DELETE FROM sessions WHERE session_id = $1', [sessionId]);
      req.session.destroy();
      return res.json({
        success: true,
        authenticated: false,
        reason: 'Session timed out due to inactivity'
      });
    }

    // Update last activity
    await pool.query(
      'UPDATE sessions SET last_activity = NOW() WHERE session_id = $1',
      [sessionId]
    );

    res.json({
      success: true,
      authenticated: true,
      user: {
        id: session.user_id,
        username: session.username,
        email: session.email
      }
    });
  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check session'
    });
  }
});

/**
 * GET /api/auth/preferences
 * Get user preferences
 */
router.get('/preferences', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT preference_key, preference_value, updated_at FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    const preferences = {};
    result.rows.forEach(row => {
      preferences[row.preference_key] = row.preference_value;
    });

    res.json({
      success: true,
      preferences
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get preferences'
    });
  }
});

/**
 * PUT /api/auth/preferences
 * Update user preferences
 */
router.put('/preferences', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { preferences } = req.body;

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Preferences object is required'
      });
    }

    // Update or insert each preference
    for (const [key, value] of Object.entries(preferences)) {
      await pool.query(
        `INSERT INTO user_preferences (user_id, preference_key, preference_value, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, preference_key) 
         DO UPDATE SET preference_value = $3, updated_at = NOW()`,
        [userId, key, value]
      );
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    });
  }
});

module.exports = router;
