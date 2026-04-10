// ==========================
// 🔥 FIREBASE CONFIG
// ==========================
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// ==========================
// 🔐 AUTH FUNCTIONS
// ==========================
function signup() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

      let user = userCredential.user;

      db.collection("users").doc(user.uid).set({
        email: user.email,
        plan: "demo"
      });

      showMessage("✅ Account created");
    })
    .catch(err => showMessage(err.message));
}

function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "setup.html";
    })
    .catch(err => showMessage(err.message));
}

function showMessage(msg) {
  let el = document.getElementById("message");
  if (el) el.innerText = msg;
}


// ==========================
// 🏫 SETUP PAGE FUNCTIONS
// ==========================

// Toggle single/multi class
function toggleClassMode() {
  let mode = document.getElementById("generationMode").value;

  document.getElementById("singleClassBox").style.display =
    mode === "single" ? "block" : "none";

  document.getElementById("multiClassBox").style.display =
    mode === "multi" ? "block" : "none";
}


// Add subject
function addSubject() {
  let div = document.createElement("div");

  div.innerHTML = `
    <input placeholder="Subject Name">
    <input type="number" placeholder="Periods/Week">
    <label>
      Double
      <input type="checkbox">
    </label>
    <hr>
  `;

  document.getElementById("subjectList").appendChild(div);
}


// Add teacher
function addTeacher() {
  let div = document.createElement("div");

  div.innerHTML = `
    <input placeholder="Teacher Name">
    <input placeholder="Subject">
    <input type="number" placeholder="Max per day">
    <hr>
  `;

  document.getElementById("teacherList").appendChild(div);
}


// Add class (multi)
function addClass() {
  let div = document.createElement("div");

  div.innerHTML = `
    <input placeholder="Class Name (e.g JSS1)">
    <input placeholder="Arm (A, B, Science)">
    <hr>
  `;

  document.getElementById("classList").appendChild(div);
}


// ==========================
// 💾 SAVE SETUP TO FIREBASE
// ==========================
function saveSetup() {

  let user = auth.currentUser;

  let subjects = [];
  let teachers = [];
  let classes = [];

  // SUBJECTS
  document.querySelectorAll("#subjectList div").forEach(div => {
    let inputs = div.querySelectorAll("input");

    subjects.push({
      name: inputs[0].value,
      periods: parseInt(inputs[1].value),
      double: inputs[2].checked
    });
  });

  // TEACHERS
  document.querySelectorAll("#teacherList div").forEach(div => {
    let inputs = div.querySelectorAll("input");

    teachers.push({
      name: inputs[0].value,
      subject: inputs[1].value,
      maxPerDay: parseInt(inputs[2].value) || 6
    });
  });

  // CLASS MODE
  let mode = document.getElementById("generationMode").value;

  if (mode === "single") {
    classes.push({
      name: document.getElementById("singleClassName").value
    });
  } else {
    document.querySelectorAll("#classList div").forEach(div => {
      let inputs = div.querySelectorAll("input");

      classes.push({
        name: inputs[0].value,
        arm: inputs[1].value
      });
    });
  }

  let data = {
    schoolName: document.getElementById("schoolName").value,
    level: document.getElementById("schoolLevel").value,
    days: parseInt(document.getElementById("days").value),
    periodsPerDay: parseInt(document.getElementById("periods").value),
    generationMode: mode,
    subjects: subjects,
    teachers: teachers,
    classes: classes
  };

  db.collection("schools").doc(user.uid).set(data)
    .then(() => {
      alert("✅ Setup saved");
      window.location.href = "dashboard.html";
    });
}


// ==========================
// 📊 DASHBOARD LOGIC
// ==========================
let schoolData = null;

auth.onAuthStateChanged(user => {
  if (!user) return;

  // LOAD PARAMETERS
  db.collection("schools").doc(user.uid).get()
    .then(doc => {
      schoolData = doc.data();
    });

  loadTimetables();
});


