import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import { isAdmin, isAuth } from '../utils.js'

const productRouter = express.Router()

productRouter.get('/', expressAsyncHandler(async(req, res) => {
    const products = await Product.find({}).sort({ stack: -1, createdAt: -1 })
    res.send(products)
}))

productRouter.post('/register', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const createdProduct = await Product.insertMany({
        nombre: req.body.nombre,
        imagenPortada: req.body.imagenPortada,
        imagen1: req.body.imagen1,
        imagen2: req.body.imagen2,
        precio: req.body.precio,
        precioDescuento: req.body.precioDescuento,
        stack: req.body.stack,
        rating: req.body.rating,
        talla: req.body.talla,
        descripcion: req.body.descripcion,
        color1: req.body.color1,
        color2: req.body.color2,
        categoriaCatalogoPrincipal: req.body.categoriaCatalogoPrincipal,
        categoriaCatalogoSecundaria: req.body.categoriaCatalogoSecundaria,
        categoriaTemporada: req.body.categoriaTemporada
    })
    res.send({ createdProduct })
}))

productRouter.get('/:id', expressAsyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.status(404).send({ message: 'Product Not found' })
    }
}))

productRouter.put('/:id', isAuth, isAdmin,
    expressAsyncHandler(async(req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            product.nombre = req.body.nombre
            product.imagenPortada = req.body.imagenPortada
            product.imagen1 = req.body.imagen1
            product.imagen2 = req.body.imagen2
            product.precio = req.body.precio
            product.precioDescuento = req.body.precioDescuento
            product.stack = req.body.stack
            product.rating = req.body.rating
            product.talla = req.body.talla
            product.descripcion = req.body.descripcion
            product.color1 = req.body.color1
            product.color2 = req.body.color2
            product.categoriaCatalogoPrincipal = req.body.categoriaCatalogoPrincipal
            product.categoriaCatalogoSecundaria = req.body.categoriaCatalogoSecundaria
            product.categoriaTemporada = req.body.categoriaTemporada
            const updatedProduct = await product.save();
            res.send({ message: 'Product Updated', product: updatedProduct });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.put('/substract/:id', isAuth, isAdmin,
    expressAsyncHandler(async(req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product && product.stack >= req.body.stack) {
            product.stack = product.stack - req.body.stack
            const updatedProduct = await product.save();
            res.send({ message: 'Product Updated', product: updatedProduct });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        const deleteProduct = await product.remove();
        res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}));
export default productRouter