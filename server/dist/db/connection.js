"use strict";
// import { Sequelize } from "sequelize";
Object.defineProperty(exports, "__esModule", { value: true });
// const sequelize = new Sequelize('productos_db', 'PYC-IT11506', '',{
//     host: 'localhost',
//     dialect:'mssql',
//     // dialectOptions: {
//     //     options: {
//     //       encrypt: true, // Usa esta opción si tu servidor SQL Server requiere una conexión segura
//     //     },
//     //   },
//   });
//   export default sequelize
const config = {
    user: 'sa',
    password: '123',
    server: 'PYC-IT11506',
    database: 'productos_db',
    port: 1433,
    parseJSON: true,
    requestTimeout: 100000000,
    options: {
        "encrypt": true,
        "enableArithAbort": true,
        "trustServerCertificate": true,
    },
    pool: {
        max: 500,
        min: 0,
    }
};
exports.default = config;
