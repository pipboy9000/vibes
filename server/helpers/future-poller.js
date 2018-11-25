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
            result
            .filter(
                vibe => vibe.isRecurring === 'false' && 
                Date.parse(vibe.date) < new Date().getTime())
            .forEach(futureVibe => {
                let vibe = {
                    title: futureVibe.title,
                    location: {
                        lat: parseFloat(futureVibe.lat),
                        lng: parseFloat(futureVibe.lng)
                    },
                    emojis: [null, null, null]
                };
                cache.newVibe(vibe, user, false);
                db.removeFutureVibe(futureVibe._id);
                piggyBack.newVibe();
            });
        })
    }, 10000);
    // }, 0);
}

module.exports = {
    startPolling
};
