var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lectureSchema = mongoose.Schema({
  lecturerId: String,
  fileName: String,
  file: Buffer
});

module.exports = mongoose.model('Lecture', lectureSchema);
