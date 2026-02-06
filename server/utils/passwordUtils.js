const bcrypt = require('bcrypt');
const crypto = require('crypto');

/**
 * Validate password requirements
 * - At least 10 characters long
 * - Contains at least one number
 * - Contains at least one special symbol
 */
function validatePassword(password) {
  const errors = [];

  // Check length
  if (password.length < 10) {
    errors.push('Password must be at least 10 characters long');
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for symbols
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one symbol (!@#$%^&*()_+-=[]{};\':"|,.<>/?)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Hash password using bcrypt (bcrypt handles salt internally)
 */
async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  return { hash };
}

/**
 * Verify password against hash
 */
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate session ID
 */
function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = {
  validatePassword,
  hashPassword,
  verifyPassword,
  generateSessionId
};
