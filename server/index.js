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

var lecturerSchema = mongoose.Schema({
  googleId: Number,
  name: String
});
var Lecturer = mongoose.model('Lecturer', lecturerSchema);

var chris = new Lecturer({
  googleId: 1234,
  name: "Chris"
});
chris.save((err, chris) => {
  if (err) {
    return console.error(err);
  } else {
    return console.log("[INFO] Chris stored in the databse");
  }
});
var mike = new Lecturer({
  googleId: 1235,
  name: "Michal"
});
mike.save((err, mike) => {
  if (err) {
    return console.error(err);
  } else {
    return console.log("[INFO] Mike stored in the databse");
  }
});

app.get('/lecturers', (req, res) => {
  Lecturer.find((err, lecturers) => {
    if (err) {
      res.send("Error: " + err);
    } else {
      res.send(lecturers);
    }
  });
});

server.listen('3000', () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
