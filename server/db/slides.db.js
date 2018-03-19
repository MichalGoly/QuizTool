var fs = require('fs');
var path = require('path');
var Duplex = require('stream').Duplex;
var inspect = require('eyes').inspector({
  maxLength: 20000
});
var pdf_extract = require('pdf-extract');
var pdf2img = require('pdf2img');
pdf2img.setOptions({
  type: 'png',
  size: 1024,
  density: 400,
  outputdir: __dirname + path.sep + 'pdf2img_output',
  outputname: 'test', // output file name, dafault null (if null given, then it will create image name same as input name)
  page: null // convert selected page, default null (if null given, then it will convert all pages)
});

var Slide = require('../models/slide');

var database = {}

database.createFromLecture = createFromLecture;
database.getByLectureId = getByLectureId;
database.bulkUpdateQuiz = bulkUpdateQuiz;
database.updateQuiz = updateQuiz;

module.exports = database;

const TEMP_PRESENTATION = 'temp.pdf';

function createFromLecture(lecture) {
  return new Promise((resolve, reject) => {
    if (lecture === null) {
      reject("Parameter lecture was null");
    } else {
      /*
       * 1. Store the PDF presentation in a temp file on disk
       * 2. Extract text from all slides
       * 3. Extract images from all slides
       * 4. Group the extracted data into Slide models
       * 5. Bulk insert all into the database
       * 6. Clean up the temp PDF file and resolve
       */
      fs.writeFile(TEMP_PRESENTATION, lecture.file, 'binary', (err) => {
        if (err) {
          reject(err);
        } else {
          extractSlidesTextArray(TEMP_PRESENTATION).then((slidesTextArr) => {
            // 3
            pdf2img.convert(TEMP_PRESENTATION, (err, info) => {
              if (err || info === undefined || !info.hasOwnProperty('result') || info['result'] !== 'success' ||
                !info.hasOwnProperty('message')) {
                // clean up the temp file
                fs.unlink(TEMP_PRESENTATION, (err2) => {
                  if (err2) {
                    console.error(err2);
                  }
                  reject(err);
                });
              } else {
                var promisesQueue = [];
                var slidesImagesArr = info['message'];
                for (var i = 0; i < slidesImagesArr.length; i++) {
                  promisesQueue.push(convertImageToBuffer(slidesImagesArr[i]));
                }
                Promise.all(promisesQueue).then((images) => {
                  // 4
                  console.log("[INFO] all extract image promises resolved");
                  var slides = [];
                  for (var j = 0; j < slidesTextArr.length; j++) {
                    slides.push(new Slide({
                      lectureId: lecture._id,
                      image: images[j],
                      text: slidesTextArr[j],
                      isQuiz: false,
                      slideNumber: j + 1
                    }));
                  }
                  Slide.insertMany(slides).then((docs) => {
                    console.log("Inserted " + docs.length + " slides");
                    // clean up the temp file from disk and resolve
                    fs.unlink(TEMP_PRESENTATION, (err2) => {
                      if (err2) {
                        console.error(err2);
                      }
                      resolve();
                    });
                  }).catch((err) => {
                    // clean up the temp file
                    fs.unlink(TEMP_PRESENTATION, (err2) => {
                      if (err2) {
                        console.error(err2);
                      }
                      reject(err);
                    });
                  });
                }).catch((err) => {
                  // clean up the temp file
                  fs.unlink(TEMP_PRESENTATION, (err2) => {
                    if (err2) {
                      console.error(err2);
                    }
                    reject(err);
                  });
                });
              }
            });
          }).catch((err) => {
            // clean up the temp file
            fs.unlink(TEMP_PRESENTATION, (err2) => {
              if (err2) {
                console.error(err2);
              }
              reject(err);
            });
          });
        }
      });
    }
  });
}

// Returns the list of slides for the specified lecture and sorts them according
// to slide numbers
function getByLectureId(lecture_id) {
  return new Promise((resolve, reject) => {
    Slide.find({
      lectureId: lecture_id
    }).sort({
      slideNumber: 'ascending'
    }).then((slides) => {
      resolve(slides);
    }).catch((err) => {
      reject(err);
    });
  });
}

function bulkUpdateQuiz(slides) {
  return new Promise((resolve, reject) => {
    if (slides === null) {
      reject("Parameter slides was null");
    } else if (slides.length === null) {
      reject("Parameter slides.length was null");
    } else {
      /*
       * 1. Iterate over the slides
       * 2. For each, update the existing slide with data provided
       */
      var promisesQueue = [];
      for (var i = 0; i < slides.length; i++) {
        promisesQueue.push(updateQuiz(slides[i]));
      }
      Promise.all(promisesQueue).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    }
  });
}

// updates a single slide in the database
function updateQuiz(slide) {
  return new Promise((resolve, reject) => {
    if (slide === null) {
      reject("Parameter slide was null");
    } else {
      Slide.findById(slide._id, (err, s) => {
        if (err) {
          reject(err);
        } else {
          s.isQuiz = slide.isQuiz;
          s.save((err, updatedSlide) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }
      });
    }
  });
}

function extractSlidesTextArray(filePath) {
  return new Promise((resolve, reject) => {
    /*
     * 1. Use pdf_extract to extract text from each slide
     */
    var options = {
      type: 'text',
    };
    var processor = pdf_extract(filePath, options, (err) => {
      if (err) {
        reject(err);
      } else {
        processor.on('complete', (data) => {
          var slides = [];
          for (var i = 0; i < data.text_pages.length; i++) {
            slides.push(data.text_pages[i]);
          }
          resolve(slides);
        });
        processor.on('error', (err) => {
          reject(err);
        });
      }
    });
  });
}

function convertImageToBuffer(slideImageOnDisk) {
  return new Promise((resolve, reject) => {
    if (slideImageOnDisk === null) {
      reject("Parameter slideImageOnDisk was null");
    } else if (slideImageOnDisk === undefined) {
      reject("Parameter slideImageOnDisk was undefined");
    } else if (!slideImageOnDisk.hasOwnProperty("path")) {
      reject("Parameter slideImageOnDisk is malformed and missed the path property");
    } else {
      /*
       * 1. Read the image from the path provided into a Buffer
       * 2. Remove the file from disk
       * 3. Resolve the in-memory image
       */
      fs.readFile(slideImageOnDisk['path'], (err, img) => {
        if (err) {
          reject(err);
        } else {
          fs.unlink(slideImageOnDisk['path'], (err2) => {
            if (err2) {
              console.warn("[WARN] Failed to remove the temp image from disk: " + err2);
            }
            resolve(img);
          });
        }
      });
    }
  });
}
