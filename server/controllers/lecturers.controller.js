var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth-helper');
var Lecturer = require('../models/lecturer');

router.get('/logged-in', getLoggedIn);
router.get('/', getLecturers);

module.exports = router;

// Returns the currently logged in lecturer, without the token
function getLoggedIn(req, res) {
  authHelper.check(req, res).then((data) => {
    var lecturer = JSON.parse(JSON.stringify(data));
    delete lecturer.token;
    return res.json(lecturer);
  }).catch((err) => {
    console.error(err);
    return res.send(401);
  });
};

function getLecturers(req, res) {
  Lecturer.find((err, lecturers) => {
    if (err) {
      res.send("Error: " + err);
    } else {
      res.send(lecturers);
    }
  });
};
