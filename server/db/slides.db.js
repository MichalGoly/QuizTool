var Slide = require('../models/slide');

var database = {}

// database.getAll = getAll;
// database.getOne = getOne;
// database.getFile = getFile;
// database.create = create;
// // database.update = update;
// // database._delete = _delete;

database.createFromLecture = createFromLecture;

module.exports = database;

function createFromLecture(lecture) {
  return new Promise((resolve, reject) => {
    console.log("Splicing the PDF into images...");
    console.log(lecture);
    resolve();
  });
}
