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
                let currentDate = new Date();
                let currentDateTime = currentDate.getTime();
                let currentDayIdx = currentDate.getDay();
                if (Date.parse(futureVibe.date) > currentDateTime) return;
                if (futureVibe.lastActivated != null && 
                    Date.parse(futureVibe.lastActivated) - currentDateTime < 
                    config.futureVibes.minTimeBeforeNextActivation) return;
                if (futureVibe.isRecurring && futureVibe.daysRecurring[currentDayIdx] == '0') return;

                let vibe = {
                    title: futureVibe.title,
                    location: {
                        lat: parseFloat(futureVibe.lat),
                        lng: parseFloat(futureVibe.lng)
                    },
                    emojis: [null, null, null]
                };
                cache.newVibe(vibe, user, false);
                if (futureVibe.isRecurring) {
                    db.updateFutureVibeActivated(futureVibe._id, currentDate.toISOString());
                }
                else db.removeFutureVibe(futureVibe._id);
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
