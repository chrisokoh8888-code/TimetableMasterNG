// =======================
// SMART TIMETABLE GENERATOR (SAFE UPGRADE)
// =======================

import { state, DAYS } from './state.js';

// =======================
// MAIN GENERATOR
// =======================
export function generateTimetable() {

  if (state.subjects.length === 0) {
    alert("Add subjects first");
    return;
  }

  if (state.classes.length === 0) {
    alert("Add classes first");
    return;
  }

  const totalPeriods = calculatePeriods();

  let timetable = {
    classes: [...state.classes],
    grid: {}
  };

  // ✅ Generate for each class (NEW)
  state.classes.forEach(cls => {

    const subjectPool = buildSubjectPool();

    timetable.grid[cls] = buildBalancedTimetable(subjectPool, totalPeriods);

  });

  state.timetable = timetable;

  alert("Smart timetable generated!");
}

// =======================
// BUILD SUBJECT POOL
// =======================
function buildSubjectPool() {
  let pool = [];

  state.subjects.forEach(subj => {
    for (let i = 0; i < subj.periods; i++) {
      pool.push({
        name: subj.name,
        color: subj.color
      });
    }
  });

  return shuffle(pool);
}

// =======================
// BUILD TIMETABLE (IMPROVED)
// =======================
function buildBalancedTimetable(pool, totalPeriods) {

  let grid = {};
  let index = 0;

  const periodsPerDay = Math.ceil(totalPeriods / DAYS.length);

  DAYS.forEach(day => {

    grid[day] = [];

    for (let i = 0; i < periodsPerDay; i++) {

      if (index >= pool.length) {
        index = 0; // recycle
      }

      grid[day].push({
        label: pool[index].name,
        color: pool[index].color
      });

      index++;
    }
  });

  return grid;
}

// =======================
// SHUFFLE (RANDOMIZE)
// =======================
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// =======================
// CALCULATE PERIODS
// =======================
function calculatePeriods() {

  const cal = state.calendar || {};

  if (!cal.startTime || !cal.endTime) return 6;

  const start = new Date(`1970-01-01T${cal.startTime}:00`);
  const end = new Date(`1970-01-01T${cal.endTime}:00`);

  const totalMinutes = (end - start) / (1000 * 60);

  const period = cal.periodDuration || 40;
  const breakTime = cal.breakDuration || 0;

  const block = period + breakTime;

  return Math.floor(totalMinutes / block);
}
