var express = require('express');
var router = express.Router();
var fs = require('fs');
var authHelper = require('../helpers/auth.helper');
var lecturesDb = require('../db/lectures.db');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage
});

router.get('/', getLectures);
router.get('/:_id', getLecture);
router.get('/:_id/file', getFile);
router.delete('/:_id', deleteLecture);
router.post('/', upload.single('file'), newLecture);

module.exports = router;

// Returns a list of lectures for the authenticated lecturer.
// NOTE: File blobs are ignored
function getLectures(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    lecturesDb.getAll(lecturer._id).then((lectures) => {
      var out = [];
      for (var i = 0; i < lectures.length; i++) {
        var temp = lectures[i];
        delete temp.file;
        out.push(temp);
      }
      res.send(out);
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

function newLecture(req, res) {
  console.log("I love money and bitches");
  authHelper.check(req, res).then((lecturer) => {
    console.log("We're in");
    console.log(req);
    console.log(req.file);
    console.log(req.body);
  }).catch((err) => {
    res.send(401);
  });
}
