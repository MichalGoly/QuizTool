var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth.helper');
var lecturesDb = require('../db/lectures.db');
var slidesDb = require('../db/slides.db');
var Slide = require('../models/slide');
var Validator = require('jsonschema').Validator;
var validator = new Validator();
var BulkSlideUpdateSchema = require('../schemas/bulkSlideUpdate');

router.get('/:lecture_id', getSlides);
router.put('/', bulkUpdateQuiz);

module.exports = router;

function getSlides(req, res) {
  authHelper.check(req, res).then((lecturer) => {
    lecturesDb.getOne(req.params.lecture_id).then((lecture) => {
      if (lecturer._id == lecture.lecturerId) {
        slidesDb.getByLectureId(lecture._id).then((slides) => {
          var out = [];
          for (var i = 0; i < slides.length; i++) {
            out.push({
              _id: slides[i]._id,
              lectureId: slides[i].lectureId,
              image: slides[i].image.toString('base64'),
              text: slides[i].text,
              quizType: slides[i].quizType,
              slideNumber: slides[i].slideNumber
            });
          }
          res.send(out);
        }).catch((err) => {
          console.error("An error has occurred: " + err);
          res.status(500).send({
            error: err
          });
        });
      } else {
        res.status(401).send({
          error: "Unauthorized"
        });
      }
    }).catch((err) => {
      if (err === 400) {
        res.status(400).send({
          error: "Bad request, lectureId malformed"
        });
      } else {
        console.error("An error has occurred: " + err);
        res.status(500).send({
          error: err
        });
      }
    });
  }).catch((err) => {
    res.status(401).send({
      error: "Unauthorized"
    });
  });
}

// Bulk updates quizType of the slides provided
function bulkUpdateQuiz(req, res) {
  if (validator.validate(req.body, BulkSlideUpdateSchema).valid) {
    authHelper.check(req, res).then((lecturer) => {
      slidesDb.bulkUpdateQuiz(req.body).then(() => {
        res.sendStatus(200);
      }).catch((err) => {
        console.error("An error has occurred: " + err);
        res.status(500).send({
          error: "Internal server error"
        });
      });
    }).catch((err) => {
      res.status(401).send({
        error: "Unauthorized"
      });
    });
  } else {
    res.status(400).send({
      error: "Bad request"
    });
  }
}
