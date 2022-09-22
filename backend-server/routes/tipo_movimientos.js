/* Ruta: /api/tipo_movimientos */

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getTipoMovimientos, 
        crearTipoMovimiento,
        actualizarTipoMovimiento,
        borrarTipoMovimiento
} = require('../controllers/tipo_movimientos');

const router = Router();

router.get( '/', getTipoMovimientos );

router.post( '/',
    [
        check('nombre', 'El nombre del tipo de movimiento es necesario').not().isEmpty(),
        check('descripcion', 'La descripcion del tipo de movimiento no es necesario').not().isEmpty(),
        validarCampos
    ],
    crearTipoMovimiento
);

router.put( '/:id',
    [
        validarJWT,
        check('nombre', 'El nombre del tipo de movimiento es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarTipoMovimiento
);

router.delete( '/:id',
    validarJWT,
    borrarTipoMovimiento
);


module.exports = router;