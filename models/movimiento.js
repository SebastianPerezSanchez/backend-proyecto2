const { Schema, model } = require('mongoose')

const MovimientoSchema = Schema({
  fecha: {
    type: Date,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    require: true
  },
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Producto',
    require: true
  },
  tipo_movimiento: {
    type: Schema.Types.ObjectId,
    ref: 'TipoMovimiento',
    require: true
  },
  almacen: {
    type: Schema.Types.ObjectId,
    ref: 'Almacen',
    require: true
  },
  codigo_recibido: {
    type: String,
    require: true
  }
});

MovimientoSchema.method('toJSON', function(){
  const { __v, ...object} = this.toObject();
  return object;
})


module.exports = model('Movimiento', MovimientoSchema)