var io = require('socket.io');

// In memory store for the current slides accross the sessions
var currentSlides = {};

module.exports = function(server) {
  io = io(server);

  io.on('connection', (socket) => {
    console.log('socket.io connection made');
    socket.on('slide-update', (currentSlide) => {
      /*
       * 1. Check if session over
       * 2. If so, remove from the currentSlides
       * 3. Else, store in currentSlides in-memory store
       * 4. Emit the currentSlide to everyone
       */
      console.log("[INFO] Socket.io event: slide-change");
      if (currentSlide.img === null) {
        // session over, remove from the store
        if (currentSlides.hasOwnProperty(currentSlide.sessionCode)) {
          delete currentSlides["sessionCode"];
        }
      } else {
        currentSlides[currentSlide.sessionCode] = currentSlide;
      }
      socket.broadcast.emit('slide-change', {
        img: currentSlide.img,
        text: currentSlide.text,
        quizType: currentSlide.quizType,
        sessionCode: currentSlide.sessionCode
      });
    });

    socket.on('answer-sent', (answer) => {
      console.log("[INFO] Socket.io event: answer-sent");
      socket.broadcast.emit('answer-received', {
        sessionCode: answer.sessionCode,
        options: answer.options
      });
    });

    socket.on('correct-answer', (answer) => {
      console.log("[INFO] Socket.io event: correct-answer");
      socket.broadcast.emit('correct-received', {
        sessionCode: answer.sessionCode,
        options: answer.options
      });
    });

    socket.on('current-slide-request', (request) => {
      console.log("[INFO] Socket.io event: current-slide-request");
      if (currentSlides.hasOwnProperty(request.sessionCode)) {
        socket.emit('current-slide-received', currentSlides[request.sessionCode]);
      }
    });
  });

  return io;
}
