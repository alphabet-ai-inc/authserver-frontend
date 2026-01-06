// UserAccessPermissions.test.jsx - AFTER fixing the component
import { it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Simple mock
vi.mock('../../DynamicField.jsx', () => ({
  default: ({ label }) => <div>{label}</div>
}))

vi.mock('../../../config/selectOptions.js', () => ({
  ROLES: [],
  PROFILES: [],
  GROUPS: []
}))

import { UserAccessPermissions } from '../UserAccessPermissions.jsx'

it('renders title after component fix', () => {
  render(<UserAccessPermissions formData={{}} errors={{}} />)
  expect(screen.getByText('Access & Permissions')).toBeInTheDocument()
})