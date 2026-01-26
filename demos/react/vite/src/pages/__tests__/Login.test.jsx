import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Login'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Login', () => {
  it('renders login button', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('shows loading state when clicked', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    
    const button = screen.getByRole('button', { name: /login/i })
    await user.click(button)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('navigates to dashboard after login', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    
    const button = screen.getByRole('button', { name: /login/i })
    await user.click(button)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })
})
