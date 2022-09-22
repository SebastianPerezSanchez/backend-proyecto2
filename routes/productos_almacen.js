/* Ruta: /api/productos_almacen */

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getProductosAlmacen, 
        crearProductoAlmacen,
        actualizarProductoAlmacen,
        borrarProductoAlmacen
} = require('../controllers/productos_almacen');

const router = Router();

router.get( '/', getProductosAlmacen );

router.post( '/',
    [
        check('producto', 'El nombre del producto es necesario').not().isEmpty(),
        check('stock', 'El stock es necesario').not().isEmpty(),
        validarCampos
    ],
    crearProductoAlmacen
);

router.put( '/:id',
    [
        check('producto', 'El nombre del producto es necesario').not().isEmpty(),
        check('stock', 'El stock es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarProductoAlmacen
);

router.delete( '/:id',
    borrarProductoAlmacen
);


module.exports = router;