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
  timetable: null,

  calendar: {
    startTime: '',
    endTime: '',
    periodDuration: 40,
    breakDuration: 20,
    days: []
  }
};

// =======================
// LOCAL STORAGE
// =======================
function saveToLocal() {
  localStorage.setItem('tt_state', JSON.stringify(state));
}

function loadFromLocal() {
  const data = localStorage.getItem('tt_state');
  if (!data) return;

  state = JSON.parse(data);

  renderSubjects();
  renderStaff();
  renderRooms();
}

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
  saveToLocal();
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
  saveToLocal();
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
  saveToLocal();
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
  saveToLocal();
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
  saveToLocal();
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
  saveToLocal();
}

// =======================
// CALENDAR SAVE
// =======================
function saveCalendar() {
  const checkedDays = Array.from(
    document.querySelectorAll('#page-calendar input[type="checkbox"]:checked')
  ).map(el => el.value);

  state.calendar = {
    startTime: document.getElementById('start-time').value,
    endTime: document.getElementById('end-time').value,
    periodDuration: parseInt(document.getElementById('period-duration').value) || 40,
    breakDuration: parseInt(document.getElementById('break-duration').value) || 20,
    days: checkedDays
  };

  saveToLocal();
}

// =======================
// LOAD CALENDAR
// =======================
function loadCalendar() {
  const cal = state.calendar;
  if (!cal) return;

  document.getElementById('start-time').value = cal.startTime;
  document.getElementById('end-time').value = cal.endTime;
  document.getElementById('period-duration').value = cal.periodDuration;
  document.getElementById('break-duration').value = cal.breakDuration;

  document.querySelectorAll('#page-calendar input[type="checkbox"]').forEach(cb => {
    cb.checked = cal.days.includes(cb.value);
  });
}

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

  const classes = ['Class A'];
  let grid = {};

  const activeDays = state.calendar.days.length
    ? state.calendar.days
    : DAYS;

  const totalPeriods = calculatePeriods();

  classes.forEach(cls => {
    grid[cls] = {};

    activeDays.forEach(day => {
      grid[cls][day] = [];

      for (let i = 0; i < totalPeriods; i++) {
        const subj = state.subjects[Math.floor(Math.random() * state.subjects.length)];

        grid[cls][day].push({
          label: subj.name,
          color: subj.color
        });
      }
    });
  });

  state.timetable = { classes, grid };

  saveToLocal();
  nav('timetable');
  renderTimetable();
}

// =======================
// RENDER TIMETABLE
// =======================
function renderTimetable() {
  if (!state.timetable) return;

  const table = document.getElementById('tt-table');
  const tt = state.timetable;
  const cls = tt.classes[0];

  const activeDays = state.calendar.days.length
    ? state.calendar.days
    : DAYS;

  let html = "<tr><th>Period</th>";

  activeDays.forEach(d => html += `<th>${d}</th>`);
  html += "</tr>";

  for (let i = 0; i < tt.grid[cls][activeDays[0]].length; i++) {
    html += `<tr><td>${i + 1}</td>`;

    activeDays.forEach(d => {
      const slot = tt.grid[cls][d][i];
      html += `<td style="background:${slot.color}22;color:${slot.color}">${slot.label}</td>`;
    });

    html += "</tr>";
  }

  table.innerHTML = html;
}

// =======================
// RESET
// =======================
function resetAll() {
  if (!confirm("Reset everything?")) return;

  localStorage.removeItem('tt_state');

  location.reload();
}

// =======================
// INIT
// =======================
loadFromLocal();
loadCalendar();
