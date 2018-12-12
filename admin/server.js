var db = require("./helpers/db");

const express = require('express');
var app = express();
var cors = require('cors')
app.use(cors())
var port = process.env.PORT || 3030;
let adminUsers = {}; 

db.getAdminCredentials().then(users => 
    {
        let usersArr = [];
        users.forEach(x => {
            usersArr[x.user] = {pass: x.password}
        });
        adminUsers = usersArr;
    });

function authenticateUser(req) {
    return adminUsers[req.query.user] && adminUsers[req.query.user].pass === req.query.password;
}

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
  });

app.get('/auth', function (req, res) {
    if (!authenticateUser(req)) {
        return res.status(403).send('user authentication failed.');
    } else {
        return res.status(200).send();
    }
});

app.get('/save-vibe', function (req, res) {
    if (!authenticateUser(req)) {
        return res.status(500).send('user authentication failed.');
    }

    var q = req.query;
    db.saveFutureVibe({
        title: q.title,
        location: {
            lng: q.lng,
            lat: q.lat,
        },
        date: q.date,
        time: q.time,
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
    if (!authenticateUser(req)) {
        return res.status(500).send('user authentication failed.');
    }

    db.getFutureVibes()
    .then(cursor => cursor.toArray().then(vibes => res.send({vibes})))
    .catch(err => {
        console.error(err);
        res.status(500).send(err.toString())
    });
});

app.get('/get-past-vibes', function (req, res) {
    if (!authenticateUser(req)) {
        return res.status(500).send('user authentication failed.');
    }

    db.getPastVibes(req.query.date)
    .then(cursor => cursor.toArray().then(vibes => res.send({vibes})))
    .catch(err => {
        console.error(err);
        res.status(500).send(err.toString())
    });
});

app.get('/delete-vibe', function (req, res) {
    if (!authenticateUser(req)) {
        return res.status(500).send('user authentication failed.');
    }

    db.removeFutureVibe(req.query.id)
    .then(res.send({}))
    .catch(err => {
        console.error(err);
        res.status(500).send(err.toString())
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))