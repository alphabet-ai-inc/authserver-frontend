// UserAPI.test.js - Minimal version
import { describe, it, expect, vi } from 'vitest'

// Mock everything first
global.fetch = vi.fn()

const mockConvertApiToFormData = vi.fn()
const mockConvertUserData = vi.fn()

vi.mock('../../../utils/formConverters/UserConverter', () => ({
  convertApiToFormData: mockConvertApiToFormData,
  convertUserData: mockConvertUserData
}))

// Import after mocks
const { fetchUserForEdit, fetchUserDetails, submitUserForm } = await import('../../users/UserFormHandlers.jsx')

describe('UserAPI - Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchUserForEdit', () => {
    it('works', async () => {
      const mockUser = { id: 1, name: 'Test' }
      const mockFormData = { name: 'Test' }

      fetch.mockResolvedValue({ ok: true, json: async () => mockUser })
      mockConvertApiToFormData.mockReturnValue(mockFormData)

      const result = await fetchUserForEdit(1, 'token')

      expect(result).toBe(mockFormData)
    })
  })

  describe('fetchUserDetails', () => {
    it('returns data on success', async () => {
      const mockData = { roles: [], profiles: [], groups: [], companies: [] }
      fetch.mockResolvedValue({ ok: true, json: async () => mockData })

      const result = await fetchUserDetails('token')

      expect(result.roles).toEqual([])
    })
  })

  describe('submitUserForm', () => {
    it('calls correct method based on ID', async () => {
      const formData = { name: 'Test' }
      const response = { id: 1 }

      mockConvertUserData.mockReturnValue(formData)
      fetch.mockResolvedValue({ ok: true, json: async () => response })

      // Test POST for new user (id = 0)
      await submitUserForm(formData, 0, 'token')
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({ method: 'POST' })
      )

      // Test PUT for existing user
      await submitUserForm(formData, 1, 'token')
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({ method: 'PUT' })
      )
    })
  })
})