
alert("APP IS RUNNING");
// =======================
// IMPORTS (MUST BE AT TOP)
import { state, DAYS, resetState } from './state.js';
import { addSubject, renderSubjects, removeSubject } from './subjects.js';
import { addStaff, renderStaff, removeStaff } from './staff.js';
import { addRoom, renderRooms, removeRoom } from './rooms.js';
import { generateTimetable as generateCore } from './generator.js';
import { doExport } from './export.js';

// =======================
// NAVIGATION
// =======================
function nav(page, el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById('page-' + page);
  if (!target) return; // ✅ prevent crash

  target.classList.add('active');

  document.getElementById('page-title').textContent = page;
}

// =======================
// GENERATE + SHOW
// =======================
function generateTimetable() {
  generateCore(); // from generator.js

  if (!state.timetable) return;

  nav('timetable');       // ✅ switch page
  renderTimetable();      // ✅ render result
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
// RESET
// =======================
function resetAll() {
  if (!confirm("Reset everything?")) return;

  resetState();

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

// =======================
// GLOBAL FUNCTIONS (FOR HTML)
// =======================

// SUBJECTS
window.addSubject = addSubject;
window.removeSubject = removeSubject;

// STAFF
window.addStaff = addStaff;
window.removeStaff = removeStaff;

// ROOMS
window.addRoom = addRoom;
window.removeRoom = removeRoom;

// NAV + CORE
window.nav = nav;
window.generateTimetable = generateTimetable;
window.doExport = doExport;
window.resetAll = resetAll;
window.saveSettings = saveSettings;

// OPTIONAL
window.renderTimetable = renderTimetable;
