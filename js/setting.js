var userUid;


const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("user signed out");
    document.location.href = window.location.origin + "/index.html";
  });
});

// change user welcome message
function getWelcomeMessage() {
  var today = new Date();
  var curHr = today.getHours();
  var welcomeTime;

  if (curHr < 12) {
    welcomeTime = "Good morning";
  } else if (curHr < 18) {
    welcomeTime = "Good afternoon";
  } else {
    welcomeTime = "Good night";
  }
  var welcomeMessage = document.getElementById("welcome-message");
  var uidE = document.getElementById("uid");
  var usernameE = document.getElementById("username");
  var emailE = document.getElementById("email");
  var phoneE = document.getElementById("phone");

  db.collection("users")
    .doc(userUid)
    .onSnapshot((e) => {
      var data = e.data().name;
      welcomeMessage.innerHTML = welcomeTime + ", " + data;
      uidE.value = userUid;
      usernameE.value = e.data().name;
      emailE.value = e.data().email;
      if(e.data().phone!=null){
        phoneE.value = e.data().phone;
      }
    });
}
let changePassword = document.getElementById("submit-password");
changePassword.addEventListener("click", (e) => {
  e.preventDefault;
  let oldPass = document.getElementById("oldpassword").value;
  let newPass = document.getElementById("newpassword").value;
  db.collection("users")
    .doc(userUid)
    .get()
    .then((e) => {
      if (e.data().password == oldPass) {
        $("#add-alert").remove();
        $("#alert-password").append(
          '<div id="add-alert" class="alert alert-success alert-dismissible fade show" role="alert">Password changed succesfully!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
        );
        let user = firebase.auth().currentUser;
        user.updatePassword(newPass).then(
          () => {
            db.collection("users")
            .doc(userUid).update({
              password:newPass
            })
          },
          (error) => {
            $("#add-alert").remove();
            $("#alert-password").append(
              '<div id="add-alert" class="alert alert-danger alert-dismissible fade show" role="alert">'+error+'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
            );
          }
        );
      } else {
        $("#add-alert").remove();
        $("#alert-password").append(
          '<div id="add-alert" class="alert alert-danger alert-dismissible fade show" role="alert">Password incorrect!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
        );
      }
    });
});

let changeUserInfo= document.getElementById("submit-username");
changeUserInfo.addEventListener("click", (e) => {
  e.preventDefault;
  let newName = document.getElementById("username").value;
  let newPhone = document.getElementById("phone").value;

  if(newName==""){
    $("#add-alert-username").remove();
    $("#alert-username").append(
      '<div id="add-alert-username" class="alert alert-danger alert-dismissible fade show" role="alert">Username cannot be emtpy!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    );
  }else{
   
    if(newPhone==""){
      db.collection("users")
      .doc(userUid).update({
        name : newName,
        phone: null
      }).then(()=>{
        $("#add-alert-username").remove();
        $("#alert-username").append(
          '<div id="add-alert-username" class="alert alert-success alert-dismissible fade show" role="alert">Uer info has been updated!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
        );
      })
    }else{
      db.collection("users")
      .doc(userUid).update({
        name : newName,
        phone: newPhone

      }).then(()=>{
        $("#add-alert-username").remove();
        $("#alert-username").append(
          '<div id="add-alert-username" class="alert alert-success alert-dismissible fade show" role="alert">Uer info has been updated!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
        );
      })
    }
  }
 
});
window.onload = function () {
  auth.onAuthStateChanged((user) => {
    if (user) {
      isLoggedIn = true;
      console.log("user logged in: ", user);
      userUid = auth.currentUser.uid;
      getWelcomeMessage();
    } else {
      console.log("user logged out");
      userUid = null;
      document.location.href = window.location.origin + "/index.html";
    }
  });
};
