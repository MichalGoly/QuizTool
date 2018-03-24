var mongoose = require('mongoose');
var Session = require('../models/session');

var database = {}

database.create = create;
database.getByLectureId = getByLectureId;

module.exports = database;

function create(liveAnswers) {
  return new Promise((resolve, reject) => {
    var session = new Session(liveAnswers);
    session.save().then((saved) => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
}

function getByLectureId(lecture_id) {
  return new Promise((resolve, reject) => {
    Session.find({
      lectureId: lecture_id
    }).sort({
      date: 'descending'
    }).then((sessions) => {
      resolve(sessions);
    }).catch((err) => {
      reject(err);
    });
  });
}
