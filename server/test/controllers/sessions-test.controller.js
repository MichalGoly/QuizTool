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
  });

  it('should create a session and associate it with a lecture', (done) => {
    chai.request(app).post('/lectures').attach('file', __dirname + '/../bin/presentation.pdf')
      .end((err, res) => {
        res.should.have.status(201);
        Lecture.find({}).then((lectures) => {
          var lect = lectures[0];
          assert.equal(lect["fileName"], "presentation.pdf");
          Slide.find({
            lectureId: lect._id
          }).then((slides) => {
            slides[1].quizType = "single";
            slides[1].save().then((slide1) => {
              slides[3].quizType = "multi";
              slides[3].save().then((slide3) => {
                slide1_id = slide1._id;
                slide3_id = slide3._id;
                const newSession = {
                  lectureId: lect._id,
                  date: Date("Sat Mar 24 2018 08:47:09 GMT+0000 (GMT)"),
                  answers: {
                    slide1_id: {
                      "B": 10,
                      "C": 1,
                      "correct": "C"
                    },
                    slide3_id: {
                      "A": 2,
                      "AB": 20,
                    }
                  }
                };
                chai.request(app).post('/sessions').set('content-type', 'application/json').send(newSession).end((err, res) => {
                  res.should.have.status(201);
                  console.log("[BOCIAN] " + lect._id);
                  chai.request(app).get('/sessions/' + lect._id).end((err, res) => {
                    res.should.have.status(200);
                    res.body.length.should.be.eql(1);
                    res.body[0].should.have.property('_id');
                    res.body[0].should.have.property('lectureId').eql(lect._id.toString());
                    res.body[0].should.have.property('answers').eql({
                      slide1_id: {
                        "B": 10,
                        "C": 1,
                        "correct": "C"
                      },
                      slide3_id: {
                        "A": 2,
                        "AB": 20,
                      }
                    });
                    res.body[0].should.have.property('date');
                    done();
                  });
                });
              }).catch((err) => {
                assert.fail(0, 1, err);
                done();
              })
            }).catch((err) => {
              assert.fail(0, 1, err);
              done();
            });
          }).catch((err) => {
            assert.fail(0, 1, err);
            done();
          });
        }).catch((err) => {
          assert.fail(0, 1, err);
          done();
        });
      });
  });

});
