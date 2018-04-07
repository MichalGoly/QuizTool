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

describe('test the edit page', () => {

  var driver;

  before((done) => {
    driver = new Builder().forBrowser('firefox').forBrowser('chrome').usingServer('http://selenium-hub:4444/wd/hub').build();
    driver.setFileDetector(new remote.FileDetector());
    done();
  });

  it('should mark slides as quizes', (done) => {
    /*
     * 1. Edit the lecture
     * 2. Mark some slides as quizes
     * 3. Click the 'back' button to diregard the changes
     * 4. Edit the lecture again
     * 5. Mark one slide as a quiz
     * 6. Hit save
     * 7. Open the Lecture again
     * 8. Make sure the changes have been preserved
     */
    common.lecturerLogin(driver).then(() => {
      driver.wait(until.elementLocated(By.id("edit-0")), 3000).then(() => {
        driver.findElement(By.id("edit-0")).click().then(() => {
          driver.wait(until.elementLocated(By.id("edit-header-0")), 3000).then(() => {
            driver.findElement(By.xpath("//label[@for='single-9']")).click().then(() => {
              driver.findElement(By.id("back-btn")).click().then(() => {
                driver.wait(until.elementLocated(By.id("edit-0")), 3000).then(() => {
                  driver.findElement(By.id("edit-0")).click().then(() => {
                    driver.wait(until.elementLocated(By.id("edit-header-0")), 3000).then(() => {
                      driver.findElement(By.xpath("//label[@for='multi-10']")).click().then(() => {
                        driver.findElement(By.id("save-btn")).click().then(() => {
                          driver.wait(until.elementLocated(By.id("edit-0")), 3000).then(() => {
                            driver.findElement(By.id("edit-0")).click().then(() => {
                              driver.wait(until.elementLocated(By.id("edit-header-0")), 3000).then(() => {
                                driver.findElement(By.id("single-0")).isSelected().then((isSelected0) => {
                                  expect(isSelected0).to.equal(false);
                                  driver.findElement(By.id("single-9")).isSelected().then((isSelected9) => {
                                    expect(isSelected9).to.equal(false);
                                    driver.findElement(By.id("multi-10")).isSelected().then((isSelected10) => {
                                      expect(isSelected10).to.equal(true);
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
