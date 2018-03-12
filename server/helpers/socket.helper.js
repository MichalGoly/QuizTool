var io = require('socket.io');

module.exports = function(server) {
  io = io(server);

  io.on('connection', (socket) => {
    console.log('socket.io connection made');

    socket.on('slide-update', (currentSlide) => {
      console.log("[INFO] Socket.io event: slide-change");
      socket.broadcast.emit('slide-change', {
        img: currentSlide.img,
        sessionCode: currentSlide.sessionCode
      });
    });
  });

  return io;
}
