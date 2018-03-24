var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth.helper');
var Validator = require('jsonschema').Validator;
var validator = new Validator();
var NewSessionSchema = require('../schemas/newSession');
var sessionsDb = require('../db/sessions.db');

router.post('/', newSession);

module.exports = router;

function newSession(req, res) {
  if (validator.validate(req.body, NewSessionSchema).valid) {
    authHelper.check(req, res).then((lecturer) => {
      sessionsDb.create(req.body).then(() => {
        res.sendStatus(201);
      }).catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
    }).catch((err) => {
      res.sendStatus(401);
    });
  } else {
    res.sendStatus(400);
  }
};
