var fs = require('fs');
var scissors = require('scissors');
var Duplex = require('stream').Duplex;

var Slide = require('../models/slide');

var database = {}

database.createFromLecture = createFromLecture;

module.exports = database;

function createFromLecture(lecture) {
  return new Promise((resolve, reject) => {
    if (lecture === null) {
      reject("Parameter lecture was null");
    } else {
      /*
       * 1. Split the PDF into pages
       * 2. Iterate over the pages
       * 3. Extract image and text from each slide
       * 4. Save Slides in the database with the lecture._id provided
       */
      console.log(lecture.file);
      pngStream = scissors(bufferToStream(lecture.file)).pages(1).pngStream(300);
      streamToBuffer(pngStream).then((buffer) => {
        var slide = new Slide({
          lectureId: lecture._id,
          image: buffer,
          text: "This is some text found on the slide",
          isQuiz: false
        });
        slide.save().then((savedSlide) => {
          resolve();
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      });
    }
  });
}

// http://derpturkey.com/buffer-to-stream-in-node/
function bufferToStream(buffer) {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

// http://derpturkey.com/buffer-to-stream-in-node/
function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}
