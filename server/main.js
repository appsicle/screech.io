const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

// import panda from '../client/myapp/src/images/panda.png';
// import gary from '../client/myapp/src/images/gary-snail.jpeg';
// import circle from '../client/myapp/src/images/circle.png';
// import square from '../client/myapp/src/images/square.png';
// import triangle from '../client/myapp/src/images/triangle.png';
// import shrek from '../client/myapp/src/images/shrek.png';
// import flower from '../client/myapp/src/images/flower.png';

app.use(express.static(__dirname + '/../client'));

// function onConnection(socket){
//   socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
// }

// let usernames = [];

// [{username: username, color: colors[counter++ % colors.length]}]
let userInfo = [];
const colors = ['black', 'red', 'green', 'blue', 'yellow', 'gold', 'teal', 'brown', 'dark-orange', 'pink'];
let counter = 0

// let images = [panda, gary, circle, square, triangle, shrek, flower];
// let image = images[Math.floor(Math.random()*images.length)];

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
    // usernames.push(data);
    // io.sockets.emit("listen_for_usernames", usernames);
    userInfo.push({
      username: data,
      color: colors[counter++ % colors.length],
    });
    io.sockets.emit("listen_for_usernames", userInfo);
  })
});