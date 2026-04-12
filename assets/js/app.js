import { state, COLORS, DAYS, resetState } from './state.js';
import { addSubject, renderSubjects, removeSubject } from './subjects.js';
// =======================
// GLOBAL STATE
// =======================
const COLORS = ['#185FA5','#3B6D11','#BA7517','#A32D2D','#534AB7','#0F6E56','#993C1D','#993556'];
const ROOM_ICONS = {Classroom:'🏫',Lab:'🔬',Studio:'🎨','Gym / Hall':'🏃','Lecture hall':'🎓',Library:'📖'};
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

let state = {
  inst: 'Nursery',
  subjects: [],
  staff: [],
  rooms: [],
  timetable: null
};

let currentTTClass = null;

// =======================
// NAVIGATION
// =======================
function nav(page, el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');

  document.getElementById('page-title').textContent = page;
}

// =======================
// SUBJECTS
// =======================
function addSubject() {
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

function renderSubjects() {
  const list = document.getElementById('subj-list');

  list.innerHTML = state.subjects.map((s, i) => `
    <div class="item-row">
      <span style="color:${s.color}">●</span>
      ${s.name} (${s.periods})
      <button onclick="removeItem('subjects', ${i})">x</button>
    </div>
  `).join('');
}

// =======================
// STAFF
// =======================
function addStaff() {
  const name = document.getElementById('new-staff').value.trim();
  if (!name) return;

  state.staff.push({ name });

  document.getElementById('new-staff').value = '';

  renderStaff();
}

function renderStaff() {
  const list = document.getElementById('staff-list');

  list.innerHTML = state.staff.map((s, i) => `
    <div class="item-row">
      👤 ${s.name}
      <button onclick="removeItem('staff', ${i})">x</button>
    </div>
  `).join('');
}

// =======================
// ROOMS
// =======================
function addRoom() {
  const name = document.getElementById('new-room').value.trim();
  if (!name) return;

  state.rooms.push({ name });

  document.getElementById('new-room').value = '';

  renderRooms();
}

function renderRooms() {
  const list = document.getElementById('room-list');

  list.innerHTML = state.rooms.map((r, i) => `
    <div class="item-row">
      🏠 ${r.name}
      <button onclick="removeItem('rooms', ${i})">x</button>
    </div>
  `).join('');
}

// =======================
// REMOVE ITEM
// =======================
function removeItem(type, index) {
  state[type].splice(index, 1);

  if (type === 'subjects') renderSubjects();
  if (type === 'staff') renderStaff();
  if (type === 'rooms') renderRooms();
}

// =======================
// GENERATE TIMETABLE
// =======================
function generateTimetable() {
  if (state.subjects.length === 0) {
    alert("Add subjects first");
    return;
  }

  state.timetable = buildDemoTimetable();

  alert("Timetable generated!");
  nav('timetable');
  renderTimetable();
}

// =======================
// DEMO GENERATOR
// =======================
function buildDemoTimetable() {
  const classes = ['Class A', 'Class B'];

  let grid = {};

  classes.forEach(cls => {
    grid[cls] = {};

    DAYS.forEach(day => {
      grid[cls][day] = [];

      for (let i = 0; i < 6; i++) {
        const subj = state.subjects[Math.floor(Math.random() * state.subjects.length)];

        grid[cls][day].push({
          label: subj.name,
          color: subj.color
        });
      }
    });
  });

  return { classes, grid };
}

// =======================
// RENDER TIMETABLE
// =======================
function renderTimetable() {
  if (!state.timetable) return;

  const table = document.getElementById('tt-table');
  const tt = state.timetable;
  const cls = tt.classes[0];

  let html = "<tr><th>Period</th>";

  DAYS.forEach(d => html += `<th>${d}</th>`);
  html += "</tr>";

  for (let i = 0; i < 6; i++) {
    html += `<tr><td>${i + 1}</td>`;

    DAYS.forEach(d => {
      const slot = tt.grid[cls][d][i];
      html += `<td style="background:${slot.color}22;color:${slot.color}">${slot.label}</td>`;
    });

    html += "</tr>";
  }

  table.innerHTML = html;
}

// =======================
// EXPORT (BASIC)
// =======================
function doExport(type) {
  alert("Export " + type + " coming soon");
}

// =======================
// RESET
// =======================
function resetAll() {
  if (!confirm("Reset everything?")) return;

  state = {
    inst: 'Nursery',
    subjects: [],
    staff: [],
    rooms: [],
    timetable: null
  };

  renderSubjects();
  renderStaff();
  renderRooms();
}

// =======================
// SAVE
// =======================
function saveSettings() {
  alert("Settings saved!");
}
// Make subject functions accessible in HTML
window.addSubject = addSubject;
window.removeSubject = removeSubject;
