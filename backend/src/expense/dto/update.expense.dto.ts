// update-expense.dto.ts
import { IsNotEmpty, Min, Max, IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object for updating expenses.
 */
export class UpdateExpenseDto {
  @IsNotEmpty()
  @IsString()
  expense_type: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  amount: number;
}
