/* Ruta: /api/marcas */

const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getMarcas, 
        crearMarca,
        actualizarMarca,
        borrarMarca
} = require('../controllers/marcas');

const router = Router();

router.get( '/', getMarcas );

router.post( '/',
    [
        check('nombre', 'El nombre de la marca es necesaria').not().isEmpty(),
        check('descripcion', 'La descripcion de la marca es necesaria').not().isEmpty(),
        validarCampos
    ],
    crearMarca
);

router.put( '/:id',
    [
        check('nombre', 'El nombre de la marca es necesaria').not().isEmpty(),
        validarCampos
    ],
    actualizarMarca
);

router.delete( '/:id',
    validarJWT,
    borrarMarca
);


module.exports = router;