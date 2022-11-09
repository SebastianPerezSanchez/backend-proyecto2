require('dotenv').config();

const express = require('express');
const cors = require('express');
const {WebhookClient, Payload} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const {Suggestions} = require('actions-on-google');


const { dbConnection } = require('./database/config');
const { param } = require('express-validator');

//Modelos
const Producto = require('./models/producto');
const ProductoAlmacen = require('./models/producto_almacen');
const Almacen = require('./models/almacen');
const Movimiento = require('./models/movimiento');
const almacen = require('./models/almacen');
// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use( express.json() );

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://risad-proyect.web.app');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//Base de datos
dbConnection();

// Rutas
app.use('/api/usuario', require('./routes/usuarios')),
app.use('/api/almacen', require('./routes/almacenes')),
app.use('/api/marca', require('./routes/marcas')),
app.use('/api/producto_almacen', require('./routes/productos_almacen')),
app.use('/api/producto', require('./routes/productos')),
app.use('/api/rol', require('./routes/roles')),
app.use('/api/tipo_movimiento', require('./routes/tipo_movimientos')),
app.use('/api/movimiento', require('./routes/movimientos')),
app.use('/api/login', require('./routes/auth'))



app.set('port', (process.env.PORT || 3000));

app.get('/', function(request, response){
    var result = 'App is running'
    response.send(result)
}).listen(app.get('port'), function(){
    console.log('App is running, server is listening on port', app.get('port'));
});

