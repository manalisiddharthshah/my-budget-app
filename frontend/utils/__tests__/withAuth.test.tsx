import React from 'react';
import { render,screen } from '@testing-library/react';
import withAuth from '../withAuth';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom/extend-expect'; // Import this line to extend Jest's expect with DOM matchers

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('withAuth', () => {
  const MockComponent: React.FC = () => <div>Mock Component</div>;
  const WrappedComponent = withAuth(MockComponent);

  it('redirects to the home page when the user is not authenticated', () => {
    const replaceMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      replace: replaceMock,
    });

    localStorage.clear(); // Ensure localStorage is cleared to simulate user not being authenticated

    render(<WrappedComponent />);

    expect(replaceMock).toHaveBeenCalledWith('/');
  });

  it('renders the wrapped component when the user is authenticated', () => {
    const replaceMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      replace: replaceMock,
    });
  
    localStorage.setItem('user_id', '123'); // Simulate user being authenticated
  
    render(<WrappedComponent />);
    expect(screen.getByText('Mock Component')).toBeInTheDocument(); // Use screen instead of getByText directly
  });
});
