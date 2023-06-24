const { response } = require('express')
const bcrypt = require('bcryptjs');

const Usuario  = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const {email, password} = req.body

    try {

        //Verificar email
        const  usuarioDB = await Usuario.findOne({ email})

        if( !usuarioDB ) {
            return res.status(404).json({ 
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password)
        
        if( !validPassword ) {
            return res.status(404).json({
                ok: false,
                msg: 'Contrasea no válida'
            })
        }

        //Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            ok: false,
            msg: 'Hola con el administrador'
        })
    }

}


const googleSignIn = async( req, res = response ) => {
    
    try {
        const { email, name }  = await googleVerify( req.body.token );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar Usuario
        await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);

        res.json({ 
            ok: true,
            email, name,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({ 
            ok: false,
            msg: 'Token de Google no es correcto'
        })
    }    
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT( uid );

    // Obtener el usuario por UID
    const usuario = await Usuario.findById( uid )     
        .populate(
            {
                path: 'rol',
                select: 'nombre'
            }
        )
        .populate(
            {
                path: 'almacen',
                select: 'nombre'
            }
        );


    res.json({
        ok: true,
        token,
        usuario,
    });

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}