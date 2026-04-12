// =======================
// IMPORTS (MUST BE AT TOP)
import { state, COLORS, DAYS, resetState } from '../data/state.js';
import { state, COLORS, DAYS, resetState } from './state.js';
import { addSubject, renderSubjects, removeSubject } from './subjects.js';
import { addStaff, renderStaff, removeStaff } from './staff.js';
import { addRoom, renderRooms, removeRoom } from './rooms.js';
import { generateTimetable } from './generator.js';
import { doExport } from './export.js';

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
