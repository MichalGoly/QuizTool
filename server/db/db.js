var mongoose = require('mongoose');
mongoose.connect('mongodb://database/quiz_db');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connectione error:'));

db.once('open', () => {
  console.log("[INFO] we are connected!");
});

module.exports = db;
