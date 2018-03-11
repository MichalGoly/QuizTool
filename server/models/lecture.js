var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Slide = require('./slide');

var lectureSchema = mongoose.Schema({
  lecturerId: String,
  fileName: String,
  file: Buffer
});

// cascade delete slides on lecture removal
lectureSchema.post('remove', (doc) => {
  Slide.remove({
    lectureId: doc._id
  }).exec();
});

module.exports = mongoose.model('Lecture', lectureSchema);
