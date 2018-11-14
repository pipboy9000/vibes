process.env.MONGO_URL = "mongodb://admin:1qaz1qaz@ds039281.mlab.com:39281/vibes"
var db = require("../server/helpers/db");

const express = require('express');
var app = express();
var cors = require('cors')
app.use(cors())
var port = 3030;


app.get('/save-vibe', function (req, res) {
    var q = req.query;
    db.saveFutureVibe({
        title: q.title,
        x: q.x,
        y: q.y,
        date: q.date
    }).then(result => res.send('result: '+result));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))