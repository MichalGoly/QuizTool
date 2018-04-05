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

describe('test the dashboard page', () => {

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
          driver.findElement(By.id("more-vert-0")).click().then(() => {
            common.sleep(500).then(() => {
              driver.findElement(By.id("delete-0")).click().then(() => {
                common.sleep(500).then(() => {
                  driver.findElement(By.id("card-title-0")).then((titleElement) => {
                    titleElement.getText().then((text) => {
                      expect(text).to.equal("L2-review-and-parameters.pdf\nmore_vert");
                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it('should prevent from uploading a pdf over 15MB', (done) => {
    driver.findElement(By.id("hello-header")).click().then(() => {
      var filePath = __dirname + '/bin/large.pdf';
      driver.findElement(By.id("input-file-upload")).sendKeys(filePath);
      driver.wait(until.elementLocated(By.id("toast-container")), 3000).then(() => {
        done();
      });
    });
  });

  after((done) => {
    driver.quit();
    done();
  });
});
