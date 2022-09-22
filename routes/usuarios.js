/* Ruta: /api/usuarios */

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');


const { getUsuarios, getUsuarios2, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.get( '/', getUsuarios );
router.get( '/:id', getUsuarios2 );

router.post( '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La constraseña es obligatoria').not().isEmpty(),
        check('email', 'El correo es obligatorio').isEmail(),
        validarCampos
    ],
    crearUsuario 
);

router.put( '/:id',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El correo es obligatorio').isEmail(),
        check('rol', 'El rol es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    actualizarUsuario 
);

router.delete( '/:id',
    borrarUsuario
);


module.exports = router;