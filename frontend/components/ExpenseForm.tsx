import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import WineBarIcon from '@mui/icons-material/WineBar';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { fetchExpenses } from '../api/api';

interface ExpenseFormProps {
  onSubmit: (amounts: { coffee: number; food: number; alcohol: number }) => void;
  formType: string;
}

// Validation function for form fields
const validate = (values: { coffee: string; food: string; alcohol: string }) => {
  const errors: { coffee?: string; food?: string; alcohol?: string } = {};

  // Validate Coffee field
  if (parseFloat(values.coffee) < 1 || parseFloat(values.coffee) > 100) {
    errors.coffee = 'Enter a valid amount between $1 and $100 for Coffee';
  }

  // Validate Food field
  if (parseFloat(values.food) < 1 || parseFloat(values.food) > 100) {
    errors.food = 'Enter a valid amount between $1 and $100 for Food';
  }

  // Validate Alcohol field
  if (parseFloat(values.alcohol) < 1 || parseFloat(values.alcohol) > 100) {
    errors.alcohol = 'Enter a valid amount between $1 and $100 for Alcohol';
  }

  return errors;
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, formType }) => {
  const router = useRouter();

  // Formik hook for managing form state and validation
  const formik = useFormik({
    initialValues: {
      coffee: '0',
      food: '0',
      alcohol: '0',
    },
    validate,
    onSubmit: (values) => {
      // Parse form values to numbers and invoke onSubmit prop
      const coffee = parseFloat(values.coffee);
      const alcohol = parseFloat(values.alcohol);
      const food = parseFloat(values.food);

      onSubmit({ coffee, alcohol,food });
    },
  });

  // Handle back button click
  const handleBack = () => {
    // Redirect to the home page or perform other actions
    router.push('/');
  };

  // Fetch data when the form type is 'edit'
  useEffect(() => {
    if (formType === 'edit') {
      const user_id = localStorage.getItem('user_id');
      fetchData(user_id);
    }
  }, [formType]);

  // Fetch expenses data for editing
  const fetchData = async (user_id: any) => {
    try {
      const expenses = await fetchExpenses(user_id);
      const data = expenses?.data;

      // Find expenses by type and set form values accordingly
      const coffeeExpense = data.find((expense) => expense.expense_type === 'coffee');
      const alcoholExpense = data.find((expense) => expense.expense_type === 'alcohol');
      const foodExpense = data.find((expense) => expense.expense_type === 'food');

      formik.setValues({
        coffee: coffeeExpense.amount.toString(),
        alcohol: alcoholExpense.amount.toString(),
        food: foodExpense.amount.toString(),
      });
    } catch (error) {
      console.error('Error fetching expenses:', error.message);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {/* Coffee Expense Input */}
      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '15px' }}>
        <Grid item xs={12} sm={2}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6" style={{ marginLeft: '10px' }}>
              Coffee
            </Typography>
            <LocalCafeIcon fontSize="small" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Coffee Expense"
            type="number"
            variant="outlined"
            fullWidth
            {...formik.getFieldProps('coffee')}
            error={formik.touched.coffee && Boolean(formik.errors.coffee)}
            helperText={formik.touched.coffee && formik.errors.coffee}
          />
        </Grid>
      </Grid>

      {/* Alcohol Expense Input */}
      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '15px' }}>
        <Grid item xs={12} sm={2}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6" style={{ marginLeft: '10px' }}>
              Alcohol
            </Typography>
            <WineBarIcon fontSize="small" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Alcohol Expense"
            type="number"
            variant="outlined"
            fullWidth
            {...formik.getFieldProps('alcohol')}
            error={formik.touched.alcohol && Boolean(formik.errors.alcohol)}
            helperText={formik.touched.alcohol && formik.errors.alcohol}
          />
        </Grid>
      </Grid>

      {/* Food Expense Input */}
      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '15px' }}>
        <Grid item xs={12} sm={2}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6" style={{ marginLeft: '10px' }}>
              Food
            </Typography>
            <FastfoodIcon fontSize="small" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Food Expense"
            type="number"
            variant="outlined"
            fullWidth
            {...formik.getFieldProps('food')}
            error={formik.touched.food && Boolean(formik.errors.food)}
            helperText={formik.touched.food && formik.errors.food}
          />
        </Grid>
      </Grid>

      {/* Form Submission Buttons */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button variant="contained" onClick={formik.handleSubmit} style={{ marginTop: '20px' }}>
            {formType === 'add' ? 'Add' : 'Edit'} Expenses
          </Button>
        </Grid>

        <Grid item>
          <Button variant="outlined" onClick={handleBack} style={{ marginTop: '20px', marginLeft: '10px' }}>
            Back
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpenseForm;