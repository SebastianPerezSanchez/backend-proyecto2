const { response } = require('express')

const Almacen = require('../models/almacen')

// Obteniendo almacenes
const getAlmacenes = async (req, res = response) => {

    const almacenes = await Almacen.find();

    res.json({
       ok: true,
       almacenes
    })
}

//Creando almacen
const crearAlmacen = async (req, res = response) => {
   
   const almacen = new Almacen({
       ...req.body
   });
   
   try {

       const almacenDB = await almacen.save();

       res.json({
           ok: true,
           almacen: almacenDB
       });
       
   } catch (error) {
       res.status(500).json({
           ok: false,
           msg: 'Hable con el administrador'
       })
   }
}

//Actualizando Almacen
const actualizarAlmacen = async (req, res = response) => {
   
   const id = req.params.id;

   try {

    const almacen = await Almacen.findById(id);

    // Si existe un almacen por el id
    if (!almacen) {
        return res.status(404).json({
            ok: true,
            msg: 'Almacen no encontrado por id'
        })
    }
 
    // Extrayendo lo que viene en la req
    const cambiosAlmacen = {
        ...req.body
    }

    // Actualizando Almacen
    const almacenActualizado = await Almacen.findByIdAndUpdate(id, cambiosAlmacen, { new: true });


    res.json({
        ok: true,
        almacen: almacenActualizado
    })

   } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
   }
}

// Borrando Almacen
const borrarAlmacen = async(req, res = response) => {
    const id = req.params.id;
 
    try {
 
     const almacen = await Almacen.findById(id);
 
     // Si existe un Almacen por el id
     if (!almacen) {
         return res.status(404).json({
             ok: true,
             msg: 'Almacen no encontrado por id'
         })
     }

     // Eliminando Almacen
     await Almacen.findByIdAndDelete( id );

     res.json({
         ok: true,
         msg: 'Almacen Eliminado'
     });
 
    } catch (error) {
         res.status(500).json({
             ok: false,
             msg: 'Hable con el administrador'
         })
    }
}

module.exports = {
   getAlmacenes,
   crearAlmacen,
   actualizarAlmacen,
   borrarAlmacen
}