// ==========================
// ⚙️ GENERATE ENGINE (BASIC)
// ==========================
function generate() {

  if (!schoolData) {
    alert("Please complete setup first");
    return;
  }

  let days = getDaysArray(schoolData.days);
  let periods = createPeriods(schoolData.periodsPerDay);

  let timetable = {};
  let teacherSchedule = {}; // Prevent clashes

  // ==========================
  // MAP SUBJECT → TEACHER
  // ==========================
  let teacherMap = {};

  schoolData.teachers.forEach(t => {
    teacherMap[t.subject] = t;
  });

  // ==========================
  // LOOP THROUGH CLASSES
  // ==========================
  schoolData.classes.forEach(cls => {

    timetable[cls.name] = {};

    // INIT CLASS GRID
    days.forEach(day => {
      timetable[cls.name][day] = {};
      periods.forEach(p => {
        timetable[cls.name][day][p] = null;
      });
    });

    // ==========================
    // ASSIGN SUBJECTS BASED ON PERIODS
    // ==========================
    schoolData.subjects.forEach(sub => {

      let count = 0;
      let attempts = 0;

      while (count < sub.periods && attempts < 200) {

        attempts++;

        let day = days[Math.floor(Math.random() * days.length)];
        let periodIndex = Math.floor(Math.random() * periods.length);
        let period = periods[periodIndex];

        let teacher = teacherMap[sub.name];
        if (!teacher) continue;

        // Skip if already filled
        if (timetable[cls.name][day][period]) continue;

        // ==========================
        // TEACHER CLASH CHECK
        // ==========================
        if (!teacherSchedule[teacher.name]) {
          teacherSchedule[teacher.name] = {};
        }

        if (!teacherSchedule[teacher.name][day]) {
          teacherSchedule[teacher.name][day] = [];
        }

        if (teacherSchedule[teacher.name][day].includes(period)) {
          continue;
        }

        // ==========================
        // TEACHER DAILY LIMIT
        // ==========================
        let dailyLoad = teacherSchedule[teacher.name][day].length;

        if (dailyLoad >= teacher.maxPerDay) continue;

        // ==========================
        // ASSIGN
        // ==========================
        timetable[cls.name][day][period] = sub.name;

        teacherSchedule[teacher.name][day].push(period);

        count++;

        // ==========================
        // DOUBLE PERIOD LOGIC
        // ==========================
        if (
          sub.double &&
          periodIndex < periods.length - 1
        ) {

          let nextPeriod = periods[periodIndex + 1];

          if (
            !timetable[cls.name][day][nextPeriod] &&
            !teacherSchedule[teacher.name][day].includes(nextPeriod)
          ) {
            timetable[cls.name][day][nextPeriod] = sub.name;
            teacherSchedule[teacher.name][day].push(nextPeriod);
            count++;
          }
        }
      }

      if (count < sub.periods) {
        console.warn("⚠️ Could not fully assign:", sub.name);
      }

    });

    // ==========================
    // FILL EMPTY SLOTS
    // ==========================
    days.forEach(day => {
      periods.forEach(p => {
        if (!timetable[cls.name][day][p]) {
          timetable[cls.name][day][p] = "Free";
        }
      });
    });

  });

  saveTimetable(JSON.stringify(timetable));
    }


// ==========================
// 📅 HELPER FUNCTIONS
// ==========================
function getDaysArray(num) {
  let base = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return base.slice(0, num);
}

function createPeriods(num) {
  let arr = [];
  for (let i = 1; i <= num; i++) {
    arr.push("P" + i);
  }
  return arr;
}


// ==========================
// 💾 SAVE TIMETABLE
// ==========================
function saveTimetable(data) {
  let user = auth.currentUser;

  db.collection("timetables").add({
    userId: user.uid,
    timetable: data,
    createdAt: new Date()
  }).then(() => {
    loadTimetables();
  });
}


// ==========================
// 📂 LOAD TIMETABLES
// ==========================
function loadTimetables() {
  let user = auth.currentUser;
  if (!user) return;

  db.collection("timetables")
    .where("userId", "==", user.uid)
    .get()
    .then(snapshot => {

      let html = "";

      snapshot.forEach(doc => {
        let data = doc.data();

        html += `
          <div style="background:white; padding:10px; margin:10px;">
            <button onclick='viewTimetable(${JSON.stringify(data.timetable)})'>View</button>
            <button onclick="deleteTimetable('${doc.id}')">Delete</button>
          </div>
        `;
      });

      let container = document.getElementById("timetableList");
      if (container) container.innerHTML = html;
    });
}


// ==========================
// 👁 VIEW TIMETABLE
// ==========================
function viewTimetable(data) {

  let timetable = JSON.parse(data);

  let html = "";

  Object.keys(timetable).forEach(cls => {

    html += `<h3>${cls}</h3><table border="1">`;

    let days = Object.keys(timetable[cls]);
    let periods = Object.keys(timetable[cls][days[0]]);

    html += "<tr><th>Period</th>";
    days.forEach(d => html += `<th>${d}</th>`);
    html += "</tr>";

    periods.forEach(p => {
      html += `<tr><td>${p}</td>`;

      days.forEach(d => {
        html += `<td>${timetable[cls][d][p]}</td>`;
      });

      html += "</tr>";
    });

    html += "</table><br>";
  });

  document.getElementById("tableContainer").innerHTML = html;
  document.getElementById("viewer").style.display = "block";
}


// ==========================
// 🗑 DELETE
// ==========================
function deleteTimetable(id) {
  db.collection("timetables").doc(id).delete()
    .then(loadTimetables);
}


// ==========================
// 🚪 LOGOUT
// ==========================
function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
