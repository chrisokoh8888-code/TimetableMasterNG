// =======================
// SUBJECTS MODULE
// =======================

import { state, COLORS } from './state.js';

// Add Subject
export function addSubject() {
  const name = document.getElementById('new-subj').value.trim();
  const periods = parseInt(document.getElementById('new-subj-periods').value) || 3;

  if (!name) return;

  state.subjects.push({
    name,
    periods,
    color: COLORS[state.subjects.length % COLORS.length]
  });

  document.getElementById('new-subj').value = '';
  document.getElementById('new-subj-periods').value = '';

  renderSubjects();
}

// Render Subjects
export function renderSubjects() {
  const list = document.getElementById('subj-list');

  list.innerHTML = state.subjects.map((s, i) => `
    <div class="item-row">
      <span style="color:${s.color}">●</span>
      ${s.name} (${s.periods})
      <button onclick="removeSubject(${i})">x</button>
    </div>
  `).join('');
}

// Remove Subject
export function removeSubject(index) {
  state.subjects.splice(index, 1);
  renderSubjects();
}
