var fs = require('fs');
var scissors = require('scissors');
var Duplex = require('stream').Duplex;
var inspect = require('eyes').inspector({
  maxLength: 20000
});
var pdf_extract = require('pdf-extract');

var Slide = require('../models/slide');

var database = {}

database.createFromLecture = createFromLecture;

module.exports = database;

const TEMP_PRESENTATION = 'temp.pdf';

function createFromLecture(lecture) {
  return new Promise((resolve, reject) => {
    if (lecture === null) {
      reject("Parameter lecture was null");
    } else {
      /*
       * 1. Store the PDF presentation in a temp file on disk
       * 2. Extract text from all the slides and group it into a map where key is the
       *    page number
       * 3. Iterate over the keys of the map and use the page numbers to convert
       *    PDF pages into PNG images
       * 4. Iterate over the map and save all slides into the database
       * 5. Finally, remove the temp PDF file
       */
      fs.writeFile(TEMP_PRESENTATION, lecture.file, 'binary', (err) => {
        if (err) {
          reject(err);
        } else {
          extractSlidesMap(TEMP_PRESENTATION).then((slidesMap) => {
            // 3
            resolve();
          }).catch((err) => {
            // clean up the temp file
            fs.unlink(TEMP_PRESENTATION, (err) => {
              reject(err);
            });
            reject(err);
          });
        }
      });

      // pngStream = scissors(bufferToStream(lecture.file)).pages(1).pngStream(300);
      // streamToBuffer(pngStream).then((buffer) => {
      //   var slide = new Slide({
      //     lectureId: lecture._id,
      //     image: buffer,
      //     text: "This is some text found on the slide",
      //     isQuiz: false
      //   });
      //   slide.save().then((savedSlide) => {
      //     resolve();
      //   }).catch((err) => {
      //     reject(err);
      //   })
      // }).catch((err) => {
      //   reject(err);
      // });
    }
  });
}

function extractSlidesMap(filePath) {
  return new Promise((resolve, reject) => {
    var options = {
      type: 'text'
    };
    var processor = pdf_extract(filePath, options, (err) => {
      if (err) {
        reject(err);
      } else {
        processor.on('complete', (data) => {
          // inspect(data.text_pages, 'extracted text pages');
          // callback(null, data.text_pages);
          console.log(data);
          resolve();
        });
        processor.on('error', (err) => {
          reject(err);
        });
      }
    });
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
