// Listen for auth status changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user logged in: ", user);
    document.location.href = window.location.origin + "/main.html";
  } else {
    console.log("user logged out");
  }
});

//SIGN UP
const signupForm = document.querySelector("#signupForm");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // get user info
  const email = signupForm["email_field_signin"].value;
  const name = signupForm["name_field_signin"].value;
  const password = signupForm["password_field_signin"].value;

  auth.createUserWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    $("#signupPage").modal("hide");
    var userUid = auth.currentUser.uid;
    var db = firebase.firestore();

    db.collection("users").doc(userUid).set({
      uid: userUid,
      email: email,
      name: name,
      password: password,
    });
    signupForm.reset();
  });
});

// LOG OUT
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("user signed out");
  });
});

// LOG IN
const loginForm = document.querySelector("#loginform");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm["email_field_login"].value;
  const password = loginForm["password_field_login"].value;

  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    console.log("test");
    $("#loginPage").modal("hide");
    loginForm.reset();
  });
});
