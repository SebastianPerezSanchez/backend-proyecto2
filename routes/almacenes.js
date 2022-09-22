/* Ruta: /api/almacenes */

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getAlmacenes, 
        crearAlmacen,
        actualizarAlmacen,
        borrarAlmacen
} = require('../controllers/almacenes');

const router = Router();

router.get( '/', getAlmacenes );

router.post( '/',
    [
        check('nombre', 'El nombre del Almacen es necesario').not().isEmpty(),
        validarCampos
    ],
    crearAlmacen
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre', 'El nombre del Almacen es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarAlmacen
);

router.delete( '/:id',
    validarJWT,
    borrarAlmacen
);


module.exports = router;