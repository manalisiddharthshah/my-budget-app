// create-expense.dto.ts
import { IsNotEmpty, IsNumber, IsString, Min, Max  } from 'class-validator';

/**
 * Data transfer object for creating expenses.
 */
export class CreateExpenseDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  expense_type: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  amount: number;

  @IsNotEmpty()
  @IsString()
  date: string;
}
