const {
  Builder,
  By,
  until
} = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var common = require('./common/common');

describe('test the login page', () => {

  var driver;

  before((done) => {
    driver = new Builder().forBrowser('firefox').forBrowser('chrome').usingServer('http://selenium-hub:4444/wd/hub').build();
    driver.setFileDetector(new remote.FileDetector());
    done();
  });

  it('should upload two lectures and remove the first one', (done) => {
    common.lecturerLogin(driver).then(() => {
      common.fileUpload(driver, "presentation.pdf", 0).then(() => {
        common.fileUpload(driver, "L2-review-and-parameters.pdf", 1).then(() => {
          done();
        });
      });
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
