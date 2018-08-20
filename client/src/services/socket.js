import socketio from 'socket.io-client';
import store from '../store';

var io = socketio.connect('localhost:3000');

//from server
io.on('setVibes', vibes => store.dispatch('setVibes', vibes));
io.on('newVibe', vibe => store.commit('newVibe', vibe));
io.on('setUsers', users => store.dispatch('setUsers', users));
io.on('setUser', user => store.dispatch('setUser', user));
io.on('setServerLocation', user => store.commit('setServerLocation', user));
io.on('setComments', comments => store.commit('setComments', comments));

//to server
function newVibe(vibe) {
  io.emit('newVibe', vibe);
}

function login(me) {
  io.emit('login', me);
}

function updateLocation(me) {
  io.emit('updateLocation', me);
}

function newComment(comment) {
  io.emit('newComment', comment);
}

export default {
  newVibe,
  login,
  updateLocation,
  newComment
}
