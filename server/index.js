var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var passport = require('./helpers/passport.helper');
var io = require('./helpers/socket.helper')(server);
var db = require('./db/db');

// socket.io setup
app.use(function(req, res, next) {
  req.io = io;
  next();
});

app.use('/lecturers', require('./controllers/lecturers.controller'));
app.use('/lectures', require('./controllers/lectures.controller'));
app.use('/slides', require('./controllers/slides.controller'));

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

module.exports = app;
