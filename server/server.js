const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;

var vibes = [1, 2, 3, 4];

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('socket connected');
  socket.emit('connected');
  socket.emit('setVibes', vibes);
  
  socket.on('getVibes', function () {
    console.log('getVibes');
    socket.emit('setVibes', vibes);
  });
});

server.listen(port, function () {
  console.log('listening on port ' + port)
});