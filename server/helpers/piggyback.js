var cache = require('./cache');

var data = {}

var full = false;

function login() {
    full = true;
    data.users = cache.getUsers();
}

function newVibe() {
    full = true;
    data.vibes = cache.getVibes();
}

function updateLocation() {
    full = true;
    data.users = cache.getUsers();
}

function newComment(comment) {
    full = true
    if (!data.comments)
        data.comments = {};
    data.comments[comment.vibeId] = cache.getComments(comment.vibeId);
}

function clear() {
    full = false;
    data = {}
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
    getData,
    login,
    clear
}