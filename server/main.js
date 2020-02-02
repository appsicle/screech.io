const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/../client'));
let userInfo = [];
const colors = ['black', 'red', 'green', 'blue', 'yellow', 'gold', 'teal', 'brown', 'dark-orange', 'pink'];
let counter = 0

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
    userInfo.push({
      username: data,
      color: colors[counter++ % colors.length],
    });
    io.sockets.emit("listen_for_usernames", userInfo);
  })
});