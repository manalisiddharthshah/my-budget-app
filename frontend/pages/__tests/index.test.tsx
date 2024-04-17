import { render, screen } from '@testing-library/react';
import HomePage from '../index';
import '@testing-library/jest-dom/extend-expect'; // Import this line to extend Jest's expect with DOM matchers

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
    // Check if the component renders without throwing any errors
    expect(screen.getByText('Am I spending too much?')).toBeInTheDocument();
  });

  // You can write more specific test cases for other functionality of your component
});
