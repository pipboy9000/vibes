const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cache = require('./helpers/cache');
var piggyBack = require('./helpers/piggyback');

var {
  validate
} = require('./helpers/validate');

var port = process.env.PORT || 3000;

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('socket connected');
  socket.emit('setVibes', cache.getVibes());

  socket.on('login', function (user) {
    console.log("login: ", user);
    validate(user.token).then(user => {
      if (user) {
        user = cache.login(user);
        piggyBack.login();

        var data = {
          user,
          users: cache.getUsers(),
          vibes: cache.getVibes(),
        }

        socket.emit('login', data);
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
        piggyBack.updateLocation(user);
        socket.emit('setServerLocation', user);
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
        piggyBack.newVibe();
        socket.emit('newVibe', vibe);
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
        if (comments) {
          piggyBack.newComment(comment);
          socket.emit('setComments', comments);
        }
      }
    })
  });
});

function checkPiggyBack() {
  if (piggyBack.isFull()) {
    console.log('send piggyBack');
    io.emit('setData', piggyBack.getData());
    piggyBack.clear();
  }
}

server.listen(port, function () {
  console.log('listening on port ' + port);
  setInterval(checkPiggyBack, 5000);
});