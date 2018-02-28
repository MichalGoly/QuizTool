var rp = require('request-promise');
var Lecturer = require('../models/lecturer');
var authHelper = {}

const GOOGLE_TOKEN_CHECK_URI = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
const GOOGLE_QUIZ_TOOL_ID = '564650356041-pe6cejm0gpl4qqrd9o084mmk456nt4pn.apps.googleusercontent.com';

authHelper.check = check;

function check(req, res) {
  /*
   * 1. Check if request contains the Bearer Authorisation token
   * 2. Check if there is a lecturer with given token in the database
   * 3. If so, resolve lecturer back to the caller
   * 4. Otherwise, ask Google if token is valid and was granted against the Quiz Tool
   * 5. If so, check if user's Google ID in database
   * 6. Yes -> Update lecturer's token in the database and resolve lecturer
   * 7. No -> Should never happen, reject
   */
  return new Promise((resolve, reject) => {
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
  });
}

module.exports = authHelper;

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
// if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//   var jwtToken = req.headers.authorization.split(' ')[1];
//   // console.log("[INFO] jwtToken: " + jwtToken);
//   if (jwtToken === null)
//     res.send(401);
//
//   Lecturer.findOne({
//     token: jwtToken
//   }, function(err, lecturer) {
//     if (err)
//       res.send(500);
//     // console.log("[INFO] lecturer: " + lecturer);
//     if (lecturer === null) {
//       /*
//        * 1. Use google's endpoint to check if token valid and not expired
//        * 2. If so, check if user with the google id already in db
//        * 3. Yes -> Update the token in the databsae
//        * 4. No -> Unauthorized
//        */
//       var options = {
//         uri: 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + jwtToken,
//         headers: {
//           'User-Agent': 'Request-Promise'
//         },
//         json: true // Automatically parses the JSON string in the response
//       };
//       rp(options)
//         .then((res) => {
//           if ("issued_to" in res && "user_id" in res &&
//             res.issued_to === "564650356041-pe6cejm0gpl4qqrd9o084mmk456nt4pn.apps.googleusercontent.com") {
//             Lecturer.findOne({
//               googleId: res.user_id
//             }, (err, lec) => {
//               if (!err && lec !== null) {
//                 // 3
//                 lec.token = jwtToken;
//                 lec.save((err, updatedLecturer) => {
//                   if (!err) {
//                     var clonedLecturer = JSON.parse(JSON.stringify(updatedLecturer));
//                     delete clonedLecturer.token;
//                     res.json(clonedLecturer);
//                   }
//                 });
//               } else {
//                 // 4
//                 console.log("[WARN] User provided a valid token, but does not exist in db. Should only be possible in dev.");
//               }
//             });
//           }
//           res.send(401);
//         }).catch((err) => {
//           res.send(401);
//         });
//     } else {
//       var lect = JSON.parse(JSON.stringify(lecturer));
//       delete lect.token;
//       res.json(lect);
//     }
//   });
// } else {
//   res.send(401);
// }
