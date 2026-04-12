// =======================
// GLOBAL STATE MANAGEMENT
// =======================

// App color system
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

// Room icons mapping
export const ROOM_ICONS = {
  Classroom: '🏫',
  Lab: '🔬',
  Studio: '🎨',
  'Gym / Hall': '🏃',
  'Lecture hall': '🎓',
  Library: '📖'
};

// Days of the week
export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
];

// Core application state
export let state = {
  inst: 'Nursery',
  subjects: [],
  staff: [],
  rooms: [],
  timetable: null
};

// Current timetable view (selected class)
export let currentTTClass = null;

// =======================
// STATE HELPERS
// =======================

// Reset entire app state
export function resetState() {
  state = {
    inst: 'Nursery',
    subjects: [],
    staff: [],
    rooms: [],
    timetable: null
  };

  currentTTClass = null;
}

// Update state safely
export function updateState(newData) {
  state = { ...state, ...newData };
}
