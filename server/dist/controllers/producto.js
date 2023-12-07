"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.postProduct = exports.deleteProduct = exports.getProduct = exports.getProducts = void 0;
const server_1 = require("../models/server");
const mssql_1 = require("mssql");
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pool.connect().then(() => {
    //     const request = pool.request();
    //     const selectProductsQuery = `
    //       SELECT *
    //       FROM Producto_tbl
    //     `;
    //     request.query(selectProductsQuery, (err, result) => {
    //       if (err) {
    //         console.error("Error al obtener la lista de productos:", err);
    //         res.status(500).json({ error: "Error al obtener la lista de productos" });
    //       } else {
    //         const productList = result.recordset;
    //         res.json(productList);
    //       }
    //       pool.close();
    //     });
    //   }).catch((err) => {
    //     console.error("Error al conectar con la base de datos:", err);
    //     res.status(500).json({ error: "Error al conectar con la base de datos" });
    //   });
    try {
        yield server_1.pool.connect();
        const request = server_1.pool.request();
        const selectProductsQuery = `
          SELECT *
          FROM Producto_tbl
        `;
        const result = yield request.query(selectProductsQuery);
        const productList = result.recordset;
        res.json(productList);
        console.log(productList);
    }
    catch (err) {
        console.error("Error al obtener la lista de productos:", err);
        res.status(500).json({ error: "Error al obtener la lista de productos" });
    }
    finally {
        server_1.pool.close();
    }
});
exports.getProducts = getProducts;
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server_1.pool.connect();
        const request = server_1.pool.request();
        const selectProductQuery = `
          SELECT *
          FROM Producto_tbl
          WHERE id = @productId
        `;
        // Asegúrate de definir el tipo de dato para el parámetro
        request.input('productId', mssql_1.Int, productId);
        const result = yield request.query(selectProductQuery);
        const product = result.recordset[0];
        return product;
    }
    catch (error) {
        console.error("Error al obtener el producto por ID:", error);
        throw error;
    }
    finally {
        server_1.pool.close();
    }
});
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield getProductById(id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    }
    catch (error) {
        console.error("Error al obtener el producto por ID:", error);
        res.status(500).json({ error: "Error al obtener el producto por ID" });
    }
});
exports.getProduct = getProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield server_1.pool.connect();
        const request = server_1.pool.request();
        const deleteProductQuery = `
      DELETE FROM Producto_tbl
      WHERE id = @productId
    `;
        // Asegúrate de definir el tipo de dato para el parámetro
        request.input('productId', mssql_1.Int, id);
        const result = yield request.query(deleteProductQuery);
        if (result.rowsAffected[0] > 0) {
            res.json({ msg: 'Producto eliminado exitosamente' });
        }
        else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    }
    catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
    finally {
        server_1.pool.close();
    }
});
exports.deleteProduct = deleteProduct;
const postProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        yield server_1.pool.connect();
        const request = server_1.pool.request();
        const insertProductQuery = `
      INSERT INTO Producto_tbl (nombre, descripcion, precio, stock)
      VALUES (@nombre, @descripcion, @precio, @stock)
    `;
        // Asegúrate de definir los tipos de datos para los parámetros
        request.input('nombre', (0, mssql_1.NVarChar)(55), body.nombre);
        request.input('descripcion', (0, mssql_1.NVarChar)(255), body.descripcion);
        request.input('precio', mssql_1.Int, body.precio);
        request.input('stock', mssql_1.Int, body.stock);
        const result = yield request.query(insertProductQuery);
        if (result.rowsAffected[0] > 0) {
            res.json({ msg: 'Producto creado exitosamente' });
        }
        else {
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    }
    catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ error: "Error al crear el producto" });
    }
    finally {
        server_1.pool.close();
    }
});
exports.postProduct = postProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    try {
        yield server_1.pool.connect();
        const request = server_1.pool.request();
        const updateProductQuery = `
      UPDATE Producto_tbl
      SET nombre = @nombre, descripcion = @descripcion, precio = @precio, stock = @stock
      WHERE id = @productId
    `;
        // Asegúrate de definir los tipos de datos para los parámetros
        request.input('nombre', (0, mssql_1.NVarChar)(55), body.nombre);
        request.input('descripcion', (0, mssql_1.NVarChar)(255), body.descripcion);
        request.input('precio', mssql_1.Int, body.precio);
        request.input('stock', mssql_1.Int, body.stock);
        request.input('productId', mssql_1.Int, id);
        const result = yield request.query(updateProductQuery);
        if (result.rowsAffected[0] > 0) {
            res.json({ msg: 'Producto actualizado exitosamente' });
        }
        else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    }
    catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
    finally {
        server_1.pool.close();
    }
});
exports.updateProduct = updateProduct;
