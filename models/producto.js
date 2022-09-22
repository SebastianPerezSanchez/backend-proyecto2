const { Schema, model } = require('mongoose')

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  marca: {
    type: Schema.Types.ObjectId,
    ref: 'Marca',
    require: true
  },
  precio: {
    type: Number,
    required: true
  },
  codigo: {
    type: String,
    required: true
  },
});

ProductoSchema.method('toJSON', function(){
  const { __v, ...object} = this.toObject();
  return object;
})


module.exports = model('Producto', ProductoSchema)