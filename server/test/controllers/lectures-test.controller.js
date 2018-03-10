var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../../index');
var assert = chai.assert;
var should = chai.should();
// var supertest = require('supertest');
// var request = supertest('localhost');
var Lecturer = require('../../models/lecturer');
var Lecture = require('../../models/lecture');
var Slide = require('../../models/slide');

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
      res.body.length.should.be.eql(1);
      res.body[0].should.have.property('_id');
      res.body[0].should.have.property('googleId').eql('google123');
      res.body[0].should.have.property('name').eql('Bob Smith');
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
    // request.post('/lectures').attach('file', __dirname + '/../bin/presentation.pdf').end((err, res) => {
    //   console.log(res);
    //   res.should.have.status(201);
    //   done();
    // });
    chai.request(app).post('/lectures').attach('file', __dirname + '/../bin/presentation.pdf')
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
});









//







//




//
