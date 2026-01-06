// Users.test.jsx
import { test, expect, vi } from 'vitest'
import React from 'react'

// Mock everything simply
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }) => React.createElement('div', null, children)
}))

vi.mock('../../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ jwtToken: 'mock' })
}))

vi.mock('../../NavBar.jsx', () => ({
  default: () => React.createElement('div', null, 'Nav')
}))

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
)

vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_BACKEND_URL: 'http://test.com'
    }
  }
})

test('Users component exists', async () => {
  const module = await import('../Users.jsx')
  expect(module.default).toBeDefined()
})

test('component renders something', async () => {
  const { default: Users } = await import('../Users.jsx')
  const React = require('react')
  const { render } = require('@testing-library/react')

  render(
    React.createElement(Users)
  )

  // Just check that it rendered without throwing
  expect(true).toBe(true)
})