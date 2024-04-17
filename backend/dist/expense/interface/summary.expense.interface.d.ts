export interface ExpenseSummaryResponse {
    current_week_expense: CurrentWeekExpenses;
    categoryAverages: CategoryAverages;
    categoryDifferenceStatus: CategoryDifferenceStatus;
}
interface CurrentWeekExpenses {
    [category: string]: number;
}
interface CategoryAverages {
    [category: string]: number;
}
interface CategoryDifferenceStatus {
    [category: string]: string;
}
export {};
