const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var axios = require('axios');

var db = require('./db');

var port = process.env.PORT || 3000;

var appId = '1033690713453013';
var appSecret = 'e8408dd116c7abe3d6242969b9bf4b6c';

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

function validate(token) {
  return axios.get('https://graph.facebook.com/debug_token?&input_token=' + token + '&access_token=' + appId + '|' + appSecret)
    .then(res => {
      if (res.data.data.is_valid) {
        return res.data.data.user_id;
      }
    }).catch(err => {
      return false;
    });
}

function setVibes() {
  db.getVibes().then(vibes => {
    io.emit('setVibes', vibes);
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

  socket.on('getVibes', function () {
    db.getVibes().then(vibes => {
      socket.emit('setVibes', vibes);
    })
  });
});

server.listen(port, function () {
  console.log('listening on port ' + port);
  setInterval(setVibes, 5000); //reset vibes list for everyone every 5 seconds
});