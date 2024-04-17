import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';

@Module({
  controllers: [ExpenseController],
  providers: [
    ExpenseService, 
    {
      provide: Pool,
      useValue: new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'tech_assessment',
        password: 'ctpl@dev',
        port: 5432,
      }),
    },
  ],
})
export class ExpenseModule {}
