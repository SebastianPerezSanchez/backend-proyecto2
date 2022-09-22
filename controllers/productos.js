const { response } = require('express')

const Producto = require('../models/producto')

// Obteniendo productos
const getProductos = async (req, res = response) => {

    // Populando el campo marca y almacen en la colección de Productos
    const productos = await 
        Producto.find({})
        .populate(
            {
            path: 'marca',
            select: 'nombre'
            }
        )


    res.json({
       ok: true,
       productos
    })
}

//Creando productos
const crearProducto = async (req, res = response) => {
   
   const producto = new Producto({
       ...req.body
   });
   
   try {

       const productoDB = await producto.save();

       res.json({
           ok: true,
           producto: productoDB
       });
       
   } catch (error) {
       res.status(500).json({
           ok: false,
           msg: 'Hable con el administrador'
       })
   }
}

//Actualizando Producto
const actualizarProducto = async (req, res = response) => {
   
   const id = req.params.id;

   try {

    const producto = await Producto.findById(id);

    // Si existe un producto por el id
    if (!producto) {
        return res.status(404).json({
            ok: true,
            msg: 'Producto no encontrado por id'
        })
    }
 
    // Extrayendo lo que viene en la req
    const cambiosProducto = {
        ...req.body
    }

    // Actualizando Producto
    const productoActualizado = await Producto.findByIdAndUpdate(id, cambiosProducto, { new: true });


    res.json({
        ok: true,
        producto: productoActualizado
    })

   } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
   }
}

// Borrando Producto
const borrarProducto = async(req, res = response) => {
    const id = req.params.id;
 
    try {
 
     const producto = await Producto.findById(id);
 
     // Si existe un Producto por el id
     if (!producto) {
         return res.status(404).json({
             ok: true,
             msg: 'Producto no encontrado por id'
         })
     }

     // Eliminando Producto
     await Producto.findByIdAndDelete( id );

     res.json({
         ok: true,
         msg: 'Producto Eliminado'
     });
 
    } catch (error) {
         res.status(500).json({
             ok: false,
             msg: 'Hable con el administrador'
         })
    }
}

module.exports = {
   getProductos,
   crearProducto,
   actualizarProducto,
   borrarProducto
}