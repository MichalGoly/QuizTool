var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../../index');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
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

  it('should update lecture slides', (done) => {
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

            var slides = res.body;
            slides[2].quizType = "single";
            slides[4].quizType = "single";
            slides[5].quizType = "single";
            slides[6].quizType = "single";
            for (var i = 0; i < slides.length; i++) {
              delete slides[i].lectureId;
              delete slides[i].image;
              delete slides[i].text;
              delete slides[i].slideNumber;
            }
            chai.request(app).put('/slides/').set('content-type', 'application/json').send(slides)
              .end((err, res) => {
                res.should.have.status(200);

                chai.request(app).get('/slides/' + lectureId).end((err, res) => {
                  res.should.have.status(200);
                  res.body.length.should.be.eql(11);
                  res.body[5].should.have.property('_id');
                  res.body[5].should.have.property('lectureId').eql(lectureId);
                  res.body[5].should.have.property('image');
                  res.body[5].should.have.property('text');
                  res.body[5].should.have.property('slideNumber').eql(6);
                  for (var i = 0; i < res.body.length; i++) {
                    if (i === 2 || i === 4 || i === 5 || i === 6) {
                      res.body[i].should.have.property('quizType').eql(slides[i].quizType);
                    } else {
                      res.body[i].should.have.property('quizType');
                      assert.isNull(res.body[i]['quizType']);
                    }
                  }
                  done();
                });
              });
          });
        });
      });
  });

  it('should return 400 bad request for a malformed document', (done) => {
    chai.request(app).put('/slides/').set('content-type', 'application/json').send({
      hello: "world"
    }).end((err, res) => {
      res.should.have.status(400);
      done();
    });
  });

  it('should fail', (done) => {
    assert.fail(0, 1, "This is an error");
    done();
  });
});
