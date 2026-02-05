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
 * Hash password with salt
 */
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await bcrypt.hash(password + salt, 10);
  return { hash, salt };
}

/**
 * Verify password against hash and salt
 */
async function verifyPassword(password, hash, salt) {
  return await bcrypt.compare(password + salt, hash);
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
