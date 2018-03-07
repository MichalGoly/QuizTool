var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth.helper');
var lecturesDb = require('../db/lectures.db');
var slidesDb = require('../db/slides.db');

var Slide = require('../models/slide');

router.get('/:lecture_id', getSlides);

function getSlides(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    lecturesDb.getOne(req.params.lecture_id).then((lecture) => {
      if (lecturer._id == lecture.lecturerId) {
        slidesDb.getByLectureId(lecture._id).then((slides) => {
          res.send(slides);
        }).catch((err) => {
          console.error("An error has occurred: " + err);
          res.send(500);
        });
      } else {
        res.send(401);
      }
    }).catch((err) => {
      console.error("An error has occurred: " + err);
      res.send(500);
    });
  }).catch((err) => {
    res.send(401);
  });
}

module.exports = router;
