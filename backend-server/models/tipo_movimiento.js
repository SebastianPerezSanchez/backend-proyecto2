const { Schema, model } = require('mongoose')

const TipoMovimientoSchema = Schema({
  nombre  : {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  }
});

TipoMovimientoSchema.method('toJSON', function(){
  const { __v, ...object} = this.toObject();
  return object;
})


module.exports = model('TipoMovimiento', TipoMovimientoSchema)