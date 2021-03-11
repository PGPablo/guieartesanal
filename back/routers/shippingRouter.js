import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Shipping from '../models/shippingModel.js'
import { isAdmin, isAuth } from '../utils.js'

const shippingRouter = express.Router()

shippingRouter.get('/', expressAsyncHandler(async(req, res) => {
    const shipping = await Shipping.find({}).sort({ createdAt: -1 })
    res.send(shipping)
}))

shippingRouter.post('/register', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const createdShipping = await Shipping.insertMany({
        estado: req.body.estado,
        costo: req.body.costo,
        diasMinimos: req.body.diasMinimos,
        diasMaximos: req.body.diasMaximos,
    })
    res.send({ createdShipping })
}))

shippingRouter.get('/:id', expressAsyncHandler(async(req, res) => {
    const sipping = await Shipping.findById(req.params.id)
    if (sipping) {
        res.send(sipping)
    } else {
        res.status(404).send({ message: 'Sipping Not found' })
    }
}))

shippingRouter.put('/:id', isAuth, isAdmin,
    expressAsyncHandler(async(req, res) => {
        const sippingId = req.params.id;
        const sipping = await Shipping.findById(sippingId);
        if (sipping) {
            sipping.estado = req.body.estado
            sipping.costo = req.body.costo
            sipping.diasMinimos = req.body.diasMinimos
            sipping.diasMaximos = req.body.diasMaximos
            const updateSipping = await sipping.save();
            res.send({ message: 'Shipping Updated', shipping: updateSipping });
        } else {
            res.status(404).send({ message: 'Shipping Not Found' });
        }
    })
);

shippingRouter.delete('/:id', isAuth, isAdmin,
    expressAsyncHandler(async(req, res) => {
        const shipping = await Shipping.findById(req.params.id);
        if (shipping) {
            const deleteShipping = await shipping.remove();
            res.send({ message: 'Shipping Deleted', shipping: deleteShipping });
        } else {
            res.status(404).send({ message: 'Shipping Not Found' });
        }
    })
);

export default shippingRouter