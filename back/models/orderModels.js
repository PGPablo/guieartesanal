import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    orderItems: [{
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        talla: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        }
    }],
    userInfo: {
        nombre: { type: String, required: true },
        email: { type: String, required: true },
        telefono: { type: String, required: true },
        calleDeEntrega: { type: String, required: false },
        coloniaDeEntrega: { type: String, required: false },
        codigoPostal: { type: String, required: false },
        ciudad: { type: String, required: false },
        estado: { type: String, required: false },
        pais: { type: String, required: false },
    },
    paymenthMethod: { type: String, required: true },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String,
    },
    totalPay: { type: Number, required: true },
    shippingPay: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    wasSeen: { type: Boolean, default: false },
    seenMessage: { type: String, required: false },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    isPending: { type: Boolean, default: false }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)
export default Order