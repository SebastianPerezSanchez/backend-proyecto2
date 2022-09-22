const { Schema, model } = require('mongoose')

const AlmacenSchema = Schema({
  nombre  : {
    type: String,
    required: true
  }
});

AlmacenSchema.method('toJSON', function(){
  const { __v, ...object} = this.toObject();
  return object;
})


module.exports = model('Almacen', AlmacenSchema)