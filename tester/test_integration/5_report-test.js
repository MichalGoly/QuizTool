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

describe('test the report page', () => {

  var driver;

  before((done) => {
    driver = new Builder().forBrowser('firefox').forBrowser('chrome').usingServer('http://selenium-hub:4444/wd/hub').build();
    driver.setFileDetector(new remote.FileDetector());
    done();
  });

  it('should export the report for the lecture session', (done) => {
    /*
     * 1. Open previous sessions page
     * 2. Make sure there's only one historical session to export
     * 3. Download the session as PDF
     */
    done();
  });

  after((done) => {
    driver.quit();
    done();
  });
});
