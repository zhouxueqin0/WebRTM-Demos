import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Login from '../page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('Login Page', () => {
  it('renders login button', () => {
    render(<Login />)
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })
})
