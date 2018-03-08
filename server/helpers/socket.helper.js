var io = require('socket.io');

module.exports = function(server) {
  io = io(server);

  io.on('connection', (socket) => {
    console.log('socket.io connection made');

    socket.on('slide-update', (currentSlide) => {
      console.log("[INFO] Socket.io event: slide-change");
      socket.broadcast.emit('slide-change', {
        img: currentSlide.img
      });
    });

    //
    // socket.on('event1', (data) => {
    //   console.log(data.msg);
    // });
    //
    // socket.emit('event2', {
    //   msg: 'Server to client, do you read me? Over.'
    // });
    //
    // socket.on('event3', (data) => {
    //   console.log(data.msg);
    //   socket.emit('event4', {
    //     msg: 'Loud and clear :)'
    //   });
    // });
    //
    // socket.on('send-message', (message) => {
    //   console.log("[INFO] send-message event received. Message: " + message.text);
    //   socket.broadcast.emit('message-received', {
    //     text: message.text
    //   });
    // });
  });

  return io;
}
