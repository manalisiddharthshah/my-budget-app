import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateExpenseDto } from './dto/create-expense.dto'
import { LocalCreateMultipleExpensesResponse } from './interface/create.interface'
import * as moment from 'moment-timezone';
import { Request } from 'express';

@Injectable()
export class ExpenseService {
  constructor(private readonly pool: Pool) { }

  /**
   * Adds expenses to the database based on the provided CreateExpenseDto.
   * Validates each expense amount to be between 1 and 100.
   * 
   * @param createExpenseDto The data transfer object containing expense details.
   * @returns A message indicating the success of adding expenses.
   * @throws Error if there's an issue adding expenses or if the amount is invalid.
   */
  async createExpense(createExpenseDtos: CreateExpenseDto[], req: Request): Promise<LocalCreateMultipleExpensesResponse> {
    const client = await this.pool.connect();
    try {
      const user_id = req.headers['user_id']; // Assuming 'user_id' is the header field containing the user ID

      if (!user_id) {
        throw new Error('User ID not found in headers');
      }

      for (const createExpenseDto of createExpenseDtos) {
        const { expense_type, amount } = createExpenseDto;

        if (amount < 1 || amount > 100) {
          throw new Error('Amount must be between 1 and 100');
        }

        const todayDate = moment().tz('Asia/Kolkata').startOf('day').format('YYYY-MM-DD');
        const selectQuery = 'SELECT * FROM expenses WHERE user_id = $1 AND date(date) = $2 AND expense_type = $3';
        const selectValues = [user_id, todayDate, expense_type];
        const selectResult = await client.query(selectQuery, selectValues);

        if (selectResult.rows.length > 0) {
          const updateQuery = 'UPDATE expenses SET amount = $1 WHERE id = $2';
          const updateValues = [amount, selectResult.rows[0].id];
          await client.query(updateQuery, updateValues);
        } else {
          const insertQuery = 'INSERT INTO expenses (user_id, expense_type, amount, date) VALUES ($1, $2, $3, CURRENT_DATE)';
          const insertValues = [user_id, expense_type, amount];
          await client.query(insertQuery, insertValues);
        }
      }

      return { status: 201, message: 'Expenses added successfully' };
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback transaction in case of error
      throw new Error('Failed to add expenses');
    } finally {
      client.release();
    }
  }



  /**
   * Retrieves expenses data for a specific user for the current day.
   * 
   * @param userId The ID of the user for whom to retrieve expenses.
   * @returns An object containing the HTTP status and the expenses data for the user.
   * @throws NotFoundException if no expenses are found for the user for the current day.
   */
  async getUserData(userId: number) {
    const client = await this.pool.connect();
    try {
      const todayDate = moment().tz('Asia/Kolkata').startOf('day').format('YYYY-MM-DD'); // Get start of today in the timezone
      const query = 'SELECT * FROM expenses WHERE user_id = $1 AND date(date) = $2';
      const values = [userId, todayDate];
      const res = await client.query(query, values);
      if (!res.rows.length) {
        throw new NotFoundException('No expenses found for the user for the current day');
      }
      return { status: 200, data: res.rows }
    } catch (error) {
      throw new NotFoundException({ status: 404, data: [], message: 'No expenses found for the user for the current day' });
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves the current week's expenses for a specific user, along with average expenses and difference status compared to the previous week.
   * 
   * @param userId The ID of the user for whom to retrieve expenses.
   * @returns An object containing the current week's expenses, category averages, and difference status compared to the previous week.
   * @throws Error if there's an issue fetching current and previous week expenses.
   */
  async getCurrentWeekExpenses(userId: number): Promise<any> {
    const client = await this.pool.connect();
    try {
      // Calculate the date range for the current week (Monday to Sunday)
      const currentDate = new Date();
      const startOfCurrentWeek = new Date(currentDate);
      startOfCurrentWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday

      const endOfCurrentWeek = new Date(currentDate);
      endOfCurrentWeek.setDate(currentDate.getDate() - currentDate.getDay() + 7); // Sunday

      // Calculate the date range for the previous week
      const startOfPreviousWeek = new Date(startOfCurrentWeek);
      startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7); // Previous Monday

      const endOfPreviousWeek = new Date(endOfCurrentWeek);
      endOfPreviousWeek.setDate(endOfCurrentWeek.getDate() - 7); // Previous Sunday

      // Query to get expenses for the current week for the given user
      const currentWeekQuery = `
          SELECT expense_type, SUM(amount) AS total_amount
          FROM expenses
          WHERE user_id = $1 AND date >= $2 AND date <= $3
          GROUP BY expense_type
      `;
      const currentWeekValues = [userId, startOfCurrentWeek, endOfCurrentWeek];
      const currentWeekRes = await client.query(currentWeekQuery, currentWeekValues);

      // Query to get expenses for the previous week for the given user
      const previousWeekQuery = `
          SELECT expense_type, SUM(amount) AS total_amount
          FROM expenses
          WHERE user_id = $1 AND date >= $2 AND date <= $3
          GROUP BY expense_type
      `;
      const previousWeekValues = [userId, startOfPreviousWeek, endOfPreviousWeek];
      const previousWeekRes = await client.query(previousWeekQuery, previousWeekValues);

      // Create objects to hold the current and previous week's expenses
      const currentWeekExpenses = {};
      const previousWeekExpenses = {};

      // Populate current week expenses
      currentWeekRes.rows.forEach(row => {
        currentWeekExpenses[row.expense_type] = Number(row.total_amount);
      });

      // Populate previous week expenses
      previousWeekRes.rows.forEach(row => {
        previousWeekExpenses[row.expense_type] = Number(row.total_amount);
      });

      // Calculate the average between current and previous week's expenses
      const categoryAverages = {};
      for (const category in currentWeekExpenses) {
        if (previousWeekExpenses.hasOwnProperty(category)) {
          const currentAmount = currentWeekExpenses[category];
          const previousAmount = previousWeekExpenses[category];
          const average = (currentAmount - previousAmount) / previousAmount * 100;
          categoryAverages[category] = average;
        }
      }

      // Determine whether each category's expense is above or below average
      const categoryDifferenceStatus = {};
      for (const category in categoryAverages) {
        const currentAmount = currentWeekExpenses[category];
        const previousAmount = previousWeekExpenses[category];
        const average = categoryAverages[category];
        if (currentAmount < previousAmount) {
          categoryDifferenceStatus[category] = 'below average';
        } else if (currentAmount > previousAmount) {
          categoryDifferenceStatus[category] = 'above average';
        } else {
          categoryDifferenceStatus[category] = 'same as previous week';
        }
      }

      return {
        current_week_expense: currentWeekExpenses,
        categoryAverages: categoryAverages,
        categoryDifferenceStatus: categoryDifferenceStatus
      };
    } catch (error) {
      throw new Error('Failed to fetch current and previous week expenses');
    } finally {
      client.release();
    }
  }

}
