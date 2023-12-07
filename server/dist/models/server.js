"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("../routes/product"));
const connection_1 = __importDefault(require("../db/connection"));
const mssql_1 = __importStar(require("mssql"));
const cors_1 = __importDefault(require("cors"));
exports.pool = new mssql_1.ConnectionPool(connection_1.default);
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midleware();
        this.routes();
        this.dbConnect();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App corriendo en el puerto ${this.port}`);
        });
    }
    routes() {
        this.app.get('/', (req, res) => {
            res.json({
                msg: 'API working'
            });
        });
        this.app.use('/api/productos', product_1.default);
    }
    midleware() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    dbConnect() {
        // try {
        //     await db.authenticate()
        //     console.log("Base de datos conectada");
        // } catch (error) {
        //     console.log(error);
        // }
        exports.pool.connect()
            .then(pool => {
            const request = pool.request();
            console.log(`Connected to MSSQL in pruebas mode`);
            const createTableQuery = `
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Producto_tbl')
                BEGIN
                  CREATE TABLE Producto_tbl (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    nombre NVARCHAR(55) NOT NULL,
                    descripcion NVARCHAR(255),
                    precio INT NOT NULL,
                    stock INT NOT NULL
                  )
                END
              `;
            request.query(createTableQuery, (err, result) => {
                if (err) {
                    console.error("Error al crear la tabla:", err);
                }
                else {
                    console.log("Tabla creada exitosamente.");
                    pool.close();
                }
            });
            return pool;
        })
            .catch(err => console.log('Database Connection Failed! Bad Config: ', err));
        module.exports = {
            mssql: mssql_1.default, pool: exports.pool
        };
    }
}
exports.default = Server;
