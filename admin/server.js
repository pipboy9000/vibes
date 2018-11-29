var db = require("./helpers/db");

const express = require('express');
var app = express();
var cors = require('cors')
app.use(cors())
var port = process.env.PORT || 3030;

function checkUserPasswordInCacheLoadedFromDb() {
    return true;
}

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
  });

app.get('/save-vibe', function (req, res) {
    if (!checkUserPasswordInCacheLoadedFromDb(req)) {
        return res.status(500).send('user authentication failed.');
    }

    var q = req.query;
    db.saveFutureVibe({
        title: q.title,
        lng: q.lng,
        lat: q.lat,
        date: q.date,
        isRecurring: q.isRecurring === 'true',
        daysRecurring: q.daysRecurring,
        lastActivated: null 
    })
    .then(vibeId => res.send({vibeId}))
    .catch(err => {
        console.error(err);
        res.status(500).send(err.toString())
    });
});

app.get('/get-vibes', function (req, res) {
    db.getFutureVibes()
    .then(cursor => cursor.toArray().then(vibes => res.send({vibes})))
    .catch(err => {
        console.error(err);
        res.status(500).send(err.toString())
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))