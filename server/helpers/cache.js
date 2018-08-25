var chalk = require("chalk");
var distance = require("fast-haversine");

var users = [];
var usersMap = {};
var vibes = [];
var vibesMap = {};

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
    if (inVibe) {
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

    vibesMap[vibeId].users.push(user.fbid);

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

module.exports = {
    newVibe,
    getVibes,
    getUsers,
    login,
    updateLocation,
    newComment,
    getComments,
    joinVibe
};