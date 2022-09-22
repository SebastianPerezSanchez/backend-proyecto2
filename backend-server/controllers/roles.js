const { response } = require('express')

const Rol = require('../models/rol')

// Obteniendo los roles
const getRoles = async (req, res = response) => {

    const roles = await Rol.find();

    res.json({
       ok: true,
       roles
    })
}

//Creando rol
const crearRol = async (req, res = response) => {
   
   const rol = new Rol({
       ...req.body
   });
   
   try {

       const rolDB = await rol.save();

       res.json({
           ok: true,
           rol: rolDB
       });
       
   } catch (error) {
       res.status(500).json({
           ok: false,
           msg: 'Hable con el administrador'
       })
   }
}

//Actualizando Rol

const actualizarRol = async (req, res = response) => {
   
   const id = req.params.id;

   try {

    const rol = await Rol.findById(id);

    // Si existe un rol por el id
    if (!rol) {
        return res.status(404).json({
            ok: true,
            msg: 'Rol no encontrado por id'
        })
    }
 
    // Extrayendo lo que viene en la req
    const cambiosRol = {
        ...req.body
    }

    // Actualizando Rol
    const rolActualizado = await Rol.findByIdAndUpdate(id, cambiosRol, { new: true });


    res.json({
        ok: true,
        rol: rolActualizado
    })

   } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
   }
}

// Borrando Rol
const borrarRol = async(req, res = response) => {
    const id = req.params.id;
 
    try {
 
     const rol = await Rol.findById(id);
 
     // Si existe un Rol por el id
     if (!rol) {
         return res.status(404).json({
             ok: true,
             msg: 'Rol no encontrado por id'
         })
     }

     // Eliminando Rol
     await Rol.findByIdAndDelete( id );

     res.json({
         ok: true,
         msg: 'Rol Eliminado'
     });
 
    } catch (error) {
         res.status(500).json({
             ok: false,
             msg: 'Hable con el administrador'
         })
    }
}

module.exports = {
   getRoles,
   crearRol,
   actualizarRol,
   borrarRol
}