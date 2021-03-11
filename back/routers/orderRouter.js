import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Order from '../models/orderModels.js'
import { isAdmin, isAuth } from '../utils.js'

const orderRouter = express.Router()

orderRouter.get('/mine', isAuth, expressAsyncHandler(async(req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.send(orders)
}))

orderRouter.get('/panel', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 })
    res.send(orders)
}))

orderRouter.get('/mercadopago/:id', expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)
    if (order && req.query && req.query.status === "approved") {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        }
        const updateOrder = await order.save()
        res.redirect(`http://guietiendaartesanal.com/order/${req.params.id}`);

    } else if (order && req.query && req.query.status === "pending") {
        order.isPending = true
        order.paymentResult = {
            id: req.query.payment_id,
            Status: req.query.status,
        }
        const updateOrder = await order.save()
        res.redirect(`http://guietiendaartesanal.com/order/${req.params.id}`);

    } else if (order) {
        res.redirect(`http://guietiendaartesanal.com/order/${req.params.id}`);
    } else {
        res.status(404).send({ message: 'Orden no encontrata, ocurrio un error.' })
    }

    // res.json({
    //     Payment: req.query.payment_id,
    //     Status: req.query.status,
    //     MerchantOrder: req.query.merchant_order_id
    // })
}))

orderRouter.post('/',
    isAuth,
    expressAsyncHandler(async(req, res) => {
        if (req.body.cart.length === 0) {
            res.status(400).send({ message: 'Cart is empty' })
        } else {
            const order = new Order({
                orderItems: req.body.cart,
                userInfo: req.body.userInfo,
                paymenthMethod: req.body.payMethod,
                totalPay: req.body.totalPay,
                shippingPay: req.body.shippingPay,
                user: req.user._id
            })

            const createdOrder = await order.save()

            res.status(201).send({ message: 'New Order Created', order: createdOrder })
        }
    })
)

orderRouter.get('/:id',
    isAuth,
    expressAsyncHandler(async(req, res) => {
        const order = await (Order.findById(req.params.id))
        if (order) {
            res.send(order)
        } else {
            res.status(404).send({
                message: 'Order Not Found'
            })
        }
    })
)

orderRouter.put('/:id/seen', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.wasSeen = true
        order.seenMessage = req.body.seenMessage
        const updateOrder = await order.save()
        res.send({ message: 'Order seen', order: updateOrder })
    } else {
        res.status(404).send({ message: 'Order not found' })
    }
}))

orderRouter.put('/:id/shipping', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()
        const updateOrder = await order.save()
        res.send({ message: 'Order shipping', order: updateOrder })
    } else {
        res.status(404).send({ message: 'Order not found' })
    }
}))


orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        }
        const updateOrder = await order.save()
        res.send(updateOrder)
    } else {
        res.status(404).send({ message: 'Order not found' })
    }
}))

orderRouter.delete('/:id/delete', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        const deleteOrder = await order.remove();
        res.send({ message: 'Order Deleted', product: deleteOrder });
    } else {
        res.status(404).send({ message: 'Order not found' })
    }
}))

export default orderRouter