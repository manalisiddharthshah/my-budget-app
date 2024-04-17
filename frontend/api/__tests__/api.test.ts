import { fetchExpenses, listExpenses, expense } from '../api';

describe('API Functions', () => {
  // Mocking the fetch function
  const mockFetch = jest.fn();
  (global as any).fetch = mockFetch;

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock data for testing
  const mockUserId = 'user123';
  const mockExpenseData = {
    expenseData: [
      { expense_type: 'coffee', amount: 5 },
      { expense_type: 'food', amount: 10 }
    ]
  };

  const mockResponseData = {
    status: 200,
    data: [],
    message: 'Success',
    categoryAverages: {},
    categoryDifferenceStatus: {},
    current_week_expense: {}
  };

  test('fetchExpenses function', async () => {
    // Mocking successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponseData)
    });

    const result = await fetchExpenses(mockUserId);

    expect(result).toEqual(mockResponseData);

    // Ensure fetch is called with the correct URL
    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_BASE_URL}/expense/${mockUserId}`);
  });

  test('listExpenses function', async () => {
    // Mocking successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponseData)
    });

    const result = await listExpenses(mockUserId);

    expect(result).toEqual(mockResponseData);

    // Ensure fetch is called with the correct URL
    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_BASE_URL}/averageExpense/${mockUserId}`);
  });

  test('expense function', async () => {
    // Mocking successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponseData)
    });
  
    const result = await expense(mockExpenseData);
  
    expect(result).toEqual(mockResponseData);
  
    // Check if user_id exists in localStorage
    const userId = localStorage.getItem('user_id');
    const headers: Record<string, string> = {
      'content-type': 'application/json', // Make sure the key is lowercase
    };
    if (userId) {
      headers['user_id'] = userId;
    }
  
    // Ensure fetch is called with the correct URL, method, headers, and body
    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_BASE_URL}/expense`, {
      method: 'POST',
      headers,
      body: JSON.stringify(mockExpenseData?.expenseData),
    });
  });
  
  

  test('expense function - without user_id', async () => {
    // Mocking successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponseData)
    });

    // Remove user_id from localStorage
    localStorage.removeItem('user_id');

    const result = await expense(mockExpenseData);

    expect(result).toEqual(mockResponseData);

    // Ensure fetch is called without user_id in headers
    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_BASE_URL}/expense`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(mockExpenseData.expenseData)
    });
  });

  test('expense function - failed request', async () => {
    // Mocking failed response
    mockFetch.mockResolvedValueOnce({
      ok: false
    });

    // Testing for error handling
    await expect(expense(mockExpenseData)).rejects.toThrow('Failed to update expense');
  });
});
