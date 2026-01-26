/**
 * Common test setup utilities
 */

export const mockLocalStorage = () => {
  const store = {}
  
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { Object.keys(store).forEach(key => delete store[key]) }
  }
}

export const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms))
