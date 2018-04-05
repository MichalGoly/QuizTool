const {
  Builder,
  By,
  until
} = require('selenium-webdriver');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('test the login page', () => {

  var driver;

  before((done) => {
    driver = new Builder().forBrowser('firefox').forBrowser('chrome').usingServer('http://selenium-hub:4444/wd/hub').build();
    done();
  });

  it('should render the login page', (done) => {
    driver.get('http://client').then(() => {
      driver.getTitle().then((title) => {
        expect(title).to.equal("Quiz Tool");
        done();
      });
    });
  });

  it('should login as student', (done) => {
    driver.get('http://client').then(() => {
      driver.findElement(By.id("session-input")).then((inputElement) => {
        inputElement.sendKeys("6d2nd25af");
        driver.findElement(By.id("student-login-btn")).click().then(() => {
          driver.wait(until.elementLocated(By.id("brand-logo")), 3000).then(() => {
            driver.findElement(By.id("brand-logo")).then((logo) => {
              logo.getText().then((text) => {
                expect(text).to.equal("Quiz Tool (session 6d2nd25af)");
                done();
              });
            });
          });
        });
      });
    });
  });

  it('should login as a lecturer', (done) => {
    driver.get('http://client').then(() => {
      driver.findElement(By.xpath("//a[@href='#lecturer']")).click().then(() => {
        driver.findElement(By.id("lecturer-login-btn")).click().then(() => {
          driver.wait(until.elementLocated(By.id("hello-header")), 3000).then(() => {
            driver.findElement(By.id("hello-header")).then((header) => {
              header.getText().then((text) => {
                expect(text).to.equal("Hello, Bob Smith! Your lectures:");
                done();
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

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
