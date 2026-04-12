// =======================
// GLOBAL STATE
// =======================

const COLORS = [
  '#185FA5','#3B6D11','#BA7517','#A32D2D',
  '#534AB7','#0F6E56','#993C1D','#993556'
];

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

let state = {
  inst: 'Nursery',
  subjects: [],
  staff: [],
  rooms: [],
  timetable: null
};

// =======================
// NAVIGATION
// =======================
function nav(page, el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById('page-' + page);
  if (!target) return;

  target.classList.add('active');
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
      <button onclick="removeSubject(${i})">x</button>
    </div>
  `).join('');
}

function removeSubject(index) {
  state.subjects.splice(index, 1);
  renderSubjects();
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
      <button onclick="removeStaff(${i})">x</button>
    </div>
  `).join('');
}

function removeStaff(index) {
  state.staff.splice(index, 1);
  renderStaff();
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
      <button onclick="removeRoom(${i})">x</button>
    </div>
  `).join('');
}

function removeRoom(index) {
  state.rooms.splice(index, 1);
  renderRooms();
}
/* 👉 ADD IT HERE 👇 */
// =======================
// CALCULATE PERIODS
// =======================
function calculatePeriods() {
  const cal = state.calendar;

  if (!cal.startTime || !cal.endTime) return 6;

  const start = new Date(`1970-01-01T${cal.startTime}:00`);
  const end = new Date(`1970-01-01T${cal.endTime}:00`);

  const totalMinutes = (end - start) / (1000 * 60);

  const period = cal.periodDuration || 40;
  const breakTime = cal.breakDuration || 0;

  const block = period + breakTime;

  return Math.floor(totalMinutes / block);
}

// =======================
// GENERATE TIMETABLE
// =======================
function generateTimetable() {
  if (state.subjects.length === 0) {
    alert("Add subjects first");
    return;
  }

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

  state.timetable = { classes, grid };

  nav('timetable');
  renderTimetable();
}

function calculatePeriods() {
  const cal = state.calendar;

  if (!cal.startTime || !cal.endTime) return 6;

  const start = new Date(`1970-01-01T${cal.startTime}:00`);
  const end = new Date(`1970-01-01T${cal.endTime}:00`);

  const totalMinutes = (end - start) / (1000 * 60);

  const period = cal.periodDuration || 40;
  const breakTime = cal.breakDuration || 0;

  const block = period + breakTime;

  return Math.floor(totalMinutes / block);
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
// EXPORT
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
