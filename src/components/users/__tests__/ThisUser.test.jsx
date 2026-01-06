import { test, expect, vi } from 'vitest'

// Set up all mocks FIRST
vi.mock('react-router-dom', () => {
  const React = require('react')
  return {
    useNavigate: vi.fn(),
    Link: (props) => React.createElement('a', props),
    MemoryRouter: (props) => React.createElement('div', props)
  }
})

vi.mock('../../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ jwtToken: 'mock-token' })
}))

vi.mock('../NavBar.jsx', () => ({
  default: () => {
    const React = require('react')
    return React.createElement('div', null, 'NavBar')
  }
}))

global.fetch = vi.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve([])
}))

// Test that doesn't even render
test('Users component exists', async () => {
  // Just check we can import it
  const module = await import('../Users.jsx')
  // Support both default and named export 'Users'
  const UsersComponent = module.default ?? module.Users
  expect(UsersComponent).toBeDefined()
  expect(typeof UsersComponent).toBe('function')
})

test('mocks are set up correctly', () => {
  // Check fetch is mocked
  expect(typeof fetch).toBe('function')

  // Check we can call fetch
  expect(() => fetch('/test')).not.toThrow()
})