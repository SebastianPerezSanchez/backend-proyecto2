const { response } = require('express')

const TipoMovimiento = require('../models/tipo_movimiento')

// Obteniendo tipo de movimientos
const getTipoMovimientos = async (req, res = response) => {

    const tipo_movimientos = await TipoMovimiento.find();

    res.json({
       ok: true,
       tipo_movimientos
    })
}

//Creando tipo de movimientos
const crearTipoMovimiento = async (req, res = response) => {
   
   const tipo_movimiento = new TipoMovimiento({
       ...req.body
   });
   
   try {

       const tipo_movimientoDB = await tipo_movimiento.save();

       res.json({
           ok: true,
           tipo_movimiento: tipo_movimientoDB
       });
       
   } catch (error) {
       res.status(500).json({
           ok: false,
           msg: 'Hable con el administrador'
       })
   }
}

//Actualizando tipo de movimiento
const actualizarTipoMovimiento = async (req, res = response) => {
   
   const id = req.params.id;

   try {

    const tipo_movimiento = await TipoMovimiento.findById(id);

    // Si existe un tipo de movimiento por el id
    if (!tipo_movimiento) {
        return res.status(404).json({
            ok: true,
            msg: 'Tipo de movimiento no encontrado por id'
        })
    }
 
    // Extrayendo lo que viene en la req
    const cambiosTipoMovimiento = {
        ...req.body
    }

    // Actualizando tipo de movimiento
    const tipoMovimientoActualizado = await TipoMovimiento.findByIdAndUpdate(id, cambiosTipoMovimiento, { new: true });


    res.json({
        ok: true,
        tipo_movimiento: tipoMovimientoActualizado
    })

   } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
   }
}

// Borrando tipo de movimiento
const borrarTipoMovimiento = async(req, res = response) => {
    const id = req.params.id;
 
    try {
 
     const tipo_movimiento = await TipoMovimiento.findById(id);
 
     // Si existe un tipo de movimiento por el id
     if (!tipo_movimiento) {
         return res.status(404).json({
             ok: true,
             msg: 'Tipo de movimiento no encontrado por id'
         })
     }

     // Eliminando tipo de movimiento
     await TipoMovimiento.findByIdAndDelete( id );

     res.json({
         ok: true,
         msg: 'Tipo de Movimiento Eliminado'
     });
 
    } catch (error) {
         res.status(500).json({
             ok: false,
             msg: 'Hable con el administrador'
         })
    }
}

module.exports = {
   getTipoMovimientos,
   crearTipoMovimiento,
   actualizarTipoMovimiento,
   borrarTipoMovimiento
}