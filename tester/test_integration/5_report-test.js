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
    common.lecturerLogin(driver).then(() => {
      driver.findElement(By.id("more-vert-1")).click().then(() => {
        common.sleep(500).then(() => {
          driver.findElement(By.id("sessions-1")).click().then(() => {
            driver.wait(until.elementLocated(By.id("report-header")), 3000).then(() => {
              driver.findElement(By.id("report-header")).then((header) => {
                header.getText().then((headerText) => {
                  expect(headerText).to.equal("L2-review-and-parameters.pdf sessions");
                  driver.findElement(By.id("export-0")).click().then(() => {
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

  after((done) => {
    driver.quit();
    done();
  });
});
