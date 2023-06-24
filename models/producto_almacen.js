const { Schema, model } = require('mongoose')

const ProductoAlmacenSchema = Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        require: true
    },
    almacen: {
        type: Schema.Types.ObjectId,
        ref: 'Almacen',
        require: true
    },
    stock: {
        type: Number,
        required: true
    },
});

ProductoAlmacenSchema.method('toJSON', function(){
  const { __v, ...object} = this.toObject();
  return object;
})


module.exports = model('ProductoAlmacen', ProductoAlmacenSchema)