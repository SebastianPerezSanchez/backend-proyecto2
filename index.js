require('dotenv').config();

const express = require('express');
const cors = require('express');
const {WebhookClient} = require('dialogflow-fulfillment');
const productos = require('./models/producto');


const { dbConnection } = require('./database/config');
const { param } = require('express-validator');
const producto = require('./models/producto');

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
    let productoinfo = productos.findOne({codigo:agent});
    agent.add(`Estoy enviando desde el ` + productoinfo.name);
    console.log(" " + productoinfo.name);
    }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('TestWebHook', TestWebHook);

  agent.handleRequest(intentMap);
});