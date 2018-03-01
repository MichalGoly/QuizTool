var Lecture = require('../models/lectures');

var database = {}

database.getAll = getAll;
database.getOne = getOne;
database.getFile = getFile;
// database.create = create; these seem redundant but will keep commented out for now
// database.update = update;
// database._delete = _delete;

module.exports = database;

function getAll(l_id) {
  return new Promise((resolve, reject) => {
    Lecture.find({
      lecturerId: l_id
    }).then((lectures) => {
      resolve(lectures);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getOne(_id) {
  return new Promise((resolve, reject) => {
    Lecture.findById(_id).then((lecture) => {
      resolve(lecture);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getFile(_id) {
  return new Promise((resolve, reject) => {
    // TODO
  });
}

// function create(lecture) {
//   return new Promise((resolve, reject) => {
//     lecture.save().then((l) => {
//       resolve(l);
//     }).catch((err) => {
//       reject(err);
//     })
//   });
// }
//
// function update(lecture) {
//   return new Promise((resolve, reject) => {
//     lecture.update().then(() => {
//       resolve();
//     }).catch((err) => {
//       reject(err);
//     })
//   });
// }
//
// function _delete(_id) {
//   return new Promise((resolve, reject) => {
//
//   });
// }
