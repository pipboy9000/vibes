var chalk = require("chalk");

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
    name
}) {
    if (!usersMap[fbid]) {
        var user = {
            name,
            fbid,
            inVibe: "",
            updatedAt: Date.now()
        }
        usersMap[fbid] = user;
        users.push(user);
        return user;
    } else {
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

    vibeId = generateVibeID();
    vibe.id = vibeId;
    vibesMap[vibeId] = vibe;
    vibes.push(vibe);

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
    getComments
};