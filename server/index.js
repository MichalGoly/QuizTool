var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var server = http.createServer(app);
var passport = require('./helpers/passport.helper');
var auth = require('./helpers/auth.helper');
var io = require('./helpers/socket.helper')(server);
var db = require('./db/db');

app.use(bodyParser.json());

// socket.io setup
app.use(function(req, res, next) {
  req.io = io;
  next();
});

app.use('/lecturers', require('./controllers/lecturers.controller'));
app.use('/lectures', require('./controllers/lectures.controller'));
app.use('/slides', require('./controllers/slides.controller'));
app.use('/sessions', require('./controllers/sessions.controller'));

// Global handler for uncaught errors
app.use(function(err, req, res, next) {
  res.status(500).send({
    error: err
  });
});

if (process.env.GOOGLE_AUTH_DISABLED === 'true') {
  app.get('/auth/google', (req, res) => {
    auth.authenticateForTesting(req, res);
  });
} else {
  app.get('/auth/google',
    passport.authenticate('google', {
      scope: ['email profile']
    }));
}

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

  console.log('Quiz Tool listening at http://%s:%s', host, port);
});

module.exports = app;
