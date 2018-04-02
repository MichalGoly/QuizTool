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

  after((done) => {
    driver.quit();
    done();
  });
});
