var chalk = require("chalk");
var distance = require("fast-haversine");
var fs = require("fs")

var users = [];
var usersMap = {};
var vibes = [];
var vibesMap = {};

var vibeTimout = 1000 * 60 * 90; //1 hour

function save() {
    var data = JSON.stringify({
        users,
        vibes
    });
    fs.writeFile('cache.json', data, function (err) {
        if (err)
            throw err
    })
}

function load() {
    fs.readFile('cache.json', (err, str) => {
        if (err) {
            var data = {};
            return;
        }

        var data = JSON.parse(str);

        if (data.hasOwnProperty("vibes"))
            vibes = data.vibes;

        if (data.hasOwnProperty("users"))
            users = data.users;

        users.forEach(u => {
            usersMap[u.fbid] = u;
        });

        vibes.forEach(v => {
            vibesMap[v.id] = v
        })
    })
}

function generateID() {
    var r = Math.round(Math.random() * 1632960 + 46655);
    r = r.toString(36).toUpperCase();
    return r
}

function generateVibeID() {
    var id = generateID();
    while (vibesMap[id]) {
        id = generateID();
    }
    return id;
}

function login({
    fbid,
    name,
    location,

}) {
    if (!usersMap[fbid]) {
        var user = {
            name,
            fbid,
            inVibe: "",
            location,
            updatedAt: Date.now()
        }
        usersMap[fbid] = user;
        users.push(user);
        return user;
    } else {
        usersMap[fbid].location = location;
        return usersMap[fbid];
    }
}

function updateLocation({
    fbid,
    location
}) {
    var user = usersMap[fbid];
    if (user) {
        user.updatedAt = Date.now();
        user.location = location;
        return user;
    } else {
        console.log(chalk.yellow("update location: user not found " + fbid));
    }
}


function newVibe(vibe, user, inVibe) {
    var now = Date.now();
    vibe.createdAt = now;
    vibe.createdBy = {
        fbid: user.fbid,
        name: user.name
    };
    vibe.users = [user.fbid];
    vibe.lastJoined = now;
    vibe.comments = [];
    vibe.pictures = [];

    vibeId = generateVibeID();
    vibe.id = vibeId;
    vibesMap[vibeId] = vibe;
    vibes.push(vibe);

    //if user was already in a vibe then remove from old vibe
    if (inVibe && vibesMap[inVibe]) {
        removeIdx = vibesMap[inVibe].users.indexOf(user.fbid)
        vibesMap[inVibe].users.splice(removeIdx, 1);
    }

    usersMap[user.fbid].inVibe = vibeId;
    return vibe;
}

function newComment(comment, user) {

    var vibe = vibesMap[comment.vibeId];
    if (!vibe) {
        console.log(chalk.red("new comment: vibe doesn't exist " + comment.vibeId));
        return;
    }

    //check if user is in the vibe
    if (!vibe.users.includes(user.fbid)) {
        console.log(chalk.red("can't comment if not in vibe " + user.fbid));
        return;
    }

    var c = {
        text: comment.text,
        imgUrl: comment.imgUrl,
        name: user.name,
        fbid: user.fbid,
        createdAt: Date.now(),
    }

    vibe.comments.push(c);

    return {
        vibeId: comment.vibeId,
        comments: vibe.comments
    }
}

function joinVibe(user, vibeId) {
    if (!vibesMap[vibeId]) {
        console.log(chalk.red("join vibe - vibe doesn't exists"))
        return
    }


    //chekc if close enough
    var from = {
        lat: vibesMap[vibeId].location.lat,
        lon: vibesMap[vibeId].location.lng
    };

    var to = {
        lat: user.location.lat,
        lon: user.location.lng
    }

    var d = distance(from, to);
    if (d > 50) {
        console.log(chalk.red("can't join vibe, too far"));
        return;
    }

    //leave old vibe
    var oldVibe = usersMap[user.fbid].inVibe
    if (oldVibe) {
        var removeIdx = vibesMap[oldVibe].users.indexOf(user.fbid);
        if (removeIdx >= 0)
            vibesMap[oldVibe].users.splice(removeIdx, 1);
    }

    if (!vibesMap[vibeId].users.includes(user.fbid))
        vibesMap[vibeId].users.push(user.fbid);
    usersMap[user.fbid].inVibe = vibeId;

    return true;
}

function leaveVibe(user) {
    var vibeId = usersMap[user.fbid].inVibe;
    if (!vibesMap[vibeId]) {
        console.log(chalk.red("leave vibe - vibe doesn't exists"))
        return
    }
    user = usersMap[user.fbid];
    var vibe = vibesMap[user.inVibe];
    var removeIdx = vibe.users.indexOf(user.fbid);
    if (removeIdx != -1)
        vibe.users.splice(removeIdx, 1);

    usersMap[user.fbid].inVibe = "";
    return true;
}

function getVibes() {
    return vibes;
}

function getUsers() {
    return users;
}

function getComments(vibeId) {
    return vibesMap[vibeId].comments;
}

function clear() {
    var from = Date.now() - vibeTimout;

    var shouldSave = false;

    //remove from map
    vibes.forEach(v => {
        if (v.lastJoined < from) {
            v.users.forEach(fbid => {
                if (usersMap[fbid])
                    usersMap[fbid].inVibe = "";
            })
            delete vibesMap[v.id];
            shouldSave = true;
        }
    });

    //remove from array
    vibes = vibes.filter(v => {
        return !(v.lastJoined < from)
    })

    //TODO:
    //users - remove only users that are not inside a vibe that have been inactive for time period

    if (shouldSave) {
        console.log('clear true');
        save();
        return true;
    }
    return false;
}

function init() {
    load();
}

init();

module.exports = {
    newVibe,
    getVibes,
    getUsers,
    login,
    updateLocation,
    newComment,
    getComments,
    joinVibe,
    leaveVibe,
    save,
    clear
};