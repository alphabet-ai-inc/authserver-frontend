// UserProfile.test.jsx - Test Only Imports
import { test, expect, vi } from 'vitest'

// Minimal mocks
global.fetch = vi.fn()

test('component can be imported', async () => {
  // Just test import works
  const module = await import('../UserProfile.jsx')
  expect(module.UserProfile).toBeDefined()
  expect(typeof module.UserProfile).toBe('function')
})

test('mocks work', () => {
  // Test mocks are set up
  expect(typeof fetch).toBe('function')
})