/* Ruta: /api/productos */

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getProductos, 
        crearProducto,
        actualizarProducto,
        borrarProducto
} = require('../controllers/productos');

const router = Router();

router.get( '/', getProductos );

router.post( '/',
    [
        check('nombre', 'El nombre del producto es necesario').not().isEmpty(),
        check('descripcion', 'La descripcion del producto es necesario').not().isEmpty(),
        check('precio', 'El precio del producto es necesario').not().isEmpty(),
        check('codigo', 'El código del producto es necesario').not().isEmpty(),
        validarCampos
    ],
    crearProducto
);

router.put( '/:id',
    [
        check('nombre', 'El nombre del producto es necesario').not().isEmpty(),
        check('precio', 'El precio del producto es necesario').not().isEmpty(),
        check('codigo', 'El código del producto es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarProducto
);

router.delete( '/:id',
    borrarProducto
);


module.exports = router;