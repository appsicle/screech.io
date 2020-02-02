const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 4000;

app.use(express.static(__dirname + '/../client'));
let userInfo = [];
const colors = ['red', 'blue', 'lime', 'teal', 'brown', 'dark-orange', 'pink'];
let counter = 0

http.listen(port, () => console.log('listening on port ' + port));

const connectedSockets = new Set();

io.on("connection", socket => {
  console.log("A user connected");

  connectedSockets.add(socket);
  let first_time = true;
  socket.on("disconnect", function(s) {
    console.log("A user disconnected");
    connectedSockets.delete(s);
    // io.sockets.emit("remove_user", );
  });

  

  socket.on("line", data => {
    // console.log(data);
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
    // console.log(JSON.stringify(userInfo, null, 2));
    io.sockets.emit("listen_for_usernames", userInfo);
  })

  socket.on("get_color", username => {
    console.log("aidshfldskfj>>>", username);
    console.log(userInfo);


    userInfo.forEach((user)=>{
      console.log(user);
      if(user.username === username){
        socket.emit("get_color", user.color);
        console.log("found", user.color);
      }
    });
  })

  socket.on("game_start", data => {
    io.sockets.emit("game_start", data);
  })

  socket.on("get_usernames", data => {
    // console.log(JSON.stringify(userInfo, null, 2));
    io.sockets.emit("listen_for_usernames", userInfo);
  })

  socket.on("kill", data => {
    function getConnectedSockets() {
      return Array.from(connectedSockets);
    }
  
    getConnectedSockets().forEach(function(s) {
        s.disconnect(true);
    });
    userInfo = [];
    counter = 0;
  })

  console.log("a user connected");
});