import socketio from "socket.io-client";
import store from "../store";
const localConfig = require('./localConfig').default;

/* DONT HARDCODE LOCALHOST HERE!! WERE LIVE##$!@#!! */
var socketAddress = process.env.SOCKET_ADDRESS;
if (localConfig.socketAddress) socketAddress = localConfig.socketAddress;

console.log("env: " + process.env.NODE_ENV)
console.log("process.env.SOCKET_ADDRESS: " + process.env.SOCKET_ADDRESS)
if (process.env.NODE_ENV == 'production') {
  var io = socketio.connect();
} else {
  var io = socketio.connect(socketAddress);
}

//from server
io.on("login", data => store.dispatch("login", data));
io.on("setData", data => {
  store.dispatch("setData", data)
});
io.on("setServerLocation", user => store.dispatch("setServerLocation", user));
io.on("newVibe", vibe => store.dispatch("newVibe", vibe));
io.on("setComments", comments => store.dispatch("setComments", comments));
io.on("joinVibe", vibeId => store.dispatch("joinVibe", vibeId));
io.on("leaveVibe", _ => store.dispatch("leaveVibe"));
io.on("setPictures", pictures => store.dispatch("setPictures", pictures));
io.on("setAlbum", album => store.dispatch("setAlbum", album));
io.on("setVibeFromAlbum", vibe => store.dispatch("setVibeFromAlbum", vibe));

//to server
function getAlbum(token) {
  io.emit("getAlbum", token);
}

function getVibeFromAlbum(id) {
  io.emit("getVibeFromAlbum", id);
}

function newVibe(vibe) {
  io.emit("newVibe", vibe);
}

function login(me) {
  io.emit("login", me);
}

function updateLocation(me) {
  io.emit("updateLocation", me);
}

function newComment(comment) {
  io.emit("newComment", comment);
}

function newPicture(picture) {
  io.emit("newPicture", picture);
}

function joinVibe(vibe) {
  io.emit("joinVibe", vibe);
}

function leaveVibe(token) {
  io.emit("leaveVibe", token);
}

export default {
  newVibe,
  login,
  updateLocation,
  newComment,
  newPicture,
  joinVibe,
  leaveVibe,
  getAlbum,
  getVibeFromAlbum
};
