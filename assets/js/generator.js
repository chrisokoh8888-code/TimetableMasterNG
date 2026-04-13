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

  if (!state.calendar || !state.calendar.days || state.calendar.days.length === 0) {
    alert("Set calendar days first");
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
// BUILD BALANCED GRID (UPDATED)
// =======================
function buildBalancedTimetable(pool, totalPeriods) {
  const classes = ['Class A']; // later expand using state.classes
  let grid = {};

  // ✅ Use selected days or fallback
  const days = state.calendar?.days?.length ? state.calendar.days : DAYS;

  classes.forEach(cls => {
    grid[cls] = {};

    let index = 0;
    const periodsPerDay = Math.ceil(totalPeriods / days.length);

    days.forEach(day => {
      grid[cls][day] = [];

      let lastSubject = null;

      for (let i = 0; i < periodsPerDay; i++) {

        let attempts = 0;
        let chosen;

        // 🔥 Prevent back-to-back duplicates
        do {
          if (index >= pool.length) {
            index = 0;
          }

          chosen = pool[index];
          index++;
          attempts++;

          // safety break (prevents infinite loop)
          if (attempts > pool.length) break;

        } while (chosen.name === lastSubject);

        grid[cls][day].push({
          label: chosen.name,
          color: chosen.color
        });

        lastSubject = chosen.name;
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
