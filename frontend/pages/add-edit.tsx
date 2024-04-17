import React, { useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { expense } from '../api/api';
import withAuth from '../utils/withAuth';

const AddEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  interface ExpenseData {
    expenseData: {
      expense_type: string;
      amount: number;
    }[];
  }

  // Handle expense submission
  const handleExpenseSubmit = async (amounts: { coffee: number; alcohol: number;food: number}) => {
      const data: ExpenseData['expenseData'] = [
        {
            "expense_type": "coffee",
            "amount": amounts.coffee
        },
        {
            "expense_type": "alcohol",
            "amount": amounts.alcohol
        },
        {
            "expense_type": "food",
            "amount": amounts.food
        }
      ];
      await expense({ expenseData: data });
      // Redirect to the home page after submission
    router.push('/');
  };

  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        How much did I spend today?
      </Typography>
      {/* Expense form component */}
      <ExpenseForm onSubmit={handleExpenseSubmit} formType={id ? 'edit' : 'add'} />
    </Box>
  );
};

export default withAuth(AddEditPage);