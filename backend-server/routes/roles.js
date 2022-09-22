/* Ruta: /api/roles */

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getRoles, 
        crearRol,
        actualizarRol,
        borrarRol
} = require('../controllers/roles');

const router = Router();

router.get( '/', getRoles );

router.post( '/',
    [
        check('nombre', 'El nombre del rol es necesario').not().isEmpty(),
        check('descripcion', 'La descripcion del rol es necesario').not().isEmpty(),
        validarCampos
    ],
    crearRol
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre', 'El nombre del rol es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarRol
);

router.delete( '/:id',
    validarJWT,
    borrarRol
);


module.exports = router;