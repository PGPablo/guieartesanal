import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import mercadopago from 'mercadopago'
import productRouter from './routers/productRouter.js'
import userRouter from './routers/userRouter.js'
import orderRouter from './routers/orderRouter.js'
import designRouter from './routers/designRouter.js'
import shippingRouter from './routers/shippingRouter.js'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})


mercadopago.configurations.setAccessToken(process.env.COLOR_MP_VARIENT || "test");

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/designs', designRouter)
app.use('/api/shipping', shippingRouter)

//Paypal
app.use('/api/config/paypal', (req, res) => {
    res.send(process.env.COLOR_PP_VARIENT || 'sb')
})

//Mercado Pago
app.post("/api/create_preference", (req, res) => {
    let preference = {
        items: [{
            title: req.body.description,
            unit_price: req.body.price,
            quantity: 1,
        }],
        back_urls: {
            "success": `${process.env.API_BASE_URL}/orders/mercadopago/${req.body.orderId}`,
            "failure": `${process.env.API_BASE_URL}/orders/mercadopago/${req.body.orderId}`,
            "pending": `${process.env.API_BASE_URL}/orders/mercadopago/${req.body.orderId}`,
        },
        auto_return: 'approved',
        statement_descriptor: "Guie tienda artesanal"
    };

    mercadopago.preferences.create(preference)
        .then(function(response) {
            res.json({ id: response.body.id })
        }).catch(function(error) {
            console.log(error);
        });
});

app.get('/', (req, res) => {
    res.send('Server is ready')
})

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
})


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Serve at port:${port}`)
})