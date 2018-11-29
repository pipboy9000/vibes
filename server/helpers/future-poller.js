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

                console.log(`checking future vibe: ${futureVibe.title}`)
                console.log(`lastActivated: ${futureVibe.lastActivated}`)
                console.log(`date: ${futureVibe.date}`)
                console.log(`currentDateTime - Date.parse(futureVibe.lastActivated): ${currentDateTime - Date.parse(futureVibe.lastActivated)}`)
                console.log(`config.futureVibes.minTimeBeforeNextActivation: ${config.futureVibes.minTimeBeforeNextActivation}`)

                if (Date.parse(futureVibe.date) > currentDateTime) {
                    console.log(`failed test: Date.parse(futureVibe.date) > currentDateTime`)
                    return;
                }

                if (futureVibe.lastActivated != null && 
                    currentDateTime - Date.parse(futureVibe.lastActivated) < 
                    config.futureVibes.minTimeBeforeNextActivation) {
                        console.log(`failed test: (futureVibe.lastActivated != null && 
                            currentDateTime - Date.parse(futureVibe.lastActivated) < 
                            config.futureVibes.minTimeBeforeNextActivation)`)
                        return;
                    }

                if (futureVibe.isRecurring && futureVibe.daysRecurring[currentDayIdx] == '0') {
                    console.log(`futureVibe.isRecurring && futureVibe.daysRecurring[currentDayIdx] == '0'`)
                    return;
                }

                console.log('passed all tests. creating vibe.')

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
