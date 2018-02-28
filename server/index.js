var express = require('express');
var http = require('http');
var io = require('socket.io');

var app = express();
var server = http.createServer(app);

var db = require('./db/db');
var Lecturer = require('./models/lecturer');

app.use('/lecturers', require('./controllers/lecturers.controller'));

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

// passport google authentication
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  Lecturer.findOne({
    googleId: profile.id
  }, (err, lecturer) => {
    if (lecturer === null) {
      var newLecturer = new Lecturer({
        googleId: profile.id,
        name: profile.displayName,
        token: accessToken
      });
      newLecturer.save((err, newLecturer) => {
        if (err)
          throw err;
        // start session and redirect to the dashboard
        done(null, newLecturer);
      });
    } else {
      console.log("[WARN] User with id " + profile.id + " already exists, logging in...");
      // start session and redirect to the dashboard
      done(null, lecturer);
    }
  })
}));

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

server.listen('3000', () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
