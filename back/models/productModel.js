import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: false },
    imagenPortada: { type: String, required: true },
    imagen1: { type: String, required: false },
    imagen2: { type: String, required: false },
    precio: { type: Number, required: true },
    precioDescuento: { type: Number, required: false },
    stack: { type: Number, required: true },
    rating: { type: Number, required: true },
    talla: { type: Array, required: true },
    color1: { type: String, required: true },
    color2: { type: String, required: true },
    descripcion: { type: String, required: false },
    categoriaCatalogoPrincipal: { type: String, required: false },
    categoriaCatalogoSecundaria: { type: String, required: false },
    categoriaTemporada: { type: String, required: false },
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)
export default Product