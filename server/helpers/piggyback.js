var cache = require('./cache');

var data = {}

var full = false;

function login() {
    full = true;
    data.users = cache.getUsers();
    data.vibes = cache.getVibes();
}

function newVibe() {
    full = true;
    data.vibes = cache.getVibes();
    data.vibes = cache.getVibes();
}

function updateLocation() {
    full = true;
    data.users = cache.getUsers();
    data.vibes = cache.getVibes();
}

function newComment(comment) {
    full = true
    if (!data.comments)
        data.comments = {};
    data.comments[comment.vibeId] = cache.getComments(comment.vibeId);
}

function newPicture(picture) {
    full = true
    if (!data.pictures)
        data.pictures = {};
    data.pictures[picture.vibeId] = cache.getPictures(picture.vibeId);
}

function joinVibe() {
    full = true;
    data.vibes = cache.getVibes();
    data.users = cache.getUsers();
}

function leaveVibe() {
    full = true;
    data.vibes = cache.getVibes();
    data.users = cache.getUsers();
}

function vibeRemoved() {
    full = true;
    data.vibes = cache.getVibes();
    data.users = cache.getUsers();
}

function clear() {
    full = false;
    data = {};
}

function isFull() {
    return full;
}

function getData() {
    return data;
}

module.exports = {
    isFull,
    newVibe,
    updateLocation,
    newComment,
    newPicture,
    getData,
    login,
    joinVibe,
    leaveVibe,
    vibeRemoved,
    clear
}