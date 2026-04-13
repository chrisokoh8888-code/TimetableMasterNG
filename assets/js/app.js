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
// STRUCTURE
// =======================
function renderStructureForm() {
  const container = document.getElementById('structure-form');
  const type = state.inst;

  document.getElementById('inst-type-display').textContent = type;

  if (type === 'Secondary') {
    container.innerHTML = `
      <input id="new-class" placeholder="e.g JSS1, SS1">
      <input id="new-arms" type="number" placeholder="Arms (e.g 2)">
      <button onclick="addClass()">Add</button>
    `;
  } else {
    container.innerHTML = `
      <input id="new-class" placeholder="e.g KG1, ND1, 100 Level">
      <button onclick="addSimpleClass()">Add</button>
    `;
  }
}

function addClass() {
  const name = document.getElementById('new-class').value.trim();
  const arms = parseInt(document.getElementById('new-arms').value) || 1;

  if (!name) return;

  for (let i = 0; i < arms; i++) {
    const letter = String.fromCharCode(65 + i);
    state.classes.push(`${name} ${letter}`);
  }

  renderClasses();
  saveToLocal();
}

function addSimpleClass() {
  const name = document.getElementById('new-class').value.trim();
  if (!name) return;

  state.classes.push(name);

  renderClasses();
  saveToLocal();
}

function renderClasses() {
  const list = document.getElementById('class-list');
  if (!list) return;

  list.innerHTML = state.classes.map((c, i) => `
    <div class="item-row">
      🏫 ${c}
      <button onclick="removeClass(${i})">x</button>
    </div>
  `).join('');
}

function removeClass(index) {
  state.classes.splice(index, 1);
  renderClasses();
  saveToLocal();
}

// =======================
// CALENDAR
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

  const block = cal.periodDuration + cal.breakDuration;

  return Math.floor(totalMinutes / block);
}

// =======================
// GENERATE TIMETABLE (FIXED)
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

    activeDays.forEach(day => {
      grid[cls][day] = [];

      let lastSubject = null;
      let subjectCount = {};

      for (let i = 0; i < totalPeriods; i++) {

        let attempts = 0;
        let subj;

        do {
          subj = state.subjects[Math.floor(Math.random() * state.subjects.length)];
          attempts++;
          if (attempts > 15) break;
        } while (
          subj.name === lastSubject ||
          (subjectCount[subj.name] || 0) >= 2
        );

        grid[cls][day].push({
          label: subj.name,
          color: subj.color
        });

        subjectCount[subj.name] = (subjectCount[subj.name] || 0) + 1;
        lastSubject = subj.name;
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
          text-align:left;
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
          </td>
        `;
      });

      html += "</tr>";
    }

    html += `<tr><td colspan="${activeDays.length + 1}" style="height:15px"></td></tr>`;
  });

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

  localStorage.removeItem('tt_state');
  location.reload();
}

function saveSettings() {
  alert("Settings saved!");
}

// =======================
// GLOBAL FUNCTIONS
// =======================
window.nav = nav;
window.addSubject = addSubject;
window.removeSubject = removeSubject;
window.addStaff = addStaff;
window.removeStaff = removeStaff;
window.addRoom = addRoom;
window.removeRoom = removeRoom;
window.addClass = addClass;
window.removeClass = removeClass;
window.addSimpleClass = addSimpleClass;
window.generateTimetable = generateTimetable;
window.doExport = doExport;
window.resetAll = resetAll;
window.saveSettings = saveSettings;
window.saveCalendar = saveCalendar;
window.setInstitution = setInstitution;

// =======================
// INIT
// =======================
loadFromLocal();
loadCalendar();
