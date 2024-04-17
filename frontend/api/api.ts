// Define the structure for the data sent when creating or updating an expense
interface ExpenseData {
  expenseData: {
    expense_type: string;
    amount: number;
  }[];
}

interface ExpenseResponse {
  status: number;
  data:any[];
  message:string;
  categoryAverages:any;
  categoryDifferenceStatus:any;
  current_week_expense:any;
}
// Fetch expenses for finding expenses count & to show data on edit expense
export const fetchExpenses = async (userId: string):Promise<ExpenseResponse> => {
  // Make a GET request to retrieve all expenses for a given user
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/expense/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }

  // Parse the response as JSON and return the data
  const data = await response.json();
  return data;
};

// List expenses on the home page, summing per week
export const listExpenses = async (userId: string):Promise<ExpenseResponse> => {
  // Make a GET request to retrieve summarized expenses per week for a given user
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/averageExpense/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }

  // Parse the response as JSON and return the data
  const data = await response.json();
  return data;
};

// Create & Update expense for the add/edit expense page
export const expense = async (expenseData: ExpenseData):Promise<ExpenseResponse> => {
  const userId = localStorage.getItem('user_id');

  // Construct headers with or without user_id based on its presence
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (userId) {
    headers['user_id'] = userId;
  }

  // Convert headers to lowercase
  const lowercasedHeaders = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value])
  );

  // Make a POST request to create a new expense for a given user
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/expense`, {
    method: 'POST',
    headers:lowercasedHeaders,
    body: JSON.stringify(expenseData?.expenseData),
  });

  if (!response.ok) {
    throw new Error('Failed to update expense');
  }

  // Parse the response as JSON and return the data
  const data = await response.json();
  return data;
};