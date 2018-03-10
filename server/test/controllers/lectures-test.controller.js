var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../../index');
var assert = chai.assert;
var should = chai.should();
var Lecturer = require('../../models/lecturer');

chai.use(chaiHttp);

describe('test lectures controller', () => {
  before((done) => {
    /*
     * 1. Make sure db clean
     * 2. Mock lecturer
     * 3. Disable authentication checks for testing
     */
    Lecturer.remove({}, (err) => {
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

  after((done) => {
    Lecturer.remove({}, (err) => {
      delete process.env['AUTH_DISABLED'];
      done();
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
});
