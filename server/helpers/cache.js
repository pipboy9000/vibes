var chalk = require("chalk");

var users = {};
var vibes = {};

function login({
    fbid,
    name
}) {
    if (!users[fbid]) {
        var user = {
            name,
            updatedAt: Date.now()
        }
        users[fbid] = user;
        return user;
    } else {
        return users[fbid];
    }
}

function updateLocation({
    fbid,
    location
}) {
    var user = users[fbid];
    if (user) {
        user.updatedAt = Date.now();
        user.location = location;
        return user;
    } else {
        console.log(chalk.orange("update location: user not found " + fbid));
    }
}

function generateID() {
    var r = Math.round(Math.random() * 1632960 + 46655);
    r = r.toString(36).toUpperCase();
    return r
}

function generateVibeID() {
    var id = generateID();
    while (vibes[id]) {
        id = generateID();
    }
}

function newVibe(vibe, user) {
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

    var id = generateVibeID();
    vibes[id] = vibe;

    return vibe;
}

function newComment(comment, user) {

    var vibe = vibes[comment.vibeId];
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

function getVibes() {
    return vibes;
}

function getUsers() {
    return users;
}

module.exports = {
    newVibe,
    getVibes,
    getUsers,
    login,
    updateLocation,
    newComment
};