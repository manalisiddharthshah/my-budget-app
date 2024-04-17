// expense.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Request } from 'express';
// import { BoundPool } from './expense.service';

describe('ExpenseService', () => {
    let expenseService: ExpenseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ExpenseService],
        }).compile();

        expenseService = module.get<ExpenseService>(ExpenseService);
    });

    describe('createExpense', () => {
        it('should create expenses', async () => {
            const createExpenseDtos: CreateExpenseDto[] = [
                { user_id:1, expense_type: 'coffee', amount: 10, date: '2024-03-11' },
                { user_id:1, expense_type: 'alcohol', amount: 20, date: '2024-03-11' },
                { user_id:1, expense_type: 'alcohol', amount: 20, date: '2024-03-11' },
            ];

            const req: Request = {
              headers: { 'user_id': 1 }, // Replace with your user ID
            } as unknown as Request;

            const result = await expenseService.createExpense(createExpenseDtos, req);

            // Add assertions based on the expected behavior of your createExpense method
            expect(result).toEqual({ status: 201, message: 'Expenses added successfully' });
        });

        // Add more test cases for different scenarios

        it('should throw an error for invalid amount', async () => {
            const createExpenseDtos: CreateExpenseDto[] = [
                {user_id:1, expense_type: 'coffee', amount: 101, date: '2024-03-11' }, // Invalid amount
            ];

            const req: Request = {
              headers: { 'user_id': 1 },
            } as unknown as Request;

            // Use async/await syntax to handle asynchronous code
            await expect(expenseService.createExpense(createExpenseDtos, req)).rejects.toThrowError('Failed to add expenses');
        });
    });
});
