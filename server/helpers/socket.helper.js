var io = require('socket.io');

module.exports = function(server) {
  io = io(server);

  io.on('connection', (socket) => {
    console.log('socket.io connection made');

    socket.on('slide-update', (currentSlide) => {
      console.log("[INFO] Socket.io event: slide-change");
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
        option: answer.option
      });
    });

    socket.on('correct-answer', (answer) => {
      console.log("[INFO] Socket.io event: correct-answer");
      socket.broadcast.emit('correct-received', {
        sessionCode: answer.sessionCode,
        option: answer.option
      });
    })
  });

  return io;
}
