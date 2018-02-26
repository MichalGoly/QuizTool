var express = require('express');
var http = require('http');
var io = require('socket.io');

var app = express();

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/* setup socket.io */
io = io(server);
app.use(function(req, res, next) {
  req.io = io;
  next();
});
io.on('connection', (socket) => {
  //log.info('socket.io connection made');
  console.log('socket.io connection made');

  socket.on('event1', (data) => {
    console.log(data.msg);
  });

  socket.emit('event2', {
    msg: 'Server to client, do you read me? Over.'
  });

  socket.on('event3', (data) => {
    console.log(data.msg);
    socket.emit('event4', {
      msg: 'Loud and clear :)'
    });
  });

  socket.on('send-message', (message) => {
    console.log("[INFO] send-message event received. Message: " + message.text);
    socket.broadcast.emit('message-received', {
      text: message.text
    });
  });
});

app.get('/hello', (req, res) => {
  res.send('<h2>Hello from Express</h2>');
});

// mongoose -> nice and dirty in a single file...
var mongoose = require('mongoose');
mongoose.connect('mongodb://database/quiz_db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connectione error:'));
db.once('open', () => {
  console.log("[INFO] we are connected!");
});

server.listen('3000', () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
