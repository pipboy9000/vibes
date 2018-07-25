const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var db = require('./helpers/db');
var {
  validate
} = require('./helpers/validate');

var port = process.env.PORT || 3000;

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

function setVibes() {
  db.getVibes().then(vibes => {
    io.emit('setVibes', vibes);
  });
}

function setUsers() {
  db.getUsers().then(users => {
    console.log(users.length + ' users connected');
    users.map(u => console.log(JSON.stringify(u)));
    io.emit('setUsers', users);
  });
}

io.on('connection', function (socket) {
  console.log('socket connected');
  db.getVibes().then(vibes => {
    socket.emit('setVibes', vibes);
  });

  socket.on('newVibe', function (vibe) {
    validate(vibe.token).then(uid => {
      if (uid) {
        db.newVibe(vibe, uid).then(vibe => {
          socket.emit('newVibe', vibe);
        })
      } else {
        console.log("user credentials invalid");
      }
    });
  });

  socket.on('updateUser', function (user) {
    validate(user.token, user.fbid).then(isValid => {
      if (isValid) {
        user.updatedAt = Date.now();
        db.updateUser(user);
      } else {
        console.log("user credentials invalid");
      }
    });
  });

  socket.on('getVibes', function () {
    db.getVibes().then(vibes => {
      socket.emit('setVibes', vibes);
    })
  });

  socket.on('getUsers', function () {
    db.getUsers().then(users => {
      socket.emit('setUsers', users);
    })
  });
});

server.listen(port, function () {
  console.log('listening on port ' + port);
  setInterval(setVibes, 15000); //reset vibes list for everyone every 5 seconds
  setInterval(setUsers, 4000);
});