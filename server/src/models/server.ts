import express, { Application, Request, Response } from "express";
import routeProduct from "../routes/product";
import config from "../db/connection";
import mssql, { ConnectionPool } from "mssql";
import cors from "cors";

export const pool = new ConnectionPool(config)

class Server {
    private app: express.Application
    private port: string

    constructor() {
        this.app = express()
        this.port = process.env.PORT || '3001'
        this.listen()
        this.midleware()
        this.routes()
        this.dbConnect()
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`App corriendo en el puerto ${this.port}`);
        })
    }

    routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({
                msg: 'API working'
            })
        })
        this.app.use('/api/productos', routeProduct)
    }

    midleware() {
        this.app.use(express.json())

        this.app.use(cors())
    }

    dbConnect() {

        pool.connect()
            .then(pool => {
                const request = pool.request()
                console.log(`Connected to MSSQL in pruebas mode`)
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
                    } else {
                        console.log("Tabla creada exitosamente.");
                        pool.close();
                    } 
                });
                return pool

            })
            .catch(err => console.log('Database Connection Failed! Bad Config: ', err))
        module.exports = {
            mssql, pool
        }
        
    }
}
export default Server