const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 4000;

app.use(express.static(__dirname + '/../client'));

// function onConnection(socket){
//   socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
// }

let usernames = [];

http.listen(port, () => console.log('listening on port ' + port));

io.on("connection", socket => {
  let first_time = true;
  socket.on("disconnect", function() {
    console.log("A user disconnected");
  });

  socket.on("line", data => {
    console.log(data);
    if(first_time){
      first_time = false;
    }else{
      io.sockets.emit("line", data);
    }
  });

  socket.on("notify_new_user", data => {
    // console.log(">>", data);
    usernames.push(data);
    io.sockets.emit("listen_for_usernames", usernames);
  })
});