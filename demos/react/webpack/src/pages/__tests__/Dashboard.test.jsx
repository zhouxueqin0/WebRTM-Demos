import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Dashboard from '../Dashboard'

describe('Dashboard', () => {
  it('renders Hello World', () => {
    render(<Dashboard />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
