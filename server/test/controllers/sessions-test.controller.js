var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../../index');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
var Lecturer = require('../../models/lecturer');
var Lecture = require('../../models/lecture');
var Slide = require('../../models/slide');
var Session = require('../../models/session');

chai.use(chaiHttp);

describe('test sessions controller', () => {
  before((done) => {
    /*
     * 1. Make sure db clean
     * 2. Mock lecturer
     * 3. Disable authentication checks for testing
     */
    Lecturer.remove({}, (err) => {
      Lecture.remove({}, (err) => {
        Slide.remove({}, (err) => {
          Session.remove({}, (err) => {
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
  });

  after((done) => {
    Lecturer.remove({}, (err) => {
      Lecture.remove({}, (err) => {
        Slide.remove({}, (err) => {
          Session.remove({}, (err) => {
            delete process.env['AUTH_DISABLED'];
            done();
          });
        });
      });
    });
  });

  it('should return 404 when trying to list all sessions', (done) => {
    chai.request(app).get('/sessions').end((err, res) => {
      res.should.have.status(404);
      done();
    });
  });

  it('should return 400 for a malformed session object', (done) => {
    chai.request(app).post('/sessions').set('content-type', 'application/json').send({
      coffee: "is life"
    }).end((err, res) => {
      res.should.have.status(400);
      done();
    });
  })

});
