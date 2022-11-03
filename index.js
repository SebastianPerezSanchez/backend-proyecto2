require('dotenv').config();

const express = require('express');
const cors = require('express');
const {WebhookClient, Payload} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const { dbConnection } = require('./database/config');
const { param } = require('express-validator');

//Modelos
const Producto = require('./models/producto');
const ProductoAlmacen = require('./models/producto_almacen');
const Almacen = require('./models/almacen');
const Movimiento = require('./models/movimiento');
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

    function TestCard(agent) {
        agent.add(new Card({
            title: `Ejemplo de titulo`,
            imageUrl: 'https://st.depositphotos.com/2935381/4189/i/450/depositphotos_41897159-stock-photo-example-concept.jpg',
            text: `esto es el body de un card\n Esto va rellenando el body`,
            buttonText: 'Botón',
            buttonUrl: 'https://www.clker.com/cliparts/h/M/j/T/O/s/seul-friends-botton.svg.hi.png'
            })
            );
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

    async function NoStock(){
      const almacenName = agent.parameters.almacen;
      let almacenCaught = await Almacen.findOne({nombre:almacenName});
      console.log(almacenCaught);
      if(almacenCaught != null)
      {
        let inventarioCaught = await ProductoAlmacen.find({almacen:almacenCaught._id, stock:0});
        
        let contenidoInventario = [];
  
        inventarioCaught.forEach(elemento =>{
          contenidoInventario.push(
              {
              richContent: [[{
                type: "list",
                title: elemento.producto,
                subtitle: "List item 1 subtitle",
                event:{
                      name: "",
                      languageCode: "",
                      parameters: {}
                      }
              },
              {
                type: "divider"
              },
            ]]
          })
        });

        const  inventarioData = {
          richContent: [
            [
              inventarioCaught.map(value => {
                return {
                  type: "list",
                  title: "value.producto",
                  subtitle: "List item 1 subtitle",
                  event: {
                    name: "",
                    languageCode: "",
                    parameters: {}
                  }
                },
                {
                  type: "divider"
                }
              }),

            ]
          ]
        };

        console.log(inventarioData);

        const listaP = inventarioCaught.map(value => {
          return {
            richContent: [
              [
                {
                  type: "list",
                  title: value.producto,
                  subtitle: "List item 1 subtitle",
                  event: {
                    name: "",
                    languageCode: "",
                    parameters: {}
                  }
                },
                {
                  type: "divider"
                },
                
              ]
            ]
          }
        });
        console.log(listaP);
        console.log(contenidoInventario);
        
        let contenidoFull = {
          richContent: [
            [
              JSON.stringify(contenidoInventario)
            ]
          ]
        };
        
        agent.add(new Payload(agent.UNSPECIFIED, contenidoFull, {sendAsMessage: true, rawPayload: true}));
        console.log(contenidoFull);
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

  agent.handleRequest(intentMap);
});