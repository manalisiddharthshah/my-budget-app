import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Pool } from 'pg';
import { ExpenseModule } from './expense/expense.module';


@Module({
  imports: [ExpenseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  private readonly pool: Pool;
  constructor() {
    this.pool = new Pool({
      dialect: 'postgres',
      user: 'postgres',
      host: 'localhost',
      database: 'tech_assessment',
      password: 'ctpl@dev',
      port: 5432,
    });
  }

  async onModuleInit() {
    try {
      await this.pool.connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error);
    } 
  }

  getPool(): Pool {
    return this.pool;
  }
}