app.post('/webhook', express.json(),function(request, response){
    
    const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function TestWebHook(agent) {

    let parameters = agent.parameters.text;
    let productoinfo = productos.findOne({codigo:agent});
    agent.add(`Estoy enviando este mensaje desde el backend: ` + productoinfo.name);
    console.log(" " + productoinfo.nombre);
    }

    async function TestCard(agent) {

      let conv = agent.conv();
      const textResponseText = 'Hello';
      const suggestionText = 'My Reply';

      conv.ask("Elige algo");
      conv.ask(new Suggestions(suggestionText))
      agent.add(conv);
  
          let chips = {
          richContent: [
            [
              {
                type: "chips",
                options: [
                  {
                    text: "La Molina",
                    image: {
                      src: {
                        "rawUrl": "https://example.com/images/logo.png"
                      }
                    }
                  },
                  {
                    text: "Ceres",
                    image: {
                      src: {
                        rawUrl: "https://example.com/images/logo.png"
                      }
                    }
                  }
                ]
              }
            ]
          ]
        }

       // agent.add("Seleccione el almacen que desea consultar");
       // agent.add(new Payload(agent.UNSPECIFIED, chips, {sendAsMessage: true, rawPayload: true}));

       // const alamacenParam = agent.parameters.almacen;
       // let almacenCaught = await Almacen.findOne({nombre:alamacenParam});

        //console.log(almacenCaught);

        //agent.add("Almacen seleccionado");

    }

    async function ReadProduct(agent){
      const productId = agent.parameters.text;
      
      let productCaught = await Producto.findOne( {codigo:productId});

      if(productCaught != null)
      {
       var productData = {
        richContent: [
          [
            {
              type: "accordion",
              title: productCaught.nombre,
              subtitle: "Precio: S/." + productCaught.precio,
              image: {
                src: {
                  rawUrl: "https://example.com/images/logo.png"
                }
              },
              text: "Marca: " + productCaught.marca + "\n Descripción: " + productCaught.descripcion
            }
          ]
        ]
       }

       agent.add(new Payload(agent.UNSPECIFIED, productData, {sendAsMessage: true, rawPayload: true}));
      } else {
        agent.add(`No existe ningun producto con el id: ` + productId);
      }
    }

    async function StockProduct(){
      const almacenName = agent.parameters.almacen;
      const productId = agent.parameters.producto;
      let almacenCaught = await Almacen.findOne({nombre:almacenName});
      let productoCaught = await Producto.findOne({codigo:productId});
        if(almacenCaught != null){
          if(productoCaught != null){
            let inventarioCaught = await ProductoAlmacen.findOne({almacen:almacenCaught._id, producto:productoCaught._id});
              if(inventarioCaught != null) {
                
                var productStockData = {
                  richContent: [
                    [
                      {
                        type: "accordion",
                        title: productoCaught.nombre,
                        subtitle: "Stock: " + inventarioCaught.stock,
                        image: {
                          src: {
                            rawUrl: "https://example.com/images/logo.png"
                          }
                        },
                        text: "Codigo: " + productoCaught.codigo +  "\n Almacen: " + almacenCaught.nombre + "\n Precio: " + productoCaught.precio
                      }
                    ]
                  ]
                }

                agent.add(new Payload(agent.UNSPECIFIED, productStockData, {sendAsMessage: true, rawPayload: true}))

              } else {
                agent.add("No existe registros del producto: " + productoCaught.nombre + "en el almacen " + almacenName);
              }
          } else {
            agent.add("El identificador no corresponde al de ningun producto existente");
          }
        } else {
          agent.add("El almacen ingresado es incorrecto");
        }
    }

    async function NoStock(){
      const almacenName = agent.parameters.almacen;
      let almacenCaught = await Almacen.findOne({nombre:almacenName});
      if(almacenCaught != null)
      {
        const inventarioCaught = await ProductoAlmacen.find({almacen:almacenCaught._id, stock:0})
        .populate(
          {
            path: 'producto',
            select: 'nombre codigo'
          }
        );
        //
        const contenidoInventario = [];
  
        inventarioCaught.map(elemento => {
          contenidoInventario.push({
            type: "list",
                title: elemento.producto.nombre,
                subtitle: "codigo: "  + elemento.producto.codigo    
            })
          
        });


        let contenidoFull = {
          richContent: [
              JSON.parse(JSON.stringify(contenidoInventario))
          ]
        };

        agent.add("En el almacen de " + almacenName + ", los siguientes productos no tienen stock:");
        agent.add(new Payload(agent.UNSPECIFIED, contenidoFull, {sendAsMessage: true, rawPayload: true}));



      } else {
        agent.add("El almacen ingresado es incorrecto")
      }
    }

    async function LastEntryInventory(){
      const almacenName = agent.parameters.almacen;
      const productoId = agent.parameters.producto;
      let almacenCaught = await Almacen.findOne({nombre:almacenName});  
      let productoCaught = await Producto.findOne({codigo:productoId});

      if(almacenCaught != null)
      {
        if(productoCaught != null)
        {
          let movimientoCaught = await Movimiento.findOne({almacen:almacenCaught._id, producto: productoCaught._id, tipo_movimiento: '63255e17f46682323bd73041'})
          if(movimientoCaught != null) {
            var movimientoData = {
              richContent: [
                [
                  {
                    type: "accordion",
                    title: productoCaught.nombre,
                    subtitle: movimientoCaught.fecha,
                    image: {
                      src: {
                        rawUrl: "https://example.com/images/logo.png"
                      }
                    },
                    text: "Cantidad en Movimiento:" + movimientoCaught.cantidad
                  }
                ]
              ]
            }

            agent.add(new Payload(agent.UNSPECIFIED, movimientoData, {sendAsMessage: true, rawPayload: true}))
          } else {
            agent.add(`No existe ningún registro de entrada de inventario del producto: ` + productoCaught.nombre + "en el almacen: " + almacenName);
          }
        } else {
          agent.add(`El producto ingresado es incorrecto`);
        }
      } else {
        agent.add('El almacén ingresado es incorrecto');
      } 
      
    }
    
    async function LastOutputInventory(){
      const almacenName = agent.parameters.almacen;
      const productoId = agent.parameters.producto;
      let almacenCaught = await Almacen.findOne({nombre:almacenName});  
      let productoCaught = await Producto.findOne({codigo:productoId});

      if(almacenCaught != null)
      {
        if(productoCaught != null)
        {
          let movimientoCaught = await Movimiento.findOne({almacen:almacenCaught._id, producto:productoCaught._id, tipo_movimiento:'63255df8f46682323bd7303f'});

            if(movimientoCaught != null)
            {
              var movimientoData = {
                richContent: [
                  [
                    {
                      type: "accordion",
                      title: productoCaught.nombre,
                      subtitle: movimientoCaught.fecha,
                      image: {
                        src: {
                          rawUrl: "https://example.com/images/logo.png"
                        }
                      },
                      text: "Cantidad en Movimiento:" + movimientoCaught.cantidad
                    }
                  ]
                ]
              }

              agent.add(new Payload(agent.UNSPECIFIED, movimientoData, {sendAsMessage: true, rawPayload: true}))
            } else {
              agent.add(`No existe ninguna salida de inventario del producto: ` + productoId + "en el almacen: " + almacenName);
            }
        } else{
          agent.add(`El producto ingresado es incorrecto`);
        }
      }else{
        agent.add(`El almacen ingresado es incorrecto`);
      }

    }

  let intentMap = new Map();
  
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('TestWebHook', TestWebHook);
  intentMap.set('TestCard', TestCard);
  intentMap.set('ReadProduct', ReadProduct);
  intentMap.set('LastOutputInventory', LastOutputInventory);
  intentMap.set('NoStock', NoStock);
  intentMap.set('StockProduct', StockProduct);
  intentMap.set('LastEntryInventory', LastEntryInventory);
  agent.handleRequest(intentMap);
});