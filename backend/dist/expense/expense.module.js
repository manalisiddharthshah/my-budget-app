"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseModule = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const expense_controller_1 = require("./expense.controller");
const expense_service_1 = require("./expense.service");
let ExpenseModule = class ExpenseModule {
};
exports.ExpenseModule = ExpenseModule;
exports.ExpenseModule = ExpenseModule = __decorate([
    (0, common_1.Module)({
        controllers: [expense_controller_1.ExpenseController],
        providers: [
            expense_service_1.ExpenseService,
            {
                provide: pg_1.Pool,
                useValue: new pg_1.Pool({
                    user: 'postgres',
                    host: 'localhost',
                    database: 'tech_assessment',
                    password: 'ctpl@dev',
                    port: 5432,
                }),
            },
        ],
    })
], ExpenseModule);
//# sourceMappingURL=expense.module.js.map