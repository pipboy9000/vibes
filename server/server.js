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

//TODO: do we really need sqrt?
function getDistance(c1, c2) {
  var dx = c2.lat - c1.lat;
  var dy = c2.lng - c1.lng;

  var d = Math.hypot(dx, dy);
  console.log(d);
  return d;
}

function joinVibe() {

}

function newVibe() {

}

function setVibes() {
  db.getVibes().then(vibes => {
    io.emit('setVibes', vibes);
  });
}

function setUsers() {
  db.getUsers().then(users => {
    console.log(users.length + ' users connected');
    users.map(u => console.log(u));
    io.emit('setUsers', users);
  });
}

io.on('connection', function (socket) {
  console.log('socket connected');
  db.getVibes().then(vibes => {
    socket.emit('setVibes', vibes);
  });


  socket.on('login', function (user) {
    console.log("login: ", user);
    validate(user.token).then(user => {
      if (user) {
        db.login(user).then(user => socket.emit('setUser', user));
      } else {
        console.log("user credentials invalid");
      }
    });
  });

  socket.on('updateLocation', function ({
    token,
    location
  }) {
    console.log('update location')
    validate(token).then(user => {
      if (user) {
        user.location = location
        db.updateLocation(user).then(user => {
          socket.emit('setUser', user);
        })
      }
    });
  });

  socket.on('newVibe', function ({
    vibe,
    token
  }) {
    validate(token).then(user => {
      if (user) {
        db.newVibe(vibe, user).then(vibe => {
          socket.emit('newVibe', vibe);
        })
      }
    });
  });

  socket.on('newComment', function ({
    comment,
    token
  }) {
    validate(token).then(user => {
      if (user) {
        db.newComment(comment, user).then(comments => {
          socket.emit('setComments', comments);
        })
      }
    })
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
  setInterval(setUsers, 15000);
});