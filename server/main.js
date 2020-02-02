const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 4000;

app.use(express.static(__dirname + '/../client'));

// function onConnection(socket){
//   socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
// }

http.listen(port, () => console.log('listening on port ' + port));

io.on("connection", socket => {
  console.log("a user connected");
  // console.log(socket);

  socket.on("disconnect", function() {
    console.log("A user disconnected");
  });

  socket.on("line", data => {
    console.log(data);
  //   socket.broadcast.emit("message", data);
    // io.emit(data);
    io.sockets.emit("line", data);
  });

  // socket.emit("message", { sender: "Server", msg: "Connected" });
  // socket.emit("message", data);

  //Send a message after a timeout of 4seconds
  // setTimeout(function() {
  //   socket.send("Sent a message 4seconds after connection!");
  // }, 4000);
  //socket.broadcast.emit("hello everyone");
});