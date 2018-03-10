var rp = require('request-promise');
var Lecturer = require('../models/lecturer');
var authHelper = {}

const GOOGLE_TOKEN_CHECK_URI = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
const GOOGLE_QUIZ_TOOL_ID = '564650356041-pe6cejm0gpl4qqrd9o084mmk456nt4pn.apps.googleusercontent.com';

authHelper.check = check;

function check(req, res) {
  /*
   * 0. Check if authorisation disabled for testing and return mock lecturer
   * 1. Check if request contains the Bearer Authorisation token
   * 2. Check if there is a lecturer with given token in the database
   * 3. If so, resolve lecturer back to the caller
   * 4. Otherwise, ask Google if token is valid and was granted against the Quiz Tool
   * 5. If so, check if user's Google ID in database
   * 6. Yes -> Update lecturer's token in the database and resolve lecturer
   * 7. No -> Should never happen, reject
   */
  return new Promise((resolve, reject) => {
    if (process.env.AUTH_DISABLED === 'true') {
      Lecturer.findOne({
        token: "token123"
      }).then((bob) => {
        resolve(bob);
      }).catch((err) => {
        reject(err);
      });
    } else {
      // 1
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        var jwtToken = req.headers.authorization.split(' ')[1];
        if (jwtToken === null)
          reject("jwtToken was null");
        Lecturer.findOne({
          token: jwtToken
        }).then((data) => {
          if (data === null) {
            // 4
            var options = {
              uri: GOOGLE_TOKEN_CHECK_URI + jwtToken,
              headers: {
                'User-Agent': 'Request-Promise'
              },
              json: true // Automatically parses the JSON string in the response
            };
            rp(options).then((res) => {
              if ("issued_to" in res && "user_id" in res && res.issued_to === GOOGLE_QUIZ_TOOL_ID) {
                // 5
                Lecturer.findOne({
                  googleId: res.user_id
                }).then((lecturer) => {
                  // 6
                  lecturer.token = jwtToken;
                  lecturer.save((err, updatedLecturer) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(updatedLecturer);
                    }
                  });
                }).catch((err) => {
                  reject(err);
                });
              } else {
                reject("Token invalid");
              }
            }).catch((err) => {
              reject(err);
            });
          } else {
            // 3
            resolve(data);
          }
        }).catch((err) => {
          reject(err);
        });
      } else {
        reject("The Authorization Bearer token is missing, or is malformed!");
      }
    }
  });
}

module.exports = authHelper;
