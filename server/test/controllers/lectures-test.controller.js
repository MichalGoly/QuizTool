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

describe('test lectures controller', () => {
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

  it('should return mocked lectuer', (done) => {
    chai.request(app).get('/lecturers/logged-in').end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.property('_id');
      res.body.should.have.property('googleId').eql('google123');
      res.body.should.have.property('name').eql('Bob Smith');
      res.body.should.not.have.property('token');
      done();
    });
  });

  it('should return an empty list lectures for the mocked user', (done) => {
    chai.request(app).get('/lectures').end((err, res) => {
      res.should.have.status(200);
      res.body.length.should.be.eql(0);
      done();
    });
  });

  it('should create a lecture and split it into slides', (done) => {
    chai.request(app).post('/lectures').attach('file', __dirname + '/../bin/presentation.pdf')
      .end((err, res) => {
        res.should.have.status(201);

        chai.request(app).get('/lectures').end((err, res) => {
          res.should.have.status(200);
          res.body.length.should.be.eql(1);
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('lecturerId');
          res.body[0].should.have.property('fileName', 'presentation.pdf');
          res.body[0].should.not.have.property('file');

          var lectureId = res.body[0]['_id'];
          chai.request(app).get('/slides/' + lectureId).end((err, res) => {
            res.should.have.status(200);
            res.body.length.should.be.eql(11);
            res.body[5].should.have.property('_id');
            res.body[5].should.have.property('lectureId').eql(lectureId);
            res.body[5].should.have.property('image');
            res.body[5].should.have.property('text');
            expect(res.body[5]['text']).to.have.string('• Table names are pluralized by default...');
            res.body[5].should.have.property('quizType');
            assert.isNull(res.body[5]['quizType']);
            res.body[5].should.have.property('slideNumber').eql(6);
            done();
          });
        });
      });
  });

  it('should return 400 when trying to get a lecture by an invalid id', (done) => {
    chai.request(app).get('/lectures/123').end((err, res) => {
      res.should.have.status(400);
      done();
    });
  });

  it('should return 404 when trying to get a lecture which does not exist', (done) => {
    chai.request(app).get('/lectures/41224d776a326fb40f000001').end((err, res) => {
      res.should.have.status(404);
      done();
    });
  });

  it('should get lecture by id', (done) => {
    Lecture.find({}).then((lectures) => {
      chai.request(app).get('/lectures/' + lectures[0]._id).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('_id').eql(lectures[0]._id + "");
        res.body.should.have.property('lecturerId').eql(lectures[0].lecturerId);
        res.body.should.have.property('fileName').eql(lectures[0].fileName);
        res.body.should.not.have.property('file');
        done();
      });
    }).catch((err) => {
      assert.fail(0, 1, err);
      done();
    })
  });

  it('should return 400 when removing a lecture by an invalid id', (done) => {
    chai.request(app).delete('/lectures/4324').end((err, res) => {
      res.should.have.status(400);
      done();
    });
  });

  it('should return 404 when removing a non existent lecture', (done) => {
    chai.request(app).delete('/lectures/41224d776a326fb40f000001').end((err, res) => {
      res.should.have.status(404);
      done();
    });
  });

  it('should remove lecture and slides when valid id and user authorized', (done) => {
    Lecture.find({}).then((lectures) => {
      var lecture_id = lectures[0]._id;
      chai.request(app).delete('/lectures/' + lecture_id).end((err, res) => {
        res.should.have.status(200);
        Slide.find({
          lectureId: lecture_id
        }).then((slides) => {
          assert.isEmpty(slides);
          done();
        }).catch((err) => {
          assert.fail(1, 0, err);
          done();
        });
      });
    }).catch((err) => {
      assert.fail(1, 0, err);
      done();
    });
  });

  it('should remove lecture, slides and sessions when valid id and user authorized', (done) => {
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

                    chai.request(app).delete('/lectures/' + lect._id).end((err, res) => {
                      res.should.have.status(200);
                      Slide.find({
                        lectureId: lect._id
                      }).then((slides) => {
                        assert.isEmpty(slides);
                        Session.find({
                          lectureId: lect._id
                        }).then((sessions) => {
                          assert.isEmpty(sessions);
                          done();
                        }).catch((err) => {
                          assert.fail(1, 0, err);
                          done();
                        });
                      }).catch((err) => {
                        assert.fail(1, 0, err);
                        done();
                      });
                    });
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

  it('should download a pdf file in the original format', (done) => {
    chai.request(app).post('/lectures').attach('file', __dirname + '/../bin/presentation.pdf')
      .end((err, res) => {
        res.should.have.status(201);

        chai.request(app).get('/lectures').end((err, res) => {
          res.should.have.status(200);
          res.body.length.should.be.eql(1);
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('lecturerId');
          res.body[0].should.have.property('fileName', 'presentation.pdf');
          res.body[0].should.not.have.property('file');

          chai.request(app).get('/lectures/' + res.body[0]._id + '/file').end((err, res) => {
            res.should.have.status(200);
            res.should.have.property('type').eql('application/pdf');
            res.headers.should.have.property('content-length').eql('162794');
            done();
          });
        });
      });
  });

  it('should return 400 when trying to download a file with an invalid or non existent id', (done) => {
    chai.request(app).get('/lectures/coffee1234coffee/file').end((err, res) => {
      res.should.have.status(400);

      chai.request(app).get('/lectures/41224d776a326fb40f000001/file').end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });

});
