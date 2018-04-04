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
      driver.findElement(By.id("hello-header")).click().then(() => {
        var filePath = __dirname + '/bin/presentation.pdf';
        driver.findElement(By.id("input-file-upload")).sendKeys(filePath);
        driver.wait(until.elementLocated(By.id("card-0")), 50000).then(() => {
          driver.findElement(By.id("card-title-0")).then((titleElement) => {
            titleElement.getText().then((text) => {
              expect(text).to.equal("presentation.pdf\nmore_vert");
              done();
            });
          });
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
