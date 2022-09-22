const { Schema, model } = require('mongoose')

const UsuarioSchema = Schema({
  nombre  : {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fecha : {
    type: String,
  },
  rol: {
    type: Schema.Types.ObjectId,
    ref: 'Rol',
    require: true
  },
  almacen: {
    type: Schema.Types.ObjectId,
    ref: 'Almacen',
    require: true
  },
  google: {
    type: Boolean, 
    default: false
  }
});

UsuarioSchema.method('toJSON', function(){
  const { __v, ...object} = this.toObject();
  return object;
})


module.exports = model('Usuario', UsuarioSchema)