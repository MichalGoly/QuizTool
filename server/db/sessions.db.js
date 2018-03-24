var mongoose = require('mongoose');
var Session = require('../models/session');

var database = {}

database.create = create;

module.exports = database;

function create(liveAnswers) {
  return new Promise((resolve, reject) => {
    reject("Not implemented yet");
  });
}
