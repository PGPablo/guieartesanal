import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import { generateToken, isAdmin, isAuth } from '../utils.js'

const userRouter = express.Router()

userRouter.get('/seed',
    expressAsyncHandler(async(req, res) => {
        const createdUsers = await User.insertMany()
        res.send({ createdUsers })
    }))

userRouter.get('/panel', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const users = await User.find({})
    res.send(users)
}))

userRouter.post(
    '/signin',
    expressAsyncHandler(async(req, res) => {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            if (bcrypt.compareSync(req.body.contrasena, user.contrasena)) {
                res.send({
                    _id: user._id,
                    nombre: user.nombre,
                    telefono: user.telefono,
                    email: user.email,
                    calleDeEntrega: user.calleDeEntrega,
                    coloniaDeEntrega: user.coloniaDeEntrega,
                    codigoPostal: user.codigoPostal,
                    ciudad: user.ciudad,
                    estado: user.estado,
                    pais: user.pais,
                    genetica: user.genetica,
                    token: generateToken(user)
                })
                return
            }
        }
        res.status(401).send({ message: 'Invalid user email or password' })
    })
)

userRouter.post(
    '/register',
    expressAsyncHandler(async(req, res) => {
        const user = new User({
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            email: req.body.email,
            contrasena: bcrypt.hashSync(req.body.contrasena, 8),
            genetica: false,
            calleDeEntrega: '',
            coloniaDeEntrega: '',
            codigoPostal: '',
            ciudad: '',
            estado: '',
            pais: '',
        })
        const createdUser = await user.save()
        res.send({
            _id: createdUser._id,
            nombre: createdUser.nombre,
            email: createdUser.email,
            telefono: createdUser.telefono,
            calleDeEntrega: '',
            coloniaDeEntrega: '',
            codigoPostal: '',
            ciudad: '',
            estado: '',
            pais: '',
            genetica: createdUser.genetica,
            token: generateToken(createdUser),
        })
    })
)

userRouter.put(
    '/profile',
    expressAsyncHandler(async(req, res) => {
        const user = await User.findById(req.body._id);
        if (user) {
            user.calleDeEntrega = req.body.calleDeEntrega || user.calleDeEntrega
            user.coloniaDeEntrega = req.body.coloniaDeEntrega || user.coloniaDeEntrega
            user.codigoPostal = req.body.codigoPostal || user.codigoPostal
            user.ciudad = req.body.ciudad || user.ciudad
            user.estado = req.body.estado || user.estado
            user.pais = req.body.pais || user.pais

            const updatedUser = await user.save();
            res.send({
                _id: user._id,
                nombre: user.nombre,
                telefono: user.telefono,
                email: user.email,
                calleDeEntrega: user.calleDeEntrega,
                coloniaDeEntrega: user.coloniaDeEntrega,
                codigoPostal: user.codigoPostal,
                ciudad: user.ciudad,
                estado: user.estado,
                pais: user.pais,
                genetica: user.genetica,
                token: generateToken(updatedUser),
            });
        }
    })
);

userRouter.delete('/:id/delete', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        const deleteUser = await user.remove();
        res.send({ message: 'User Deleted', user: deleteUser });
    } else {
        res.status(404).send({ message: 'User not found' })
    }
}))

export default userRouter