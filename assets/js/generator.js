// =======================
// SMART TIMETABLE GENERATOR
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

  const totalPeriods = calculatePeriods();
  const subjectPool = buildSubjectPool();

  state.timetable = buildBalancedTimetable(subjectPool, totalPeriods);

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
// BUILD BALANCED GRID
// =======================
function buildBalancedTimetable(pool, totalPeriods) {
  const classes = ['Class A']; // later we expand
  let grid = {};

  classes.forEach(cls => {
    grid[cls] = {};

    let index = 0;
    const periodsPerDay = Math.ceil(totalPeriods / DAYS.length);

    DAYS.forEach(day => {
      grid[cls][day] = [];

      for (let i = 0; i < periodsPerDay; i++) {

        if (index >= pool.length) {
          index = 0; // recycle if needed
        }

        grid[cls][day].push({
          label: pool[index].name,
          color: pool[index].color
        });

        index++;
      }
    });
  });

  return { classes, grid };
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
