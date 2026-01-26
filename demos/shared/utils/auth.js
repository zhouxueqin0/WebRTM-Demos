/**
 * Mock login function
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<{success: boolean, token?: string, message?: string}>}
 */
export const mockLogin = async (username = '', password = '') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // TODO: implement real login logic
  // For now, accept any non-empty credentials
  if (username && password) {
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: { username }
    }
  }
  
  return {
    success: false,
    message: 'Invalid credentials'
  }
}

/**
 * Mock logout function
 * @returns {Promise<void>}
 */
export const mockLogout = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  // Clear any stored tokens
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('token')
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  if (typeof localStorage !== 'undefined') {
    return !!localStorage.getItem('token')
  }
  return false
}
