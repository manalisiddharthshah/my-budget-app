"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const moment = require("moment-timezone");
let ExpenseService = class ExpenseService {
    constructor(pool) {
        this.pool = pool;
    }
    async createExpense(createExpenseDtos, req) {
        const client = await this.pool.connect();
        try {
            const user_id = req.headers['user_id'];
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
                }
                else {
                    const insertQuery = 'INSERT INTO expenses (user_id, expense_type, amount, date) VALUES ($1, $2, $3, CURRENT_DATE)';
                    const insertValues = [user_id, expense_type, amount];
                    await client.query(insertQuery, insertValues);
                }
            }
            return { status: 201, message: 'Expenses added successfully' };
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw new Error('Failed to add expenses');
        }
        finally {
            client.release();
        }
    }
    async getUserData(userId) {
        const client = await this.pool.connect();
        try {
            const todayDate = moment().tz('Asia/Kolkata').startOf('day').format('YYYY-MM-DD');
            const query = 'SELECT * FROM expenses WHERE user_id = $1 AND date(date) = $2';
            const values = [userId, todayDate];
            const res = await client.query(query, values);
            if (!res.rows.length) {
                throw new common_1.NotFoundException('No expenses found for the user for the current day');
            }
            return { status: 200, data: res.rows };
        }
        catch (error) {
            throw new common_1.NotFoundException({ status: 404, data: [], message: 'No expenses found for the user for the current day' });
        }
        finally {
            client.release();
        }
    }
    async getCurrentWeekExpenses(userId) {
        const client = await this.pool.connect();
        try {
            const currentDate = new Date();
            const startOfCurrentWeek = new Date(currentDate);
            startOfCurrentWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
            const endOfCurrentWeek = new Date(currentDate);
            endOfCurrentWeek.setDate(currentDate.getDate() - currentDate.getDay() + 7);
            const startOfPreviousWeek = new Date(startOfCurrentWeek);
            startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);
            const endOfPreviousWeek = new Date(endOfCurrentWeek);
            endOfPreviousWeek.setDate(endOfCurrentWeek.getDate() - 7);
            const currentWeekQuery = `
          SELECT expense_type, SUM(amount) AS total_amount
          FROM expenses
          WHERE user_id = $1 AND date >= $2 AND date <= $3
          GROUP BY expense_type
      `;
            const currentWeekValues = [userId, startOfCurrentWeek, endOfCurrentWeek];
            const currentWeekRes = await client.query(currentWeekQuery, currentWeekValues);
            const previousWeekQuery = `
          SELECT expense_type, SUM(amount) AS total_amount
          FROM expenses
          WHERE user_id = $1 AND date >= $2 AND date <= $3
          GROUP BY expense_type
      `;
            const previousWeekValues = [userId, startOfPreviousWeek, endOfPreviousWeek];
            const previousWeekRes = await client.query(previousWeekQuery, previousWeekValues);
            const currentWeekExpenses = {};
            const previousWeekExpenses = {};
            currentWeekRes.rows.forEach(row => {
                currentWeekExpenses[row.expense_type] = Number(row.total_amount);
            });
            previousWeekRes.rows.forEach(row => {
                previousWeekExpenses[row.expense_type] = Number(row.total_amount);
            });
            const categoryAverages = {};
            for (const category in currentWeekExpenses) {
                if (previousWeekExpenses.hasOwnProperty(category)) {
                    const currentAmount = currentWeekExpenses[category];
                    const previousAmount = previousWeekExpenses[category];
                    const average = (currentAmount - previousAmount) / previousAmount * 100;
                    categoryAverages[category] = average;
                }
            }
            const categoryDifferenceStatus = {};
            for (const category in categoryAverages) {
                const currentAmount = currentWeekExpenses[category];
                const previousAmount = previousWeekExpenses[category];
                const average = categoryAverages[category];
                if (currentAmount < previousAmount) {
                    categoryDifferenceStatus[category] = 'below average';
                }
                else if (currentAmount > previousAmount) {
                    categoryDifferenceStatus[category] = 'above average';
                }
                else {
                    categoryDifferenceStatus[category] = 'same as previous week';
                }
            }
            return {
                current_week_expense: currentWeekExpenses,
                categoryAverages: categoryAverages,
                categoryDifferenceStatus: categoryDifferenceStatus
            };
        }
        catch (error) {
            throw new Error('Failed to fetch current and previous week expenses');
        }
        finally {
            client.release();
        }
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof pg_1.Pool !== "undefined" && pg_1.Pool) === "function" ? _a : Object])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map