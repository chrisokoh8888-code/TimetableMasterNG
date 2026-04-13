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
  classes: [],
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
  renderClasses();
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

  if (page === 'structure') {
    renderStructureForm();
    renderClasses();
  }
}

// =======================
// INSTITUTION
// =======================
function setInstitution(type) {
  state.inst = type;
  saveToLocal();
  alert(type + " selected");
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
  if (!list) return;

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
// STAFF (UPDATED)
// =======================
function addStaff() {
  const name = document.getElementById('new-staff').value.trim();
  if (!name) return;

  state.staff.push({
    name,
    subjects: [] // 🔥 NEW
  });

  document.getElementById('new-staff').value = '';

  renderStaff();
  saveToLocal();
}

function renderStaff() {
  const list = document.getElementById('staff-list');
  if (!list) return;

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
  if (!list) return;

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
// STRUCTURE (UNCHANGED)
// =======================
// (kept exactly as you wrote)

// =======================
// CALCULATE PERIODS
// =======================
// (unchanged)

// =======================
// GENERATE TIMETABLE (UPDATED)
// =======================
function generateTimetable() {
  if (state.subjects.length === 0) {
    alert("Add subjects first");
    return;
  }

  const classes = state.classes.length ? state.classes : ['Class A'];
  const activeDays = state.calendar.days.length ? state.calendar.days : DAYS;
  const totalPeriods = calculatePeriods();

  let grid = {};

  classes.forEach(cls => {
    grid[cls] = {};

    let weeklyPool = [];

    state.subjects.forEach(subj => {
      for (let i = 0; i < subj.periods; i++) {
        weeklyPool.push(subj);
      }
    });

    weeklyPool = weeklyPool.sort(() => Math.random() - 0.5);

    let poolIndex = 0;

    activeDays.forEach(day => {
      grid[cls][day] = [];

      let lastSubject = null;
      let subjectCount = {};

      for (let i = 0; i < totalPeriods; i++) {

        if (poolIndex >= weeklyPool.length) {
          poolIndex = 0;
        }

        let subj = weeklyPool[poolIndex];
        let attempts = 0;

        while (
          (subj.name === lastSubject ||
          (subjectCount[subj.name] || 0) >= 2) &&
          attempts < 10
        ) {
          poolIndex = (poolIndex + 1) % weeklyPool.length;
          subj = weeklyPool[poolIndex];
          attempts++;
        }

        // 🔥 TEACHER ASSIGNMENT
        const teacher = state.staff.find(t =>
          t.subjects && t.subjects.includes(subj.name)
        );

        grid[cls][day].push({
          label: subj.name,
          color: subj.color,
          teacher: teacher ? teacher.name : "N/A"
        });

        subjectCount[subj.name] = (subjectCount[subj.name] || 0) + 1;
        lastSubject = subj.name;

        poolIndex++;
      }
    });
  });

  state.timetable = { classes, grid };

  saveToLocal();
  nav('timetable');
  renderTimetable();
}

// =======================
// RENDER TIMETABLE (UPDATED)
// =======================
function renderTimetable() {
  if (!state.timetable) return;

  const table = document.getElementById('tt-table');
  const tt = state.timetable;

  const activeDays = state.calendar.days.length ? state.calendar.days : DAYS;

  let html = "";

  tt.classes.forEach(cls => {

    html += `
      <tr>
        <td colspan="${activeDays.length + 1}" style="
          font-weight:bold;
          background:#0d47a1;
          color:white;
          padding:10px;
        ">
          📘 ${cls}
        </td>
      </tr>
    `;

    html += "<tr><th>Period</th>";
    activeDays.forEach(d => html += `<th>${d}</th>`);
    html += "</tr>";

    const periods = tt.grid[cls][activeDays[0]].length;

    for (let i = 0; i < periods; i++) {
      html += `<tr><td>${i + 1}</td>`;

      activeDays.forEach(d => {
        const slot = tt.grid[cls][d][i];

        html += `
          <td style="background:${slot.color}22;color:${slot.color}">
            ${slot.label}
            <br><small>${slot.teacher}</small>
          </td>
        `;
      });

      html += "</tr>";
    }

    html += `<tr><td colspan="${activeDays.length + 1}" style="height:15px"></td></tr>`;
  });

  table.innerHTML = html;
}
