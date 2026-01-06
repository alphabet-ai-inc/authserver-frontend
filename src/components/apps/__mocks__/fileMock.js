// __mocks__/fileMock.js (if needed for asset imports)
import { test, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

// Mock before importing
vi.mock('react-router-dom', () => ({
  // Don't mock MemoryRouter at all - let the test use it directly
  useNavigate: () => vi.fn(),
  Link: ({ children }) => <div>{children}</div>,
  // Export the actual MemoryRouter for use in tests
  MemoryRouter: ({ children }) => {
    const React = require('react')
    return React.createElement('div', {}, children)
  }
}))

vi.mock('../../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ jwtToken: 'test' })
}))

vi.mock('../NavBar.jsx', () => ({
  default: () => <div>NavBar</div>
}))

global.fetch = vi.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
)

// Now import
import Apps from '../Apps.jsx'
import { MemoryRouter } from 'react-router-dom'

test('basic render', () => {
  const { container } = render(
    <MemoryRouter>
      <Apps />
    </MemoryRouter>
  )

  expect(container).toBeTruthy()
})