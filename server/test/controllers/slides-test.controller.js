var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../../index');
var assert = chai.assert;
var should = chai.should();
var Lecturer = require('../../models/lecturer');
var Lecture = require('../../models/lecture');
var Slide = require('../../models/slide');

chai.use(chaiHttp);

describe('test slides controller', () => {
  before((done) => {
    /*
     * 1. Make sure db clean
     * 2. Mock lecturer
     * 3. Disable authentication checks for testing
     */
    Lecturer.remove({}, (err) => {
      Lecture.remove({}, (err) => {
        Slide.remove({}, (err) => {
          var bob = new Lecturer({
            googleId: "google123",
            name: "Bob Smith",
            token: "token123"
          });
          bob.save().then((lecturer) => {
            process.env['AUTH_DISABLED'] = 'true';
            done();
          }).catch((err) => {
            assert.fail(0, 1, err);
            done();
          });
        });
      });
    });
  });

  after((done) => {
    Lecturer.remove({}, (err) => {
      Lecture.remove({}, (err) => {
        Slide.remove({}, (err) => {
          delete process.env['AUTH_DISABLED'];
          done();
        });
      });
    });
  });

  it('should return 400 when trying to list slides for an invalid lecture id', (done) => {
    chai.request(app).get('/slides/123123').end((err, res) => {
      res.should.have.status(400);
      done();
    });
  });
});
