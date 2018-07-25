import socketio from 'socket.io-client';
import store from '../store';

var io = socketio.connect('localhost:3000');

//from server
io.on('setVibes', vibes => {
  store.dispatch('setVibes', vibes);
});

io.on('newVibe', vibe => {
  store.commit('newVibe', vibe);
});

io.on('setUsers', users => {
  store.dispatch('setUsers', users);
})

//to server
function newVibe(vibe) {
  io.emit('newVibe', vibe);
}

function update(me) {
  io.emit('updateUser', me);
}

function getUsers() {
  io.emit('getUsers');
}

function getVibes() {
  io.emit('getVibes');
}

export default {
  newVibe,
  update
}
