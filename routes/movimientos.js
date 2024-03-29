/* Ruta: /api/movimientos */

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getMovimientos, 
        crearMovimiento,
        getAllMovimientosEntrada,
        getAllMovimientosSalida
} = require('../controllers/movimientos');

const router = Router();

router.get( '/', getMovimientos );

router.get('/entrada', getAllMovimientosEntrada)

router.get('/salida', getAllMovimientosSalida)

router.post( '/',
    [
        check('codigo_recibido', 'El código del producto es necesario').not().isEmpty(),
        check('cantidad', 'La cantidad del producto es necesaria').not().isEmpty(),
        validarCampos
    ],
    crearMovimiento
);


module.exports = router;