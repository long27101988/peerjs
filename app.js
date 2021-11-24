var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {ExpressPeerServer} = require('peer');
require('dotenv').config();
const http = require('http');
const fs = require('fs')
const https = require('https');
const helmet = require('helmet');
const xss = require('xss-clean')
const compression = require('compression');
var debug = require('debug')('peer-server:server');

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

var app = express();
app.set("trust proxy", 1);
app.use(logger('dev'));
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(xss());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.enable("trust proxy");



const server = http.createServer(app)
const serverSecure = https.createServer(app)

const peerServer = ExpressPeerServer(server, {
    debug: true,
    key: "macaw-peer-server-cao-hoang-long-dep-trai-qua",
    proxied: true,
    // ssl: {
    //   cert:fs.readFileSync('/etc/letsencrypt/live/rule-app.ml/fullchain.pem'),
    //   key: fs.readFileSync('/etc/letsencrypt/live/rule-app.ml/privkey.pem'),
    // }
})


const peerServerSecure = ExpressPeerServer(serverSecure, {
  debug: true,
  key: "macaw-peer-server-cao-hoang-long-dep-trai-qua",
  proxied: true,
  ssl: {
    cert:fs.readFileSync('/root/ssl_cert/rule-app.ml/certificate1.crt'),
    key: fs.readFileSync('/root/ssl_cert/rule-app.ml/private.key'),
  }
})
app.use('/peerjs', peerServer);
app.use('/peerjss', peerServerSecure);

var port = normalizePort(process.env.PORT || '3000');
// app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

serverSecure.listen(4431);
serverSecure.on('error', onError);
serverSecure.on('listening', onListening);


function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
