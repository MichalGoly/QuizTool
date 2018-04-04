const {
  By,
  until
} = require('selenium-webdriver');
var chai = require('chai');
var expect = chai.expect;

var common = {}

common.lecturerLogin = lecturerLogin;
common.screenshot = screenshot;

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

// https://stackoverflow.com/questions/3422262/take-a-screenshot-with-selenium-webdriver
function screenshot(driver) {
  return new Promise((resolve, reject) => {
    driver.takeScreenshot().then(function(data) {
      var base64Data = data.replace(/^data:image\/png;base64,/, "")
      resolve(base64Data);
    });
  });
}
