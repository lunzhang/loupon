#!/usr/bin/env node

/**
* Module dependencies.
*/

var app = require('../app');
var debug = require('debug')('MEAN:server');
var http = require('http');

/**
* Get port from environment and store in Express.
*/

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
* Create HTTP server.
*/

var server = http.createServer(app);

/**
* Listen on provided port, on all network interfaces.
*/

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
* Normalize a port into a number, string, or false.
*/

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

/**
* Event listener for HTTP server "error" event.
*/

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

/**
* Socket.io init listening on connections
*/

var io = require('socket.io').listen(server);
var users= {};

io.on('connection', function (socket) {
    
    // emits current game state to new player
    var state = {
        players: users,
        id: socket.id
    };
    socket.emit('state', state);

    //add new player to current list of players
    socket.on('new player', function (player) {
        users.push(player);
    });
    
    socket.on('disconnect', function () {
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == socket.id) {
                users.splice(i, 1);
            }
        }
    });

    socket.on('message', function (msg) {
        io.emit('message', msg);
    });

});