const {
  By,
  until,
  Builder
} = require('selenium-webdriver');
var chai = require('chai');
var expect = chai.expect;

var common = {}

common.lecturerLogin = lecturerLogin;
common.fileUpload = fileUpload;
common.joinAsStudentNewTab = joinAsStudentNewTab;
common.screenshot = screenshot;
common.sleep = sleep;

module.exports = common;

function lecturerLogin(driver) {
  return new Promise((resolve, reject) => {
    driver.get('http://client').then(() => {
      driver.findElement(By.xpath("//a[@href='#lecturer']")).click().then(() => {
        driver.findElement(By.id("lecturer-login-btn")).click().then(() => {
          driver.wait(until.elementLocated(By.id("hello-header")), 3000).then(() => {
            driver.findElement(By.id("hello-header")).then((header) => {
              header.getText().then((text) => {
                expect(text).to.equal("Hello, Bob Smith! Your lectures:");
                resolve();
              });
            });
          });
        });
      });
    });
  });
}

/*
 * @param driver - The seleniu driver
 * @param fileName - the name of the presentation file to upload
 * @param lectureIndex - The expected index of the Lecture card rendered once upload finished
 */
function fileUpload(driver, fileName, lectureIndex) {
  return new Promise((resolve, reject) => {
    driver.findElement(By.id("hello-header")).click().then(() => {
      var filePath = __dirname + '/../bin/' + fileName;
      driver.findElement(By.id("input-file-upload")).sendKeys(filePath);
      driver.wait(until.elementLocated(By.id("card-" + lectureIndex)), 60000).then(() => {
        driver.findElement(By.id("card-title-" + lectureIndex)).then((titleElement) => {
          titleElement.getText().then((text) => {
            expect(text).to.equal(fileName + "\nmore_vert");
            resolve();
          });
        });
      });
    });
  });
}

function joinAsStudentNewTab(studentDriver, sessionCode) {
  return new Promise((resolve, reject) => {
    studentDriver.get('http://client/lecture/' + sessionCode).then(() => {
      studentDriver.getTitle().then((title) => {
        expect(title).to.equal("Quiz Tool");
        resolve();
      });
    });
  });
}

// https://stackoverflow.com/questions/3422262/take-a-screenshot-with-selenium-webdriver
function screenshot(driver) {
  return new Promise((resolve, reject) => {
    driver.takeScreenshot().then(function(data) {
      var base64Data = data.replace(/^data:image\/png;base64,/, "")
      resolve(base64Data);
    });
  });
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
