/* Ruta: /api/productos_almacen */

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getProductosAlmacen, 
        crearProductoAlmacen,
        actualizarProductoAlmacen,
        actualizarProductoAlmacenNombre,
        borrarProductoAlmacen
} = require('../controllers/productos_almacen');

const router = Router();

router.get( '/', getProductosAlmacen );

router.post( '/',
    [
        check('stock', 'El stock es necesario').not().isEmpty(),
        validarCampos
    ],
    crearProductoAlmacen
);

router.put( '/:id',
    [
        check('stock', 'El stock es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarProductoAlmacen
);

router.put( '/editar/:nombre',
    [
        check('stock', 'El stock es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarProductoAlmacenNombre
);

router.delete( '/:id',
    borrarProductoAlmacen
);


module.exports = router;