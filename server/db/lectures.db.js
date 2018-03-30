var mongoose = require('mongoose');
var slidesDb = require('./slides.db');
var Lecture = require('../models/lecture');

var database = {}

database.getAll = getAll;
database.getOne = getOne;
database.create = create;
database._delete = _delete;

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
    if (mongoose.Types.ObjectId.isValid(_id)) {
      Lecture.findById(_id).then((lecture) => {
        resolve(lecture);
      }).catch((err) => {
        reject(err);
      });
    } else {
      reject(400);
    }
  });
}

function create(req, lecturer_id) {
  return new Promise((resolve, reject) => {
    /*
     * 1. Create a Lecture with the blob uploaded
     * 2. Splice the pdf into slides and save them in the database
     */
    if (req.file !== null && req.file.mimetype !== null && req.file.mimetype === 'application/pdf' &&
      lecturer_id !== null) {
      var newLecture = new Lecture({
        lecturerId: lecturer_id,
        fileName: req.file.originalname,
        file: req.file.buffer
      });
      newLecture.save().then((lect) => {
        console.log("[INFO] Lecture " + lect._id + " saved in database");
        slidesDb.createFromLecture(lect).then(() => {
          resolve();
        }).catch((err) => {
          console.error(err);
          var errorMsg = "Failed to create slides, removing lecture...";
          console.error(errorMsg);
          lect.remove().then((lectRemoved) => {
            console.log("[INFO] Fallback lecture removal was successful");
            reject(errorMsg);
          }).catch((err) => {
            reject(err);
          });
        });
      }).catch((err) => {
        reject(err);
      })
    } else {
      reject("req.file or lecturer_id was null or the mimetype was malformed");
    }
  });
}

function _delete(id, lecturer_id) {
  return new Promise((resolve, reject) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
      Lecture.findById(id).then((lecture) => {
        if (lecture === null) {
          reject(404);
        } else if (lecture.lecturerId == lecturer_id) {
          lecture.remove((err, removedLecture) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        } else {
          reject(401);
        }
      }).catch((err) => {
        reject(err);
      });
    } else {
      reject(400);
    }
  });
}
