import { describe, it, expect, beforeEach } from 'vitest'
import { mockLogin, mockLogout, isAuthenticated } from '../auth.js'
import { mockLocalStorage } from '../../test-utils/setup.js'

describe('auth utils', () => {
  beforeEach(() => {
    global.localStorage = mockLocalStorage()
  })

  describe('mockLogin', () => {
    it('returns success with valid credentials', async () => {
      const result = await mockLogin('user', 'password')
      expect(result.success).toBe(true)
      expect(result.token).toBeDefined()
      expect(result.user.username).toBe('user')
    })

    it('returns failure with empty credentials', async () => {
      const result = await mockLogin('', '')
      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid credentials')
    })

    it('takes at least 1 second', async () => {
      const start = Date.now()
      await mockLogin('user', 'password')
      const duration = Date.now() - start
      expect(duration).toBeGreaterThanOrEqual(1000)
    })
  })

  describe('mockLogout', () => {
    it('removes token from localStorage', async () => {
      localStorage.setItem('token', 'test-token')
      await mockLogout()
      expect(localStorage.getItem('token')).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('returns true when token exists', () => {
      localStorage.setItem('token', 'test-token')
      expect(isAuthenticated()).toBe(true)
    })

    it('returns false when token does not exist', () => {
      expect(isAuthenticated()).toBe(false)
    })
  })
})
