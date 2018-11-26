process.env.MONGO_URL = "mongodb://admin:1qaz1qaz@ds039281.mlab.com:39281/vibes" //TODO: remove

const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cache = require('./helpers/cache');
var piggyBack = require('./helpers/piggyback');

var futureVibesPoller = require('./helpers/future-poller');
futureVibesPoller.startPolling();

var {
  validate
} = require('./helpers/validate');

var port = process.env.PORT || 8080;

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/preview', function (req, res) {
  console.log('preview');
  res.sendfile(__dirname + '/public/mobilePreview.html');
});

io.on('connection', function (socket) {
  console.log('socket connected');
  socket.emit('setVibes', cache.getVibes());

  socket.on('login', function ({
    token,
    location
  }) {
    validate(token).then(user => {
      if (user) {
        user.location = location;
        user = cache.login(user);
        piggyBack.login();

        var data = {
          user,
          users: cache.getUsers(),
          vibes: cache.getVibes(),
        }

        socket.emit('login', data);
      } else {
        console.log("server.js - user credentials invalid");
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
    token,
    inVibe
  }) {
    validate(token).then(user => {
      if (user) {
        vibe = cache.newVibe(vibe, user, inVibe);
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

  socket.on('newPicture', function ({
    picture,
    token
  }) {
    validate(token).then(user => {
      if (user) {
        var pictures = cache.newPicture(picture, user);
        if (pictures) {
          piggyBack.newPicture(picture);
          console.log("set pictures");
          socket.emit('setPictures', pictures);
        }
      }
    })
  });

  socket.on('joinVibe', function ({
    token,
    vibeId
  }) {
    validate(token).then(user => {
      if (user) {
        var success = cache.joinVibe(user, vibeId);
        if (success) {
          piggyBack.joinVibe();
          socket.emit("joinVibe", vibeId);
        }
      }
    })
  });

  socket.on("leaveVibe", function (token) {
    validate(token).then(user => {
      var success = cache.leaveVibe(user);
      if (success) {
        piggyBack.leaveVibe();
        socket.emit("leaveVibe");
      }
    });
  });

  socket.on("getAlbum", function (token) {
    validate(token).then(user => {
      var album = db.getAlbum(user.fbid);
      if (album) {
        piggyBack.leaveVibe();
        socket.emit("setAlbum", album);
      }
    });
  })
});

function checkPiggyBack() {
  if (piggyBack.isFull()) {
    io.emit('setData', piggyBack.getData());
    piggyBack.clear();
  }
}

function clearVibes() {
  if (cache.clear())
    piggyBack.vibeRemoved();
}

server.listen(port, function () {
  console.log('listening on port ' + port);
  setInterval(checkPiggyBack, 5000);
  setInterval(cache.save, 30000); //save cache state
  setInterval(clearVibes, 1000 * 60 * 60);
});