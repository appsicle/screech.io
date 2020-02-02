const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 4000;

app.use(express.static(__dirname + '/../client'));

http.listen(port, () => console.log('listening on port ' + port));

io.on("connection", socket => {
  socket.on("disconnect", function() {
    console.log("A user disconnected");
  });

  socket.on("line", data => {
    io.sockets.emit("line", data);
  });

 
});