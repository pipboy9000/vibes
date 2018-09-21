import socketio from "socket.io-client";
import store from "../store";

//developement 
// var socketAdress = "https://vibes-web.herokuapp.com";
// var socketAdress = "http://192.168.14.60:8080";
// var port = 80;
//socketAdress = socketAdress.replace(port, "8080");
// var io = socketio.connect(socketAdress);
var io = socketio.connect("localhost:8080");

//prod
// var io = socketio.connect();

//from server
io.on("login", data => store.dispatch("login", data));
io.on("setData", data => store.dispatch("setData", data));
io.on("setServerLocation", user => store.dispatch("setServerLocation", user));
io.on("newVibe", vibe => store.dispatch("newVibe", vibe));
io.on("setComments", comments => store.dispatch("setComments", comments));
io.on("joinVibe", vibeId => store.dispatch("joinVibe", vibeId));
io.on("leaveVibe", _ => store.dispatch("leaveVibe"));

//to server
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
  joinVibe,
  leaveVibe
};
