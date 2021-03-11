import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Design from '../models/designModel.js'
import { isAdmin, isAuth } from '../utils.js'

const designRouter = express.Router()

designRouter.get('/', expressAsyncHandler(async(req, res) => {
    const designs = await Design.find({}).sort({ createdAt: -1 })
    res.send(designs)
}))

designRouter.post('/register', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const createdDesign = await Design.insertMany({
        titulo: req.body.titulo,
        subtitulo: req.body.subtitulo,
        imagen: req.body.imagen,
        ubicacion: req.body.ubicacion,
    })
    res.send({ createdDesign })
}))

designRouter.get('/:id', expressAsyncHandler(async(req, res) => {
    const design = await Design.findById(req.params.id)
    if (design) {
        res.send(design)
    } else {
        res.status(404).send({ message: 'Design Not found' })
    }
}))

designRouter.put('/:id', isAuth, isAdmin,
    expressAsyncHandler(async(req, res) => {
        const designId = req.params.id;
        const design = await Design.findById(designId);
        if (design) {
            design.titulo = req.body.titulo
            design.subtitulo = req.body.subtitulo
            design.imagen = req.body.imagen
            design.ubicacion = req.body.ubicacion
            const updatedDesign = await design.save();
            res.send({ message: 'Design Updated', design: updatedDesign });
        } else {
            res.status(404).send({ message: 'Design Not Found' });
        }
    })
);

designRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const design = await Design.findById(req.params.id);
    if (design) {
        const deleteDesign = await design.remove();
        res.send({ message: 'Design Deleted', design: deleteDesign });
    } else {
        res.status(404).send({ message: 'Design Not Found' });
    }
}));
export default designRouter