import mongoose from 'mongoose'

const shippingSchema = new mongoose.Schema({
    estado: { type: String, required: true },
    costo: { type: Number, required: false },
    diasMinimos: { type: Number, required: true },
    diasMaximos: { type: Number, required: true },
}, {
    timestamps: true
})

const Shipping = mongoose.model('Shipping', shippingSchema)
export default Shipping