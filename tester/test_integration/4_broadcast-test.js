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

describe('test the broadcast page', () => {

  var driver;
  var studentDriver1;
  var studentDriver2;
  var studentDriver3;

  before((done) => {
    driver = new Builder().forBrowser('firefox').forBrowser('chrome').usingServer('http://selenium-hub:4444/wd/hub').build();
    studentDriver1 = new Builder().forBrowser('firefox').forBrowser('chrome').usingServer('http://selenium-hub:4444/wd/hub').build();
    studentDriver2 = new Builder().forBrowser('firefox').forBrowser('chrome').usingServer('http://selenium-hub:4444/wd/hub').build();
    studentDriver3 = new Builder().forBrowser('firefox').forBrowser('chrome').usingServer('http://selenium-hub:4444/wd/hub').build();
    driver.setFileDetector(new remote.FileDetector());
    done();
  });

  it('should prepare lecture for broadcast', (done) => {
    /*
     * 1. Upload lecture
     * 2. Mark slides as quizes
     */
    common.lecturerLogin(driver).then(() => {
      common.fileUpload(driver, "L2-review-and-parameters.pdf", 1).then(() => {
        driver.findElement(By.id("edit-1")).click().then(() => {
          driver.wait(until.elementLocated(By.id("edit-header-0")), 3000).then(() => {
            // 2
            driver.findElement(By.xpath("//label[@for='truefalse-2']")).click().then(() => {
              driver.findElement(By.xpath("//label[@for='multi-3']")).click().then(() => {
                driver.findElement(By.xpath("//label[@for='single-4']")).click().then(() => {
                  driver.findElement(By.id("save-btn")).click().then(() => {
                    driver.wait(until.elementLocated(By.id("edit-0")), 3000).then(() => {
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

  it('should broadcast lecture to 3 students', (done) => {
    /*
     * 1. Start broadcast
     * 2. Keep track of the session code
     * 3. Open 3 tabs and join as students using the session code provided
     * 4. Open lecturer tab
     * 5. Broadcast next slide
     * 6. Make sure students received the new slide
     * 7. Navigate to the first quiz
     * 8. Make students answer
     * 9. Make sure students' answers are visible by lecturer
     * 10. Restart the quiz to let students answer again
     * 11. Answer again
     * 12. Mark the correct answer
     * 13. Navigate to the next slide
     * 14. Let students answer
     * 15. Navigate to the next slide without specifying the correct answer
     * 16. End the broadcast
     */
    driver.findElement(By.id("broadcast-1")).click().then(() => {
      driver.wait(until.elementLocated(By.id("broadcast-header")), 3000).then(() => {
        driver.findElement(By.id("broadcast-header")).then((header) => {
          header.getText().then((headerText) => {
            expect(headerText).to.include("L2-review-and-parameters.pdf, session:");
            // 2
            var sessionCode = headerText.split(" ").slice(-1);
            common.joinAsStudentNewTab(studentDriver1, sessionCode).then(() => {
              common.joinAsStudentNewTab(studentDriver2).then(() => {
                common.joinAsStudentNewTab(studentDriver3).then(() => {
                  // 4
                  common.screenshot(driver).then((img) => {
                    console.log(img);
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
    studentDriver1.quit();
    studentDriver2.quit();
    studentDriver3.quit();
    done();
  });
});
