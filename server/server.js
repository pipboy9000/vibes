const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var db = require('./helpers/db');
var cache = require('./helpers/cache');

var {
  validate
} = require('./helpers/validate');

var port = process.env.PORT || 3000;

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

function setVibes() {
  io.emit('setVibes', cache.getVibes());
  // db.getVibes().then(vibes => {
  //   io.emit('setVibes', vibes);
  // });
}

function setUsers() {
  io.emit('setUsers', cache.getUsers());
  // db.getUsers().then(users => {
  //   console.log(users.length + ' users connected');
  //   users.map(u => console.log(u));
  //   io.emit('setUsers', users);
  // });
}

io.on('connection', function (socket) {
  console.log('socket connected');
  socket.emit('setVibes', cache.getVibes());

  // db.getVibes().then(vibes => {
  //   socket.emit('setVibes', vibes);
  // });


  socket.on('login', function (user) {
    console.log("login: ", user);
    validate(user.token).then(user => {
      if (user) {
        user = cache.login(user);
        socket.emit('setUser', user);

        // db.login(user).then(user => socket.emit('setUser', user));
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
        user = cache.updateLocation(user);
        socket.emit('setServerLocation', user);
        // db.updateLocation(user).then(user => {
        //   socket.emit('setServerLocation', user);
        // })
      }
    });
  });

  socket.on('newVibe', function ({
    vibe,
    token
  }) {
    validate(token).then(user => {
      if (user) {
        vibe = cache.newVibe(vibe, user)
        socket.emit('newVibe', vibe);

        // db.newVibe(vibe, user).then(vibe => {
        //   socket.emit('newVibe', vibe);
        // })
      }
    });
  });

  socket.on('newComment', function ({
    comment,
    token
  }) {
    validate(token).then(user => {
      if (user) {
        var comments = cache.newComment(comment, user);
        socket.emit('setComments', comments);

        // db.newComment(comment, user).then(comments => {
        //   socket.emit('setComments', comments);
        // })
      }
    })
  });

  socket.on('getVibes', function () {
    socket.emit('setVibes', cache.getVibes());
    // db.getVibes().then(vibes => {
    //   socket.emit('setVibes', vibes);
    // })
  });

  socket.on('getUsers', function () {
    socket.emit('setUsers', cache.getUsers());
    // db.getUsers().then(users => {
    //   socket.emit('setUsers', users);
    // })
  });
});

server.listen(port, function () {
  console.log('listening on port ' + port);
  setInterval(setVibes, 15000); //reset vibes list for everyone every 5 seconds
  setInterval(setUsers, 5000);
});