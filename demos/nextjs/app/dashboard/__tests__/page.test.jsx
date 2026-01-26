import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Dashboard from '../page'

describe('Dashboard Page', () => {
  it('renders Hello World', () => {
    render(<Dashboard />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
