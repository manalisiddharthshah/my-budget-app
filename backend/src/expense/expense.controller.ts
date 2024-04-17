import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto'
import { UpdateExpenseDto } from './dto/update.expense.dto'
import { Request } from 'express';

// Update multiple expense Interface
interface UpdateMultipleExpensesResponse {
  status: number;
  message: string;
}


@Controller()
export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) { }

    /**
     * Endpoint to create expenses.
     * 
     * @param createExpenseDto The data transfer object containing expense details.
     * @returns A promise that resolves to the result of creating expenses.
     */
    @Post('expense')
    async createExpense(@Body() createExpenseDto: CreateExpenseDto[],  @Req() req: Request) {
        return this.expenseService.createExpense(createExpenseDto, req);
    }

     /**
     * Endpoint to get all expenses for a specific user.
     * 
     * @param userId The ID of the user for whom to retrieve expenses.
     * @returns A promise that resolves to the result of fetching expenses for the user.
     */
    @Get('expense/:userId')
    async getUserData(@Param('userId') userId: number) {
        return this.expenseService.getUserData(userId);
    }

     /**
     * Endpoint to get expenses for the current week for a specific user.
     * 
     * @param userId The ID of the user for whom to retrieve expenses.
     * @returns A promise that resolves to the result of fetching expenses for the current week.
     */
    @Get('averageExpense/:userId')
    async getExpensesPerWeek(@Param('userId') userId: number) {
      return this.expenseService.getCurrentWeekExpenses(userId);
    }
}
