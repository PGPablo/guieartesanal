import mongoose from 'mongoose'

const designSchema = new mongoose.Schema({
    titulo: { type: String, required: false, unique: false },
    subtitulo: { type: String, required: false, unique: false },
    imagen: { type: String, required: true, unique: false },
    ubicacion: { type: String, required: true },
}, {
    timestamps: true
})

const Design = mongoose.model('Design', designSchema)
export default Design