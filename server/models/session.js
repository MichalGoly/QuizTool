var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sessionSchema = mongoose.Schema({
  lectureId: String,
  date: Date,
  answers: Schema.Types.Mixed
});

module.exports = mongoose.model('Session', sessionSchema);
