// =======================
// STAFF MODULE
// =======================

import { state } from '../data/state.js';

// Add Staff
export function addStaff() {
  const name = document.getElementById('new-staff').value.trim();
  if (!name) return;

  state.staff.push({ name });

  document.getElementById('new-staff').value = '';

  renderStaff();
}

// Render Staff
export function renderStaff() {
  const list = document.getElementById('staff-list');

  list.innerHTML = state.staff.map((s, i) => `
    <div class="item-row">
      👤 ${s.name}
      <button onclick="removeStaff(${i})">x</button>
    </div>
  `).join('');
}

// Remove Staff
export function removeStaff(index) {
  state.staff.splice(index, 1);
  renderStaff();
}
