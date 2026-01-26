/**
 * Storage utility functions
 */

export const storage = {
  /**
   * Set item in storage
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },

  /**
   * Get item from storage
   * @param {string} key
   * @returns {any}
   */
  get(key) {
    if (typeof localStorage !== 'undefined') {
      const item = localStorage.getItem(key)
      try {
        return item ? JSON.parse(item) : null
      } catch {
        return item
      }
    }
    return null
  },

  /**
   * Remove item from storage
   * @param {string} key
   */
  remove(key) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key)
    }
  },

  /**
   * Clear all storage
   */
  clear() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  }
}
