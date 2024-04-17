import { Pool } from 'pg';
export declare class AppModule {
    private readonly pool;
    constructor();
    onModuleInit(): any;
    getPool(): Pool;
}
