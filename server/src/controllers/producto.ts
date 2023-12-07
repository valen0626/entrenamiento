import { Request, Response } from "express";
import { pool } from "../models/server";
import { Int, NVarChar } from "mssql";

export const getProducts = async (req: Request, res: Response) => {
    try {
        await pool.connect();
        const request = pool.request();

        const selectProductsQuery = `
          SELECT *
          FROM Producto_tbl
        `;

        const result = await request.query(selectProductsQuery);
        const productList = result.recordset;
        res.json(productList);
        console.log(productList);
    } catch (err) {
        console.error("Error al obtener la lista de productos:", err);
        res.status(500).json({ error: "Error al obtener la lista de productos" });
    } finally {
        pool.close();
    }
}

const getProductById = async (productId: string) => {
    try {
        await pool.connect();
        const request = pool.request();

        const selectProductQuery = `
          SELECT *
          FROM Producto_tbl
          WHERE id = @productId
        `;

        // Asegúrate de definir el tipo de dato para el parámetro
        request.input('productId', Int, productId);

        const result = await request.query(selectProductQuery);
        const product = result.recordset[0];

        return product;
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error);
        throw error;
    } finally {
        pool.close();
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await getProductById(id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error);
        res.status(500).json({ error: "Error al obtener el producto por ID" });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await pool.connect();
        const request = pool.request();

        const deleteProductQuery = `
      DELETE FROM Producto_tbl
      WHERE id = @productId
    `;

        // Asegúrate de definir el tipo de dato para el parámetro
        request.input('productId', Int, id);

        const result = await request.query(deleteProductQuery);

        if (result.rowsAffected[0] > 0) {
            res.json({ msg: 'Producto eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    } finally {
        pool.close();
    }
}

export const postProduct = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await pool.connect();
        const request = pool.request();

        const insertProductQuery = `
      INSERT INTO Producto_tbl (nombre, descripcion, precio, stock)
      VALUES (@nombre, @descripcion, @precio, @stock)
    `;

        // Asegúrate de definir los tipos de datos para los parámetros
        request.input('nombre', NVarChar(55), body.nombre);
        request.input('descripcion', NVarChar(255), body.descripcion);
        request.input('precio', Int, body.precio);
        request.input('stock', Int, body.stock);

        const result = await request.query(insertProductQuery);

        if (result.rowsAffected[0] > 0) {
            res.json({ msg: 'Producto creado exitosamente' });
        } else {
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ error: "Error al crear el producto" });
    } finally {
        pool.close();
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {
        await pool.connect();
        const request = pool.request();

        const updateProductQuery = `
      UPDATE Producto_tbl
      SET nombre = @nombre, descripcion = @descripcion, precio = @precio, stock = @stock
      WHERE id = @productId
    `;

        // Asegúrate de definir los tipos de datos para los parámetros
        request.input('nombre', NVarChar(55), body.nombre);
        request.input('descripcion', NVarChar(255), body.descripcion);
        request.input('precio', Int, body.precio);
        request.input('stock', Int, body.stock);
        request.input('productId', Int, id);

        const result = await request.query(updateProductQuery);

        if (result.rowsAffected[0] > 0) {
            res.json({ msg: 'Producto actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    } finally {
        pool.close();
    }
}