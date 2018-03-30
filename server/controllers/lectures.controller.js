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
      res.status(500).send({
        error: err
      });
    });
  }).catch((err) => {
    res.status(401).send({
      error: err
    });
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
        res.status(400).send({
          error: "Bad request"
        });
      } else {
        console.error("An error has occurred " + err);
        res.status(500).send({
          error: "Internal server error"
        });
      }
    });
  }).catch((err) => {
    console.error("An error has occurred " + err);
    res.status(401).send({
      error: err
    });
  });
}

// Returns the file blob PDF presentation of the specific lecture
function getFile(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    lecturesDb.getOne(req.params._id).then((lecture) => {
      if (lecture === null) {
        res.status(404).send({
          error: "Lecture with the id specified does not exist"
        });
      } else {
        if (lecturer._id == lecture.lecturerId) {
          res.set('Content-Type', 'application/pdf');
          res.set('Content-Disposition', 'attachment; filename="' + lecture.fileName + '"');
          res.set('Access-Control-Expose-Headers', 'Content-Disposition');
          res.send(lecture.file);
        } else {
          res.status(401).send({
            error: "Unauthorized"
          });
        }
      }
    }).catch((err) => {
      console.error("An error has occurred " + err);
      if (err === 400) {
        res.status(400).send({
          error: "Bad request"
        });
      } else {
        res.status(500).send({
          error: "Internal server error"
        });
      }
    });
  }).catch((err) => {
    console.error("An error has occurred " + err);
    res.status(401).send({
      error: err
    });
  });
}

// Deletes a specific lecture based on the _id provided
function deleteLecture(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    lecturesDb._delete(req.params._id, lecturer._id).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      if (err === 401) {
        res.status(401).send({
          error: 'Unauthorized'
        });
      } else if (err === 400) {
        res.status(400).send({
          error: 'Bad request'
        });
      } else if (err === 404) {
        res.status(404).send({
          error: 'Not found'
        });
      } else {
        console.error("An error has occurred: " + err);
        res.status(500).send({
          error: 'Internal server error'
        });
      }
    });
  }).catch((err) => {
    res.status(401).send({
      error: err
    });
  });
}

function newLecture(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    lecturesDb.create(req, lecturer._id).then(() => {
      res.sendStatus(201);
    }).catch((err) => {
      console.error("An error has occured: " + err);
      if (err === "req.file or lecturer_id was null or the mimetype was malformed") {
        res.status(400).send({
          error: 'The file was of wrong type, or was over 15MB'
        });
      } else {
        res.status(500).send({
          error: 'Internal server error'
        });
      }
    });
  }).catch((err) => {
    res.status(401).send({
      error: err
    });
  });
}
