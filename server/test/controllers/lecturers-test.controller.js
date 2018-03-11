var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../../index');
var assert = chai.assert;
var should = chai.should();

chai.use(chaiHttp);

describe('test lecturers controller', () => {
  it('should return 401 for an unauthorised request', (done) => {
    chai.request(app).get('/lecturers/logged-in').end((err, res) => {
      res.should.have.status(401);
      done();
    });
  });

  it('should return 401 for a fake JWT token', (done) => {
    chai.request(app).get('/lecturers/logged-in')
      .set('Authorization', 'Bearer verySecureJwtToken123').end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
