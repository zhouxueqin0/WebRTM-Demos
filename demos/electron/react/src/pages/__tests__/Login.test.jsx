import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import Login from '../Login'

describe('Login', () => {
  it('renders login button', () => {
    render(
      <HashRouter>
        <Login />
      </HashRouter>
    )
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })
})
