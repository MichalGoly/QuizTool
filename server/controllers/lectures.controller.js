var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth.helper');
var lecturesDb = require('../db/lectures.db');

router.get('/', getLectures);
router.get('/:_id', getLecture);
router.get('/:_id/file', getFile);
router.delete('/:_id', deleteLecture);

module.exports = router;

// Returns a list of lectures for the authenticated lecturer.
// NOTE: File blobs are ignored
function getLectures(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    lecturesDb.getAll(lecturer._id).then((lectures) => {
      console.log(lectures);
    }).catch((err) => {
      console.error(err);
      res.send(500);
    });
  }).catch((err) => {
    res.send(401);
  });
}

// Returns a specific lecture based on its primary key _id
// NOTE: File blobs is ignored
function getLecture(req, res) {
  authHelper.check(req, res).then((lecturer) => {

  }).catch((err) => {
    res.send(401);
  });
}

// Returns the file blob PDF presentation of the specific lecture
function getFile(req, res) {
  authHelper.check(req, res).then((lecturer) => {

  }).catch((err) => {
    res.send(401);
  });
}

// Deletes a specific lecture based on the _id provided
function deleteLecture(req, res) {
  authHelper.check(req, res).then((lecturer) => {

  }).catch((err) => {
    res.send(401);
  });
}
