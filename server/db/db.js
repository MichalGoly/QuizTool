var mongoose = require('mongoose');
const DB_URL = process.env.NODE_ENV === 'test' ? 'mongodb://database/quiz_db_test' : 'mongodb://database/quiz_db';
mongoose.connect(DB_URL);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connectione error:'));

db.once('open', () => {
  console.log("[INFO] db connected to: " + DB_URL);
});

module.exports = db;
