import socketio from "socket.io-client";
import store from "../store";

//developement 
var socketAddress = process.env.SOCKET_ADDRESS;

 var socketAddress = "https://vibes-web.herokuapp.com";
//var socketAddress = "http://172.16.0.95:8080";
// var port = 80;
//socketAdress = socketAdress.replace(port, "8080");
// var io = socketio.connect(socketAdress);
// var io = socketio.connect("localhost:8080");



//prod
console.log("env: " + process.env.NODE_ENV)
console.log("process.env.SOCKET_ADDRESS: " + process.env.SOCKET_ADDRESS)
if (process.env.NODE_ENV == 'production') {
  var io = socketio.connect(socketAddress);
} else {
  var io = socketio.connect(socketAddress);
}

//from server
io.on("login", data => store.dispatch("login", data));
io.on("setData", data => store.dispatch("setData", data));
io.on("setServerLocation", user => store.dispatch("setServerLocation", user));
io.on("newVibe", vibe => store.dispatch("newVibe", vibe));
io.on("setComments", comments => store.dispatch("setComments", comments));
io.on("joinVibe", vibeId => store.dispatch("joinVibe", vibeId));
io.on("leaveVibe", _ => store.dispatch("leaveVibe"));
io.on("setPictures", pictures => store.dispatch("setPictures", pictures));
io.on("setAlbum", album => store.dispatch("setAlbum", album));

//to server
function getAlbum(me) {
  io.emit("getAlbum", me);
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
  leaveVibe
};
