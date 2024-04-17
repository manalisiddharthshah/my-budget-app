import { Pool } from 'pg';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { LocalCreateMultipleExpensesResponse } from './interface/create.interface';
import { Request } from 'express';
export declare class ExpenseService {
    private readonly pool;
    constructor(pool: Pool);
    createExpense(createExpenseDtos: CreateExpenseDto[], req: Request): Promise<LocalCreateMultipleExpensesResponse>;
    getUserData(userId: number): Promise<{
        status: number;
        data: any;
    }>;
    getCurrentWeekExpenses(userId: number): Promise<any>;
}
