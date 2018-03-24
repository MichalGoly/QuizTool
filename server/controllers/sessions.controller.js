var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth.helper');
var Validator = require('jsonschema').Validator;
var validator = new Validator();
var NewSessionSchema = require('../schemas/newSession');
var sessionsDb = require('../db/sessions.db');
var lecturesDb = require('../db/lectures.db');

router.post('/', newSession);
router.get('/:_id', getSessions);

module.exports = router;

function newSession(req, res) {
  if (validator.validate(req.body, NewSessionSchema).valid) {
    authHelper.check(req, res).then((lecturer) => {
      sessionsDb.create(req.body).then(() => {
        res.sendStatus(201);
      }).catch((err) => {
        console.error("An error has occurred " + err);
        res.sendStatus(500);
      });
    }).catch((err) => {
      console.error("An error has occurred " + err);
      res.sendStatus(401);
    });
  } else {
    res.sendStatus(400);
  }
};

function getSessions(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    sessionsDb.getByLectureId(req.params._id).then((sessions) => {
      if (sessions === null) {
        res.sendStatus(401);
      } else {
        // make sure caller authorised to access the resource
        lecturesDb.getOne(req.params._id).then((lecture) => {
          if (lecture.lecturerId == lecturer._id) {
            res.send(sessions);
          } else {
            res.sendStatus(401);
          }
        }).catch((err) => {
          console.error("An error has occurred " + err);
          res.sendStatus(500);
        });
      }
    }).catch((err) => {
      console.error("An error has occurred " + err);
      res.sendStatus(500);
    });
  }).catch((err) => {
    console.error("An error has occurred " + err);
    res.sendStatus(401);
  });
}
