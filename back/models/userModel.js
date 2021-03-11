import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    telefono: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
    calleDeEntrega: { type: String, required: false },
    coloniaDeEntrega: { type: String, required: false },
    codigoPostal: { type: String, required: false },
    ciudad: { type: String, required: false },
    estado: { type: String, required: false },
    pais: { type: String, required: false },
    genetica: { type: Boolean, required: true }

}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)
export default User