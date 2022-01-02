// Listen for auth status changes


// change user welcome message
function getWelcomeMessage() {
  var welcomeMessage = document.getElementById("welcome-message-index");
  db.collection("users")
    .doc(userUid)
    .onSnapshot((e) => {
      var data = e.data().name;
      welcomeMessage.innerHTML =  "Welcome back " + data;
    });
}

//Go to apps
const goToApps = document.querySelector('#go-to-apps');
goToApps.addEventListener("click",(e)=>{
  document.location.href = window.location.origin + "/main.html";
})
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
      phone: "",
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
    window.location.reload();
  });
});

// LOG IN
const loginForm = document.querySelector("#loginform");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm["email_field_login"].value;
  const password = loginForm["password_field_login"].value;
  console.log(email,password)
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    console.log("test");
    $("#loginPage").modal("hide");
    $("#add-alert").remove();
    loginForm.reset();
  },(error)=>{
    console.log(error);
    $("#add-alert").remove();
    $("#alert-login").append(
      '<div id="add-alert" class="alert alert-danger alert-dismissible fade show" role="alert">Email or password incorrect!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    );
  });
});

window.onload = function(){
  auth.onAuthStateChanged((user) => {
    if (user) {
      userUid=auth.currentUser.uid;
      console.log("user logged in: ", user);
      document.getElementById("start-now").classList.add("hide-element")
      document.getElementById("go-to-apps").classList.remove("hide-element")
      document.getElementById("login-button").classList.add("hide-element")
      document.getElementById("logout").classList.remove("hide-element")
      document.getElementById("login-a").classList.add("hide-element")
      document.getElementById("login-b").classList.remove("hide-element")
      getWelcomeMessage();
      
    } else {
      console.log("user logged out");
      document.getElementById("login-a").classList.remove("hide-element")
      document.getElementById("login-b").classList.add("hide-element")
      document.getElementById("start-now").classList.remove("hide-element")
      document.getElementById("go-to-apps").classList.add("hide-element")
      document.getElementById("login-button").classList.remove("hide-element")
      document.getElementById("logout").classList.add("hide-element")
    }
  });
}