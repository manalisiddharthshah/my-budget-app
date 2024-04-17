import { render, fireEvent, waitFor,screen  } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExpenseForm from '../ExpenseForm';
//import { fetchExpenses } from '../api/api';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// jest.mock('../api/api', () => ({
//   fetchExpenses: jest.fn(),
// }));

describe('ExpenseForm', () => {
  it('renders without crashing', () => {
    render(<ExpenseForm onSubmit={() => {}} formType="add" />);
    expect(screen.getByLabelText('Coffee Expense')).toBeInTheDocument();
    expect(screen.getByLabelText('Alcohol Expense')).toBeInTheDocument();
    expect(screen.getByLabelText('Food Expense')).toBeInTheDocument();
  });

//   it('submits expense data when the form is submitted', async () => {
//     const onSubmitMock = jest.fn();
//     const mockFetchExpenses = fetchExpenses as jest.Mock;

//     mockFetchExpenses.mockResolvedValueOnce({
//       data: [
//         { expense_type: 'coffee', amount: 5 },
//         { expense_type: 'alcohol', amount: 10 },
//         { expense_type: 'food', amount: 15 },
//       ],
//     });

//     const { getByLabelText, getByText } = render(<ExpenseForm onSubmit={onSubmitMock} formType="edit" />);

//     fireEvent.change(getByLabelText('Coffee Expense'), { target: { value: '20' } });
//     fireEvent.change(getByLabelText('Alcohol Expense'), { target: { value: '30' } });
//     fireEvent.change(getByLabelText('Food Expense'), { target: { value: '40' } });

//     fireEvent.click(getByText('Edit Expenses'));

//     await waitFor(() => {
//       expect(onSubmitMock).toHaveBeenCalledWith({ coffee: 20, alcohol: 30, food: 40 });
//     });
//   });
});
