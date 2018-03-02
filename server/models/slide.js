var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var slideSchema = mongoose.Schema({
  lectureId: String,
  image: Buffer,
  text: String,
  isQuiz: Boolean,
  slideNumber: Number
});

module.exports = mongoose.model('Slide', slideSchema);
