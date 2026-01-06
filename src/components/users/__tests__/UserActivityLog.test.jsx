import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

// Mock with async importOriginal
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
    useNavigate: () => vi.fn()
  }
})

vi.mock('../../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ jwtToken: 'test-token' })
}))

vi.mock('../../../utils/Unix2Ymd.jsx', () => ({
  formatUnixTimestamp: () => '2023-01-01 12:00:00'
}))

vi.mock('../../NavBar.jsx', () => ({
  default: () => <div>NavBar</div>
}))

global.fetch = vi.fn()

vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_BACKEND_URL: 'http://localhost:3001'
    }
  }
})

// Import component AFTER mocks
const { UserActivityLog } = await import('../UserActivityLog.jsx')

describe('UserActivityLog - Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    // Make fetch never resolve
    fetch.mockImplementation(() => new Promise(() => {}))

    const { container } = render(
      <MemoryRouter>
        <UserActivityLog />
      </MemoryRouter>
    )

    // Use basic assertions without jest-dom
    const text = container.textContent
    expect(text).toContain('Loading activity log...')
  })

  it('renders user data', async () => {
    // Mock successful response
    fetch.mockImplementation((url) => {
      if (url.includes('/activities')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 1,
              type: 'login',
              description: 'Test login',
              timestamp: 123,
              details: 'Details',
              ip_address: '192.168.1.1',
              status: 'success'
            }
          ])
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          first_name: 'John',
          last_name: 'Doe',
          id: '123'
        })
      })
    })

    const { container } = render(
      <MemoryRouter>
        <UserActivityLog />
      </MemoryRouter>
    )

    // Wait for rendering
    await waitFor(() => {
      const text = container.textContent
      expect(text).toContain('John')
      expect(text).toContain('Doe')
    })
  })
})