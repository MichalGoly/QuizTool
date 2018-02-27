var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lecturerSchema = mongoose.Schema({
  googleId: Number,
  name: String
});

module.exports = mongoose.model('Lecturer', lecturerSchema);
