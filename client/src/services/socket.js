import socketio from 'socket.io-client';
import store from '../store';

var io = socketio.connect('localhost:3000');

//from server
io.on('setVibes', vibes => store.dispatch('setVibes', vibes));
io.on('newVibe', vibe => store.commit('newVibe', vibe));
io.on('setUsers', users => store.dispatch('setUsers', users))
io.on('setUser', user => store.dispatch('setUser', user))
io.on('login', user => store.dispatch('setUser', user))
io.on('updateLocation', user => store.commit('setServerLocation', user))


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

export default {
  newVibe,
  login,
  updateLocation
}
