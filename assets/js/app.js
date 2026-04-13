// =======================
// IMPORTS (MUST BE FIRST)
import { state, DAYS, resetState } from '../data/state.js';
import { addSubject, renderSubjects, removeSubject } from './subjects.js';
import { addStaff, renderStaff, removeStaff } from './staff.js';
import { addRoom, renderRooms, removeRoom } from './rooms.js';
import { generateTimetable } from './generator.js';
import { doExport } from './export.js';

// =======================
// GLOBAL ERROR HANDLER
function showError(message) {
  alert(message);
}

function showSuccess(message) {
  alert(message);
}

// =======================
// LOCAL STORAGE
function saveToLocal() {
  localStorage.setItem('tt_state', JSON.stringify(state));
}

function loadFromLocal() {
  const data = localStorage.getItem('tt_state');
  if (!data) return;

  Object.assign(state, JSON.parse(data));

  renderSubjects();
  renderStaff();
  renderRooms();
  renderClasses();
}

// =======================
// NAVIGATION
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
// ⚠️ FIXED: No use of "event" (avoids silent failure)
function setInstitution(type) {
  state.inst = type;
  saveToLocal();

  highlightSelectedInstitution();
}

// Highlight selected card (safe)
function highlightSelectedInstitution() {
  const cards = document.querySelectorAll('.inst-grid .card');

  cards.forEach(card => {
    card.classList.remove('active');

    if (card.innerText.includes(state.inst)) {
      card.classList.add('active');
    }
  });
}

// =======================
// STRUCTURE
function renderStructureForm() {
  const container = document.getElementById('structure-form');
  const type = state.inst;

  document.getElementById('inst-type-display').textContent = type || '';

  if (type === 'Nursery') {
    container.innerHTML = `
      <input id="new-class" placeholder="e.g KG1, KG2">
      <button onclick="addSimpleClass()">Add</button>
    `;
  }

  else if (type === 'Primary') {
    container.innerHTML = `
      <input id="new-class" placeholder="e.g Primary 1, Primary 2">
      <button onclick="addSimpleClass()">Add</button>
    `;
  }

  else if (type === 'Secondary') {
    container.innerHTML = `
      <input id="new-class" placeholder="e.g JSS1, SS1">
      <input id="new-arms" type="number" placeholder="Arms (e.g 2)">
      <button onclick="addClass()">Add</button>
    `;
  }

  else if (type === 'College') {
    container.innerHTML = `
      <input id="new-class" placeholder="e.g NCE 1, NCE 2">
      <button onclick="addSimpleClass()">Add</button>
    `;
  }

  else if (type === 'Polytechnic') {
    container.innerHTML = `
      <input id="new-class" placeholder="e.g ND1, ND2, HND1">
      <button onclick="addSimpleClass()">Add</button>
    `;
  }

  else if (type === 'University') {
    container.innerHTML = `
      <input id="new-class" placeholder="e.g 100 Level, 200 Level">
      <button onclick="addSimpleClass()">Add</button>
    `;
  }

  else {
    container.innerHTML = `
      <input id="new-class" placeholder="Enter level">
      <button onclick="addSimpleClass()">Add</button>
    `;
  }
}

// =======================
// CLASS MANAGEMENT
function addSimpleClass() {
  const input = document.getElementById('new-class');
  if (!input) return;

  const name = input.value.trim();

  if (!name) return showError("Enter class/level name");

  if (state.classes.includes(name)) {
    return showError("Class already exists");
  }

  state.classes.push(name);

  input.value = '';

  renderClasses();
  saveToLocal();
}

function addClass() {
  const nameInput = document.getElementById('new-class');
  const armsInput = document.getElementById('new-arms');

  if (!nameInput || !armsInput) return;

  const name = nameInput.value.trim();
  const arms = parseInt(armsInput.value);

  if (!name) return showError("Enter class name");
  if (!arms || arms <= 0) return showError("Enter valid arms");

  for (let i = 0; i < arms; i++) {
    const letter = String.fromCharCode(65 + i);
    state.classes.push(`${name} ${letter}`);
  }

  nameInput.value = '';
  armsInput.value = '';

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
function saveCalendar() {
  const checkedDays = Array.from(
    document.querySelectorAll('#page-calendar input[type="checkbox"]:checked')
  ).map(el => el.value);

  state.calendar = {
    startTime: document.getElementById('start-time')?.value || '',
    endTime: document.getElementById('end-time')?.value || '',
    periodDuration: parseInt(document.getElementById('period-duration')?.value) || 40,
    breakDuration: parseInt(document.getElementById('break-duration')?.value) || 0,
    days: checkedDays.length ? checkedDays : DAYS
  };

  saveToLocal();
}

// =======================
// RESET & SAVE
function resetAll() {
  if (!confirm("Reset everything?")) return;

  localStorage.removeItem('tt_state');
  location.reload();
}

function saveSettings() {
  showSuccess("Settings saved!");
}

// =======================
// GLOBAL FUNCTIONS
window.nav = nav;
window.setInstitution = setInstitution;

window.addSubject = addSubject;
window.removeSubject = removeSubject;

window.addStaff = addStaff;
window.removeStaff = removeStaff;

window.addRoom = addRoom;
window.removeRoom = removeRoom;

window.addClass = addClass;
window.addSimpleClass = addSimpleClass;
window.removeClass = removeClass;

window.generateTimetable = generateTimetable;
window.doExport = doExport;

window.resetAll = resetAll;
window.saveSettings = saveSettings;
window.saveCalendar = saveCalendar;

// =======================
// INIT
loadFromLocal();
setTimeout(() => {
  highlightSelectedInstitution();
}, 200);
