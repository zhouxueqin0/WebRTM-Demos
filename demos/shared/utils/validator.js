/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password
 * @returns {{valid: boolean, message: string}}
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' }
  }
  return { valid: true, message: 'Password is valid' }
}

/**
 * Validate username
 * @param {string} username
 * @returns {{valid: boolean, message: string}}
 */
export const validateUsername = (username) => {
  if (!username || username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' }
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' }
  }
  return { valid: true, message: 'Username is valid' }
}
