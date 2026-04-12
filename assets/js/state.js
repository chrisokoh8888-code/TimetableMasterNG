// COLORS
export const COLORS = [
  '#185FA5','#3B6D11','#BA7517','#A32D2D',
  '#534AB7','#0F6E56','#993C1D','#993556'
];

// DAYS
export const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

// STATE
export let state = {
  inst: 'Nursery',
  subjects: [],
  staff: [],
  rooms: [],
  timetable: null
};

// RESET
export function resetState() {
  state = {
    inst: 'Nursery',
    subjects: [],
    staff: [],
    rooms: [],
    timetable: null
  };
}
