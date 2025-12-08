// __tests__/components/LoadingScreen.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingScreen } from '../LoadingScreen';

describe('LoadingScreen', () => {
  test('should display loading message', () => {
    render(<LoadingScreen />);

    // Only test what's important - the content
    expect(screen.getByText('Loading session...')).toBeInTheDocument();
  });

  test('should be accessible', () => {
    render(<LoadingScreen />);

    expect(screen.getByText('Loading session...')).toBeVisible();
  });

  test('should not have interactive content', () => {
    render(<LoadingScreen />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  test('should render consistently', () => {
    const { rerender } = render(<LoadingScreen />);

    expect(screen.getByText('Loading session...')).toBeInTheDocument();

    rerender(<LoadingScreen />);

    expect(screen.getByText('Loading session...')).toBeInTheDocument();
  });
});