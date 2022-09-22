const { response } = require('express')

const ProductoAlmacen = require('../models/producto_almacen')

// Obteniendo productos
const getProductosAlmacen = async (req, res = response) => {

    // Populando el campo producto y almacen en la colección de Productos Almacen
    const productos_almacen = await 
      ProductoAlmacen.find({})
      .populate(
        {
          path: 'producto',
          select: 'nombre'
        }
      )
      .populate(
        {
          path: 'almacen',
          select: 'nombre'
        }
      )

    res.json({
       ok: true,
       productos_almacen
    })

}

//Creando producto Almacen
const crearProductoAlmacen = async (req, res = response) => {
   
   const producto_almacen = new ProductoAlmacen({
       ...req.body
   });
   
   try {

       const producto_almacenDB = await producto_almacen.save();

       res.json({
           ok: true,
           producto_almacen: producto_almacenDB
       });
       
   } catch (error) {
       res.status(500).json({
           ok: false,
           msg: 'Hable con el administrador'
       })
   }
}

//Actualizando Producto Almacen
const actualizarProductoAlmacen = async (req, res = response) => {
   
   const id = req.params.id;

   try {

    const producto_almacen = await ProductoAlmacen.findById(id);

    // Si existe un producto almacen por el id
    if (!producto_almacen) {
        return res.status(404).json({
            ok: true,
            msg: 'Producto del almacen no encontrado por id'
        })
    }
 
    // Extrayendo lo que viene en la req
    const cambiosProductoAlmacen = {
        ...req.body
    }

    // Actualizando Producto Almacen
    const productoAlmacenActualizado = await ProductoAlmacen.findByIdAndUpdate(id, cambiosProductoAlmacen, { new: true });


    res.json({
        ok: true,
        producto_almacen: productoAlmacenActualizado
    })

   } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
   }
}

// Borrando Producto del Almacen
const borrarProductoAlmacen = async(req, res = response) => {
    const id = req.params.id;
 
    try {
 
     const producto_almacen = await ProductoAlmacen.findById(id);
 
     // Si existe un producto del almacen por el id
     if (!producto_almacen) {
         return res.status(404).json({
             ok: true,
             msg: 'Producto del almacen no encontrado por id'
         })
     }

     // Eliminando Producto del almacen
     await ProductoAlmacen.findByIdAndDelete( id );

     res.json({
         ok: true,
         msg: 'Producto del almacen Eliminado'
     });
 
    } catch (error) {
         res.status(500).json({
             ok: false,
             msg: 'Hable con el administrador'
         })
    }
}

module.exports = {
   getProductosAlmacen,
   crearProductoAlmacen,
   actualizarProductoAlmacen,
   borrarProductoAlmacen
}