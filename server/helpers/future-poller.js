var cache = require('./cache');
var db = require('./db');
var piggyBack = require('./piggyback');
const config = require('./config');

function startPolling() {
    setInterval(() => {
        let futureVibes = db.getFutureVibes();
        let user = {
            fbid: "10156492526329808",
            name: "Dan Levin"
        };
        futureVibes.then(result => {
            if (!result) return;
            
            result.forEach(futureVibe => {
                if (Date.parse(futureVibe.date) > new Date().getTime()) return;

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
        }, err => {
            console.error(err);
        })
    }, config.futureVibes.pollingInterval);
}

module.exports = {
    startPolling
};
