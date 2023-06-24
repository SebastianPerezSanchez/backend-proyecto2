const { response } = require('express')

const Movimiento = require('../models/movimiento')
const ProductoAlmacen= require('../models/producto_almacen')

// Obteniendo movimientos
const getMovimientos = async (req, res = response) => {

    // Populando el campo usuario, producto, tipo movimiento y almacen en la colección de Productos
    const movimientos = await 
                        Movimiento.find({}).sort({$natural:-1})
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

const getAllMovimientosEntrada = async (req, res = response) => {

  // Populando el campo usuario, producto, tipo movimiento y almacen en la colección de Productos
  const movimientos = await 
                      Movimiento.find({}).sort({$natural:-1})
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


const formateo = movimientos.filter(res => res.tipo_movimiento.nombre === 'Ingreso')
console.log(formateo)

const ingreso = formateo.map( res => {
    return {
      producto: res.producto.nombre,
      cantidad: res.cantidad,
      fecha: res.fecha,
    }
  })

  res.json({
    ok: true,
    movimientos: ingreso,
  });
};


const getAllMovimientosSalida = async (req, res = response) => {

    // Populando el campo usuario, producto, tipo movimiento y almacen en la colección de Productos
    const movimientos = await 
                        Movimiento.find({}).sort({$natural:-1})
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

const formateo = movimientos.filter( res => res.tipo_movimiento.nombre === 'Salida')

const salida = formateo.map( res => {
    return {
      producto: res.producto.nombre,
      cantidad: res.cantidad,
      fecha: res.fecha,
    }
  })

  res.json({
    ok: true,
    movimientos: salida,
  });
};


//Creando movimiento
const crearMovimiento = async (req, res = response) => {

    const movimiento = new Movimiento({
        ...req.body
    });
   
   try {
 
       const movimientoDB = await movimiento.save();

       res.json({
           ok: true,
           movimiento: movimientoDB
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
   crearMovimiento,
   getAllMovimientosSalida,
   getAllMovimientosEntrada,
}