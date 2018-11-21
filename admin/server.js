process.env.MONGO_URL = "mongodb://admin:1qaz1qaz@ds039281.mlab.com:39281/vibes"
var db = require("./helpers/db");

const express = require('express');
var app = express();
var cors = require('cors')
app.use(cors())
var port = process.env.PORT || 3030;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
  });

app.get('/save-vibe', function (req, res) {
    var q = req.query;
    db.saveFutureVibe({
        title: q.title,
        lng: q.lng,
        lat: q.lat,
        date: q.date
    }).then(vibeId => res.send({vibeId}));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))