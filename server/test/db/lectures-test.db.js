var chai = require('chai');
var assert = chai.assert;
var app = require('../../index');
var lecturesDb = require('../../db/lectures.db');
var Lecture = require('../../models/lecture');

describe('clean up', () => {
  beforeEach((done) => {
    Lecture.remove({}, (err) => {
      done();
    });
  })
});

describe('test lecturers.db', () => {
  it('should get return an error when retrieving lectures with non existing lecturer id', (done) => {
    lecturesDb.getAll('foo123').then((lectures) => {
      assert.fail(1, 0, 'lecturesDb was supposed to throw an error for non existing lecturer id');
    }).catch((err) => {
      done();
    });
  });
});
