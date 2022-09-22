const { Schema, model } = require('mongoose')

const MarcaSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  }
});

MarcaSchema.method('toJSON', function(){
  const { __v, ...object} = this.toObject();
  return object;
})


module.exports = model('Marca', MarcaSchema)