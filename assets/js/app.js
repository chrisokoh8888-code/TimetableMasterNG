// =======================
// GLOBAL STATE
// =======================

const COLORS = [
  '#185FA5','#3B6D11','#BA7517','#A32D2D',
  '#534AB7','#0F6E56','#993C1D','#993556'
];

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

let state = {
  inst: null,
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

  if (page === 'timetable') {
    renderTimetable();
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
// STRUCTURE ENGINE
// =======================

function renderStructureForm() {
  const container = document.getElementById("structure-form");
  const title = document.getElementById("inst-type-display");

  if (!container) return;

  if (!state.inst) {
    container.innerHTML = "<p>Select institution first</p>";
    return;
  }

  title.innerText = state.inst + " Structure";

  let html = "";

  if (state.inst === "Nursery") {
    html = `
      <label>Class Names</label>
      <input type="text" id="class-names" placeholder="Playgroup, KG1, KG2">

      <button onclick="generateClasses()">Generate Classes</button>
    `;
  }

  else if (state.inst === "Primary") {
    html = `
      <label>Number of Levels</label>
      <input type="number" id="num-levels" placeholder="e.g 6">

      <label>Classes per Level</label>
      <input type="number" id="classes-per-level" placeholder="e.g 2">

      <button onclick="generateClasses()">Generate Classes</button>
    `;
  }

  else {
    html = `
      <label>Class Names</label>
      <input type="text" id="class-names" placeholder="JSS1A, JSS1B">

      <button onclick="generateClasses()">Generate Classes</button>
    `;
  }

  container.innerHTML = html;
}

// =======================
// CLASS GENERATOR
// =======================

function generateClasses() {

  let classes = [];

  if (state.inst === "Nursery") {
    const names = document.getElementById("class-names").value;

    classes = names.split(",").map(c => c.trim()).filter(Boolean);
  }

  else if (state.inst === "Primary") {
    const levels = parseInt(document.getElementById("num-levels").value);
    const perLevel = parseInt(document.getElementById("classes-per-level").value);

    for (let i = 1; i <= levels; i++) {
      for (let j = 0; j < perLevel; j++) {
        classes.push(`Primary ${i}${String.fromCharCode(65 + j)}`);
      }
    }
  }

  else {
    const names = document.getElementById("class-names").value;

    classes = names.split(",").map(c => c.trim()).filter(Boolean);
  }

  state.classes = classes;

  saveToLocal();
  renderClasses();
}

function renderClasses() {
  const list = document.getElementById("class-list");
  if (!list) return;

  list.innerHTML = state.classes.map(c => `
    <div class="item-row">📘 ${c}</div>
  `).join('');
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
// STAFF
// =======================

function addStaff() {
  const name = document.getElementById('new-staff').value.trim();
  if (!name) return;

  state.staff.push({
    name,
    subjects: []
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
// PERIOD CALCULATION
// =======================

function calculatePeriods() {
  return 6; // simple fixed for now
}

// =======================
// GENERATE TIMETABLE
// =======================

function generateTimetable() {

  if (!state.classes.length) {
    alert("Generate classes first");
    return;
  }

  if (!state.subjects.length) {
    alert("Add subjects first");
    return;
  }

  const classes = state.classes;
  const days = state.calendar.days.length ? state.calendar.days : DAYS;
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

    days.forEach(day => {

      grid[cls][day] = [];

      let lastSubject = null;

      for (let i = 0; i < totalPeriods; i++) {

        let subj = weeklyPool[poolIndex % weeklyPool.length];

        if (subj.name === lastSubject) {
          poolIndex++;
          subj = weeklyPool[poolIndex % weeklyPool.length];
        }

        grid[cls][day].push({
          label: subj.name,
          color: subj.color,
          teacher: "N/A"
        });

        lastSubject = subj.name;
        poolIndex++;
      }
    });
  });

  state.timetable = { classes, grid };

  saveToLocal();
  nav('timetable');
}

// =======================
// RENDER TIMETABLE
// =======================

function renderTimetable() {
  if (!state.timetable) return;

  const table = document.getElementById('tt-table');
  const tt = state.timetable;

  const days = state.calendar.days.length ? state.calendar.days : DAYS;

  let html = "";

  tt.classes.forEach(cls => {

    html += `<tr><td colspan="${days.length + 1}" style="background:#0d47a1;color:white;padding:8px;">${cls}</td></tr>`;

    html += "<tr><th>Period</th>";
    days.forEach(d => html += `<th>${d}</th>`);
    html += "</tr>";

    for (let i = 0; i < tt.grid[cls][days[0]].length; i++) {

      html += `<tr><td>${i + 1}</td>`;

      days.forEach(d => {
        const slot = tt.grid[cls][d][i];

        html += `<td style="background:${slot.color}22;color:${slot.color}">
          ${slot.label}
        </td>`;
      });

      html += "</tr>";
    }
  });

  table.innerHTML = html;
}
