const {
  Builder,
  By,
  until
} = require('selenium-webdriver');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var common = require('./common/common');

describe('test the login page', () => {

  var driver;

  before((done) => {
    driver = new Builder().forBrowser('firefox').forBrowser('chrome').usingServer('http://selenium-hub:4444/wd/hub').build();
    done();
  });

  it('should login as a lecturer', (done) => {
    common.lecturerLogin(driver).then(() => {
      done();
    });
  });

  after((done) => {
    driver.quit();
    done();
  });
});

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
