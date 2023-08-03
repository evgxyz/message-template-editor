import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '@/App';

describe('App testing', () => {
  test('renders "Open Message Template Editor" button', () => {
    render(<App />);
    const elem = screen.getByText(/Open Message Template Editor/i);
    expect(elem).toBeInTheDocument();
  })
});
