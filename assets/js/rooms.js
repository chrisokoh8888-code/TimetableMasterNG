import { state } from '../data/state.js';
// =======================
// ROOMS MODULE
// =======================

import { state } from './state.js';

// Add Room
export function addRoom() {
  const name = document.getElementById('new-room').value.trim();
  if (!name) return;

  state.rooms.push({ name });

  document.getElementById('new-room').value = '';

  renderRooms();
}

// Render Rooms
export function renderRooms() {
  const list = document.getElementById('room-list');

  list.innerHTML = state.rooms.map((r, i) => `
    <div class="item-row">
      🏠 ${r.name}
      <button onclick="removeRoom(${i})">x</button>
    </div>
  `).join('');
}

// Remove Room
export function removeRoom(index) {
  state.rooms.splice(index, 1);
  renderRooms();
}
