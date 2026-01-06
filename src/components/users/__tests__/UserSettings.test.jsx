// UserSettings.test.jsx - FIXED VERSION
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

// Mock react-router-dom properly
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
    useNavigate: () => vi.fn()
  }
})

// Mock NavBar
vi.mock('../../NavBar.jsx', () => ({
  default: () => <div>NavBar</div>
}))

// Mock alert
global.alert = vi.fn()

// Import component after mocks
import { UserSettings } from '../UserSettings.jsx'

describe('UserSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserSettings />
      </MemoryRouter>
    )

    // ✅ This will now work without "Invalid Chai property" error
    expect(screen.getByText(/User Settings|user settings/i)).toBeInTheDocument()
  })

  test('has back button', () => {
    render(
      <MemoryRouter>
        <UserSettings />
      </MemoryRouter>
    )

    // ✅ This will also work
    expect(screen.getByText(/back to user/i)).toBeInTheDocument()
  })
})