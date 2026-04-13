// =======================
// GLOBAL STATE MANAGEMENT
// =======================

// 🎨 Colors (used for subjects)
export const COLORS = [
  '#185FA5',
  '#3B6D11',
  '#BA7517',
  '#A32D2D',
  '#534AB7',
  '#0F6E56',
  '#993C1D',
  '#993556'
];

// 📅 Default Days (used by generator)
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// =======================
// MAIN APP STATE
// =======================
export let state = {
  // Institution type (Nursery, Primary, etc.)
  inst: '',

  // Core data
  subjects: [],
  staff: [],
  rooms: [],

  // Generated timetable
  timetable: null,

  // Calendar settings
  calendar: {
    startTime: '',
    endTime: '',
    periodDuration: 40,
    breakDuration: 0,
    days: [...DAYS] // uses default days
  }
};

// =======================
// RESET FUNCTION
// =======================
export function resetState() {
  state.inst = '';
  state.subjects = [];
  state.staff = [];
  state.rooms = [];
  state.timetable = null;

  state.calendar = {
    startTime: '',
    endTime: '',
    periodDuration: 40,
    breakDuration: 0,
    days: [...DAYS]
  };
}
