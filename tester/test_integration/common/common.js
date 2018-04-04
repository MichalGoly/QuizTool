const {
  By,
  until
} = require('selenium-webdriver');
var chai = require('chai');
var expect = chai.expect;

var common = {}

common.lecturerLogin = lecturerLogin;

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
