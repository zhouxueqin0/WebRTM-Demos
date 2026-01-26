/**
 * Storage utility functions
 */

export const storage = {
  /**
   * Set item in storage
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   */
  set(key: string, value: any): void {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  /**
   * Get item from storage
   * @param key - Storage key
   * @returns Parsed value or null if not found
   */
  get<T = any>(key: string): T | null {
    if (typeof localStorage !== "undefined") {
      const item = localStorage.getItem(key);
      try {
        return item ? JSON.parse(item) : null;
      } catch {
        return item as any;
      }
    }
    return null;
  },

  /**
   * Remove item from storage
   * @param key - Storage key
   */
  remove(key: string): void {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  },

  /**
   * Clear all storage
   */
  clear(): void {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  },
};
