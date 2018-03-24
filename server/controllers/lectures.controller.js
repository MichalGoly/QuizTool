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
      var out = JSON.parse(JSON.stringify(lectures));
      for (var i = 0; i < out.length; i++) {
        delete out[i].file;
      }
      res.send(out);
    }).catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  }).catch((err) => {
    res.sendStatus(401);
  });
}

// Returns a specific lecture based on its primary key _id
// NOTE: File blobs is ignored
function getLecture(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    lecturesDb.getOne(req.params._id).then((lecture) => {
      if (lecture === null) {
        res.sendStatus(404);
      } else if (lecture.lecturerId == lecturer._id) {
        var out = JSON.parse(JSON.stringify(lecture));
        delete out.file;
        res.send(out);
      } else {
        res.sendStatus(401);
      }
    }).catch((err) => {
      if (err === 400) {
        res.sendStatus(400);
      } else {
        console.error("An error has occurred " + err);
        res.sendStatus(500);
      }
    });
  }).catch((err) => {
    console.error("An error has occurred " + err);
    res.sendStatus(401);
  });
}

// Returns the file blob PDF presentation of the specific lecture
function getFile(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    // TODO
    res.sendStatus(500);
  }).catch((err) => {
    res.sendStatus(401);
  });
}

// Deletes a specific lecture based on the _id provided
function deleteLecture(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    lecturesDb._delete(req.params._id, lecturer._id).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      if (err === 401) {
        res.sendStatus(401);
      } else if (err === 400) {
        res.sendStatus(400);
      } else if (err === 404) {
        res.sendStatus(404);
      } else {
        console.error("An error has occurred: " + err);
        res.sendStatus(500);
      }
    });
  }).catch((err) => {
    res.sendStatus(401);
  });
}

function newLecture(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    lecturesDb.create(req, lecturer._id).then(() => {
      res.sendStatus(201);
    }).catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  }).catch((err) => {
    res.sendStatus(401);
  });
}
