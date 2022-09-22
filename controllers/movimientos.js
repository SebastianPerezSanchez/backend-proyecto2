const { response } = require('express')

const Movimiento = require('../models/movimiento')
const ProductoAlmacen= require('../models/producto_almacen')

// Obteniendo movimientos
const getMovimientos = async (req, res = response) => {

    // Populando el campo usuario, producto, tipo movimiento y almacen en la colección de Productos
    const movimientos = await 
                        Movimiento.find({})
                        .populate(
                            {
                            path: 'usuario',
                            select: 'nombre'
                            }
                        )
                        .populate(
                            {
                            path: 'producto',
                            select: 'nombre'
                            }
                        )
                        .populate(
                            {
                            path: 'tipo_movimiento',
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
       movimientos
    })
}

//Creando movimiento
const crearMovimiento = async (req, res = response) => {


        // Extrayendo lo que viene en la req
        const cambiosProductoAlmacen = {
            ...req.body
        }
    
        // Actualizando Producto Almacen
        const productoAlmacenActualizado = await ProductoAlmacen.findByIdAndUpdate(id, cambiosProductoAlmacen, { new: true });

   
   const movimiento = new Movimiento({
       ...req.body
   });

   const {fecha, cantidad, usuario, producto, tipo_movimiento, almacen, codigoRecibido } = req.body;

   const productos_almacen = await ProductoAlmacen.find({})

   const stockVa = 0;
   
   try {
 
       const movimientoDB = await movimiento.save();

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

module.exports = {
   getMovimientos,
   crearMovimiento
}