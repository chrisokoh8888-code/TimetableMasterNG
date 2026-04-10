// ======================
// FIREBASE CONFIG
// ======================
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
};

// INIT
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ======================
// SIGNUP
// ======================
function signup() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

      let user = userCredential.user;

      // SAVE USER
      db.collection("users").doc(user.uid).set({
        email: user.email,
        plan: "demo"
      });

      showMessage("✅ Account created");
    })
    .catch(err => showMessage(err.message));
}

// ======================
// LOGIN
// ======================
function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(err => showMessage(err.message));
}

// ======================
// MESSAGE
// ======================
function showMessage(msg) {
  document.getElementById("message").innerText = msg;
}
