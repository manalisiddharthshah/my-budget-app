import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Request } from 'express';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    createExpense(createExpenseDto: CreateExpenseDto[], req: Request): unknown;
    getUserData(userId: number): unknown;
    getExpensesPerWeek(userId: number): unknown;
}
