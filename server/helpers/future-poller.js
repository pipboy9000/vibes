var cache = require('./cache');
var db = require('./db');
var piggyBack = require('./piggyback');

function startPolling() {
    setInterval(() => {
    // setTimeout(() => {
        let futureVibes = db.getFutureVibes();
        let user = {
            fbid: "10156492526329808",
            name: "Dan Levin"
        };
        futureVibes.then(result => {
            result.forEach(futureVibe => {
                let vibe = {
                    title: futureVibe.title,
                    location: {
                        lat: parseFloat(futureVibe.lat),
                        lng: parseFloat(futureVibe.lng)
                    },
                    emojis: [null, null, null]
                };
                cache.newVibe(vibe, user, false);
                piggyBack.newVibe();
            });
        })
    }, 2000);
    // }, 0);
}

module.exports = {
    startPolling
};
