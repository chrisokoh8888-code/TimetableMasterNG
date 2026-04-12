// =======================
// GENERATOR MODULE
// =======================

import { state, DAYS } from './state.js';
// Generate Timetable
export function generateTimetable() {
  if (state.subjects.length === 0) {
    alert("Add subjects first");
    return;
  }

  state.timetable = buildDemoTimetable();

  alert("Timetable generated!");
}

// Build Demo Timetable (basic logic)
export function buildDemoTimetable() {
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
