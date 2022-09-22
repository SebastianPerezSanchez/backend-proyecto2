const { response } = require('express')

const Marca = require('../models/marca')

// Obteniendo Marcas
const getMarcas = async (req, res = response) => {

    const marcas = await Marca.find();

    res.json({
       ok: true,
       marcas
    })
}

// Creando Marca
const crearMarca = async (req, res = response) => {
   
   const marca = new Marca({
       ...req.body
   });
   
   try {

       const marcaDB = await marca.save();

       res.json({
           ok: true,
           marca: marcaDB
       });
       
   } catch (error) {
       res.status(500).json({
           ok: false,
           msg: 'Hable con el administrador'
       })
   }
}

// Actualizando Marca
const actualizarMarca = async (req, res = response) => {
   
   const id = req.params.id;
   const uid = req.uid

   try {

    const marca = await Marca.findById(id);

    // Si existe una marca por el id
    if (!marca) {
        return res.status(404).json({
            ok: true,
            msg: 'Marca no encontrada por id'
        })
    }
 
    // Extrayendo lo que viene en la req
    const cambiosMarca = {
        ...req.body
    }

    // Actualizando Marca
    const marcaActualizada = await Marca.findByIdAndUpdate(id, cambiosMarca, { new: true });


    res.json({
        ok: true,
        marca: marcaActualizada
    })

   } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
   }
}

// Borrando Marca
const borrarMarca = async(req, res = response) => {
    const id = req.params.id;
 
    try {
 
     const marca = await Marca.findById(id);
 
     // Si existe una Marca por el id
     if (!marca) {
         return res.status(404).json({
             ok: true,
             msg: 'Marca no encontrada por id'
         })
     }

     // Eliminando Marca
     await Marca.findByIdAndDelete( id );
  
     res.json({
         ok: true,
         msg: 'Marca Eliminada'
     });
 
    } catch (error) {
         res.status(500).json({
             ok: false,
             msg: 'Hable con el administrador'
         })
    }
}

module.exports = {
   getMarcas,
   crearMarca,
   actualizarMarca,
   borrarMarca
}