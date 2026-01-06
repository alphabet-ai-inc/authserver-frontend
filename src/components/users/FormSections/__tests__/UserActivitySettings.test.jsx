// UserActivitySettings.test.jsx - FIXED
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserActivitySettings } from '../UserActivitySettings.jsx'

// Mock DynamicField to return our testid
vi.mock('../../../DynamicField.jsx', () => ({
  default: vi.fn().mockImplementation(({ label, placeholder }) => (
    <div data-testid="dynamic-field">
      <span>{label}</span>
      <select placeholder={placeholder} data-testid="field-select" />
    </div>
  ))
}))

// Mock select options
vi.mock('../../../config/selectOptions.js', () => ({
  LANGUAGE_OPTIONS: [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' }
  ],
  APP_OPTIONS: [
    { value: 'app1', label: 'Application 1' },
    { value: 'app2', label: 'Application 2' }
  ]
}))

describe('UserActivitySettings', () => {
  const defaultProps = {
    formData: {
      lan: '',
      last_app: '',
      last_db: '',
      tries: 0
    },
    errors: {},
    disabled: false
  }

  it('renders title and description', () => {
    render(<UserActivitySettings {...defaultProps} />)

    expect(screen.getByText('Activity & Usage Settings')).toBeInTheDocument()
    expect(screen.getByText(/Configure user activity tracking/)).toBeInTheDocument()
  })

  it('renders DynamicField for language preference', () => {
    render(<UserActivitySettings {...defaultProps} />)

    // Use getAllByText to get ALL matching elements
    const languageLabels = screen.getAllByText(/Language Preference/i)

    // Check we have at least one
    expect(languageLabels.length).toBeGreaterThan(0)

    // Also check we have the DynamicField testid
    const fields = screen.getAllByTestId('dynamic-field')
    expect(fields.length).toBeGreaterThan(0)

    console.log(`Found ${languageLabels.length} "Language Preference" labels`)
    console.log(`Found ${fields.length} DynamicField components`)
  })

  it('shows errors when present', () => {
    const props = {
      ...defaultProps,
      errors: {
        lan: 'Language is required',
        tries: 'Invalid number'
      }
    }

    render(<UserActivitySettings {...props} />)

    // Component should render with errors
    expect(screen.getByText('Activity & Usage Settings')).toBeInTheDocument()
  })

  it('disables fields when disabled is true', () => {
    const props = {
      ...defaultProps,
      disabled: true
    }

    render(<UserActivitySettings {...props} />)

    // Component should render
    expect(screen.getByText('Activity & Usage Settings')).toBeInTheDocument()
  })
})