import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import this line to extend Jest's expect with DOM matchers
import AddEditPage from '../add-edit';
//import { expense } from '../api/api';

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    push: jest.fn(),
  }),
}));

// jest.mock('../api/api', () => ({
//   expense: jest.fn(),
// }));

describe('AddEditPage', () => {
  it('renders without crashing', () => {
    render(<AddEditPage />);
    // Check if the component renders without throwing any errors
    expect(screen.getByText('How much did I spend today?')).toBeInTheDocument();
  });

//   it('submits expense data when the form is submitted', async () => {
//     const mockRouterPush = jest.fn();
//     const mockExpense = expense as jest.Mock;

//     mockExpense.mockResolvedValueOnce(); // Mock the expense API function

//     const { getByLabelText, getByText } = render(<AddEditPage />);
//     fireEvent.change(getByLabelText('Coffee'), { target: { value: '5' } });
//     fireEvent.change(getByLabelText('Alcohol'), { target: { value: '10' } });
//     fireEvent.change(getByLabelText('Food'), { target: { value: '15' } });
//     fireEvent.click(getByText('Submit'));

//     await waitFor(() => {
//       expect(mockExpense).toHaveBeenCalledWith({
//         expenseData: [
//           { expense_type: 'coffee', amount: 5 },
//           { expense_type: 'alcohol', amount: 10 },
//           { expense_type: 'food', amount: 15 },
//         ],
//       });
//       expect(mockRouterPush).toHaveBeenCalledWith('/');
//     });
//   });
});
