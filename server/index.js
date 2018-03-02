var express = require('express');
var http = require('http');
var io = require('socket.io');
var app = express();
var server = http.createServer(app);
var passport = require('./helpers/passport.helper');
var db = require('./db/db');

app.use('/lecturers', require('./controllers/lecturers.controller'));
app.use('/lectures', require('./controllers/lectures.controller'));

// TODO remove once no longer needed for dev purposes
// var Slide = require('./models/slide');
// app.get('/img', (req, res) => {
//   Slide.find((err, slides) => {
//     if (err) {
//       res.send("Error: " + err);
//     } else {
//       res.send(slides);
//     }
//   });
// });
//
// app.get('/img/:_id', (req, res) => {
//   Slide.findById(req.params._id).then((slide) => {
//     res.contentType('image/png');
//     res.send(slide.image);
//   }).catch((err) => {
//     res.send("error: " + err);
//   })
// });

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['email profile']
  }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/'
  }), (req, res) => {
    res.cookie('auth', req.user.token);
    res.redirect('/');
  });

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

server.listen('3000', () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
