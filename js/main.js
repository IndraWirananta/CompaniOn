/*
TODO

update chart-> sort by latest timestamp -> add to chart -> profit
*/

var isLoggedIn = false;
var userUid;
var unsubscribe;

//option for chart date format
var options = {
  weekday: "short",
  hour: "numeric",
  minute: "numeric",
};

//for logout purposes
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("user signed out");
    document.location.href = window.location.origin + "/index.html";
  });
});

//change toolbar shadow
function changeShadow() {
  if (
    document
      .getElementById("collapseSensor")
      .classList.contains("shadow-toolbar")
  ) {
    document
      .getElementById("collapseSensor")
      .classList.remove("shadow-toolbar");
    setTimeout(function () {
      document.getElementById("toolbar").classList.add("shadow-toolbar");
    }, 350);
  } else {
    document.getElementById("collapseSensor").classList.add("shadow-toolbar");
    document.getElementById("toolbar").classList.remove("shadow-toolbar");
  }
}

// change add sensor styling
var btns = document.getElementById("add-sensor");
btns.addEventListener("click", function () {
  if (btns.classList.contains("sensor-btn-active")) {
    btns.classList.remove("sensor-btn-active");
  } else {
    $("#add-sensor-alert").remove();
    console.log("REMOVE SENSOR ALERT");
    btns.classList.add("sensor-btn-active");
  }
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
  db.collection("users")
    .doc(userUid)
    .onSnapshot((e) => {
      var data = e.data().name;
      welcomeMessage.innerHTML = welcomeTime + ", " + data;
    });
}
// handle scroll if category too long
const slider = document.querySelector("#sensor-category");
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener("mouseleave", () => {
  isDown = false;
});
slider.addEventListener("mouseup", () => {
  isDown = false;
});
slider.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = x - startX; //scroll-fast
  slider.scrollLeft = scrollLeft - walk;
});

// add category
const addCategoryBtn = document.getElementById("add-category-btn");
const addCategoryInput = document.getElementById("add-category-input");
var arrCategory = [];
addCategoryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (addCategoryInput.value == null || addCategoryInput.value == "") {
    $("#add-sensor-alert").remove();
    $("#alert-add-sensor").append(
      '<div id="add-sensor-alert" class="alert alert-danger alert-dismissible fade show" role="alert">Sensor module cannot be empty!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    );
  } else if (arrCategory.indexOf(addCategoryInput.value) != -1) {
    $("#add-sensor-alert").remove();
    $("#alert-add-sensor").append(
      '<div id="add-sensor-alert" class="alert alert-danger alert-dismissible fade show" role="alert">Sensor module must have unique name!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    );
  } else {
    arrCategory.push(addCategoryInput.value.replace(/ /g, "_"));
    $("#add-sensor-alert").remove();
    addCategory(arrCategory);
  }
});
function addCategory(input) {
  $("#sensor-category").empty();
  addCategoryInput.value = "";
  input.forEach(function (e, index) {
    console.log(e);
    $("#sensor-category").append(
      '<li class="list-group-item category-item">' +
        e +
        '<button type="button" onclick="deleteCategoryByIndex(' +
        "'" +
        e +
        "'" +
        ')" class="category-del"><i style="vertical-align:middle" " class="bx category-delete-btn bx-x"></i></button></li>'
    );
  });
}
// delete category
function deleteCategoryByIndex(e) {
  const index = arrCategory.indexOf(e);
  if (index > -1) {
    arrCategory.splice(index, 1);
    addCategory(arrCategory);
  }
}
// clear category
function deleteCategory() {
  arrCategory.length = 0;
  addCategory(arrCategory);
}

// Form Controller for adding sensor
const addSensorForm = document.getElementById("addSensorForm");
addSensorForm.addEventListener("submit", (e) => {
  e.preventDefault();

  var name = addSensorForm.sensor_name_field.value.replace(/ /g, "_");
  var group = addSensorForm.sensor_group_field.value.replace(/ /g, "_");
  var desc = addSensorForm.sensor_description_field.value;

  if (
    name == "" ||
    name == null ||
    group == "" ||
    group == null 
  ) {
    $("#add-sensor-alert").remove();
    $("#alert-add-sensor").append(
      '<div id="add-sensor-alert" class="alert alert-danger alert-dismissible fade show" role="alert">Name, and group cannot be empty!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    );
  } else {
    db.collection("users")
      .doc(userUid)
      .collection("sensor")
      .doc(name)
      .get()
      .then((doc) => {
        if (typeof doc.data() !== "undefined") {
          // check if sensor with the same name exist
          $("#add-sensor-alert").remove();
          $("#alert-add-sensor").append(
            '<div id="add-sensor-alert" class="alert alert-danger alert-dismissible fade show" role="alert">Name already taken by other sensor!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
          );
        } else {
          db.collection("users")
            .doc(userUid)
            .collection("sensor")
            .doc(name)
            .set({
              nick: null,
              desc: desc,
              group: group,
              sensors: arrCategory,
              isOn: true,
              reading: [],
            })
            .then(() => {
              $("#add-sensor-alert").remove();
              $("#alert-add-sensor").append(
                '<div id="add-sensor-alert" class="alert alert-success alert-dismissible fade show" role="alert">Sensor added successfuly!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
              );
              // clearing array and form
              deleteCategory();
              addSensorForm.reset();
              updateChart();
            })
            .catch(() => {
              console.error(
                "Error setting sensor information in add sensor: ",
                error
              );
            });
        }
      })
      .catch(() => {
        console.error(
          "Error fetching sensor information in add sensor: ",
          error
        );
      });
  }
});

// for editing group name
function editGroupName(groupName, newGroupName, idGroupModal) {
  db.collection("users")
    .doc(userUid)
    .collection("sensor")
    .get()
    .then((e) => {
      e.forEach((docs) => {
        if (docs.data().group == groupName) {
          db.collection("users")
            .doc(userUid)
            .collection("sensor")
            .doc(docs.id)
            .update({
              group: newGroupName.replace(/ /g, "_"),
            });
        }
      });
      $("#" + idGroupModal).modal("hide");
      updateChart();
    });
}

// for editing module nickname
function editModuleInfo(moduleName, newNickname, newDesc,newGroup, idModuleModal) {
  if (newNickname == "") {
    db.collection("users")
      .doc(userUid)
      .collection("sensor")
      .doc(moduleName)
      .update({
        nick: null,
        desc: newDesc,
        group: newGroup.replace(/ /g, "_")
        
      })
      .then(() => {
        $("#" + idModuleModal).modal("hide");
        updateChart();
      });
  } else {
    db.collection("users")
      .doc(userUid)
      .collection("sensor")
      .doc(moduleName)
      .update({
        nick: newNickname.replace(/ /g, "_"),
        desc: newDesc,
        group: newGroup.replace(/ /g, "_")
      })
      .then(() => {
        $("#" + idModuleModal).modal("hide");
        updateChart();
      });
  }
}
function addSensorToExistingModule(
  moduleName,
  newSensor,
  idModuleAddSensorModal,
  idModuleAddSensorAlert,
  sensorList
) {
  if (newSensor == "") {
    $("#add-newSensor-alert").remove();
    $("#" + idModuleAddSensorAlert).append(
      '<div id="add-newSensor-alert" class="alert alert-danger alert-dismissible fade show" role="alert">Sensor name cannot be empty!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    );
  } else if (sensorList.includes(newSensor)) {
    $("#add-newSensor-alert").remove();
    $("#" + idModuleAddSensorAlert).append(
      '<div id="add-newSensor-alert" class="alert alert-danger alert-dismissible fade show" role="alert">Sensor already exist!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    );
  } else {
    db.collection("users")
      .doc(userUid)
      .collection("sensor")
      .doc(moduleName)
      .update({
        sensors: firebase.firestore.FieldValue.arrayUnion(newSensor.replace(/ /g, "_")),
      })
      .then(() => {
        $("#" + idModuleAddSensorModal).modal("hide");
        updateChart();
      });
  }
}

// add floating legend for chart
function addLegend(
  myChart,
  chartAxisId,
  classWrapperModule,
  classWrapper2Module,
  readLength
) {
  var newwidth = $("." + classWrapper2Module).width() + 100 * readLength;
  $("." + classWrapper2Module).width(newwidth);
  $("." + classWrapperModule).animate({
    scrollLeft: newwidth,
  });
  setTimeout(function () {
    var sourceCanvas = myChart.chart.canvas;
    var copyWidth = myChart.scales["y-axis-0"].width + 10;
    var copyHeight =
      myChart.scales["y-axis-0"].height + myChart.scales["y-axis-0"].top - 10;
    try {
      var targetCtx = document.getElementById(chartAxisId).getContext("2d");
      targetCtx.canvas.width = copyWidth;
      targetCtx.drawImage(
        sourceCanvas,
        0,
        0,
        copyWidth,
        copyHeight,
        0,
        0,
        copyWidth,
        copyHeight
      );
    } catch (error) {
      console.log("Canvas has not been loaded yet")
    }
    
  }, 350);
}

function addDragScroll(classWrapperModule) {
  const slider = document.querySelector("." + classWrapperModule);
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });
  slider.addEventListener("mouseup", () => {
    isDown = false;
  });
  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
  });
}

// brain of the operation, create the chart
function createChart() {
  console.log("Creating Chart...");
  return new Promise((resolve) => {
    let totalSensor = 0;
    db.collection("users")
      .doc(userUid)
      .collection("sensor")
      .get()
      .then((doc) => {
       
        var newChartArray = [];
        doc.forEach((docs) => {
          totalSensor = totalSensor+1;
          var sensorList = docs.data().sensors;
          var moduleName = docs.id;
          var nickname = docs.data().nick;
          var groupName = docs.data().group;
          var moduleDesc = docs.data().desc;
          var sensorReading = docs.data().reading;
          var idGroup = "card-" + groupName;
          var idGroupModal = "modal-" + groupName;
          var idGroupForm = "form-" + groupName;
          var idModule = "wrapper-" + moduleName + "-" + groupName;
          var idModuleModal = "modal-" + moduleName + "-" + groupName;
          var idGroupDeleteModal = "deleteGroupModal-" + moduleName + "-" + groupName;
          var idGroupDeleteForm = "deleteGroupForm-" + moduleName + "-" + groupName;
          var idModuleForm = "form-" + moduleName + "-" + groupName;
          var idModuleAddSensorModal =
            "addSensorModal-" + moduleName + "-" + groupName;
          var idModuleAddSensorForm =
            "addSensorForm-" + moduleName + "-" + groupName;
          var idModuleDeleteModal =
            "moduleDeleteModal-" + moduleName + "-" + groupName;
          var idModuleDeleteForm =
            "moduleDeleteForm-" + moduleName + "-" + groupName;
          var idModuleAddSensorAlert =
            "addSensorAlert-" + moduleName + "-" + groupName;
          var idNickname = "nick-" + moduleName + "-" + groupName;

          // check if element exist or not
          if ($("#" + idGroup).length == 0) {
            //modal for changing group name
            $("#modal-area").append(
              '<div class="modal fade" id=' +
                idGroupModal +
                ">" +
                '<div class="modal-dialog modal-dialog-centered">' +
                '<form class="modal-content" id="' +
                idGroupForm +
                '">' +
                '<div class="modal-header text-center">' +
                '<h4 class="modal-title text-center w-100 font-weight-bold">Edit Group</h4>' +
                "</div>" +
                '<div class="modal-body  mx-3">' +
                '<div class="md-form mb-3">' +
                '<label data-error="wrong" class=" mb-3" data-success="right">Change Group Name</label>' +
                '<input type="text" id="group_field" class="form-control validate" value="' +
                groupName +
                '">' +
                "</div>" +
                "</div>" +
                '<button type="submit" class="btn btn-primary btn-signup"' +
                ')">Submit</button>' +
                "</form>" +
                "</div>" +
                "</div>"
            );

          // modal for deleting group and everything inside
          $("#modal-area").append(
            '<div class="modal fade" id=' +
            idGroupDeleteModal +
              ">" +
              '<div class="modal-dialog modal-dialog-centered">' +
              '<form class="modal-content" id="' +
              idGroupDeleteForm +
              '">' +
              '<div class="modal-header text-center">' +
              '<h4 class="modal-title text-center w-100 font-weight-bold">Delete Group</h4>' +
              "</div>" +
              '<div class="modal-body  mx-3">' +
              '<div class="md-form mb-3">' +
              '<label data-error="wrong" class=" mb-3" data-success="right">Are you sure you want to delete <b>'+groupName+'</b>? Every module inside this group will also be deleted</label>' +
              "</div>" +
              "</div>" +
              '<div class="dialog-delete-confirmation"><button value="yes" id="yes" type="submit" class="btn btn-primary btn-signup"' +
              ')">Yes</button>' +
              '<button type="reset" value="no" id="no" class=" btn btn-primary btn-signup"' +
              ')">No</button></div>' +
              "</form>" +
              "</div>" +
              "</div>"
          );
            let groupNameModalform = document.getElementById(idGroupForm);
            groupNameModalform.addEventListener("submit", (e) => {
              e.preventDefault();
              editGroupName(
                groupName,
                groupNameModalform.group_field.value,
                idGroupModal
              );
            });
            let deleteGroupForm = document.getElementById(idGroupDeleteForm);
            deleteGroupForm.addEventListener("reset", (e) => {
              e.preventDefault();
              $("#" + idGroupDeleteModal).modal("hide");
            });
            deleteGroupForm.addEventListener("submit", (e) => {
              e.preventDefault();
              db.collection("users")
                .doc(userUid)
                .collection("sensor")
                .get().then((e)=>{
                  e.forEach((docs)=>{
                    if(docs.data().group==groupName){
                      db.collection("users")
                      .doc(userUid)
                      .collection("sensor").doc(docs.id).delete()
                    }
                  })
                  console.log("Group successfully deleted!");
                  $("#" + idGroupDeleteModal).modal("hide");
                  updateChart();
                })
                
            });

            $("#chart-area").append(
              '<div class="card mb-4 text-start"><div class="card text-start"><div class="card-body" id="' +
                idGroup +
                '"><div class="group-name"><h2 class="card-title">' +
                groupName +
                "</h2> " +
                '<button type="button" data-bs-toggle="modal"' +
                'data-bs-target="#' +
                idGroupModal +
                '" class=" set-to-left edit-group" aria-expanded="true"' +
                ">" +
                '<i class="bx  bx-edit"></i>' +
                "</button>" +
                '<button type="button" data-bs-toggle="modal"' +
                'data-bs-target="#' +
                idGroupDeleteModal +
                '" class=" edit-group " aria-expanded="true"' +
                ">" +
                '<i class="bx  bx-trash-alt"></i>' +
                "</button>" +
                "</div><br></div></div></div>"
            );
          }

          // append module card into group card
          $("#" + idGroup).append(
            '<div class="card-body group-wrapper mb-3" id="' +
              idModule +
              '"><div class="module-name" id="' +
              idNickname +
              '"><h3 class="card-title">' +
              moduleName +
              "</h3> </div><p class='card-text'>" +
              moduleDesc +
              "</p><hr /></div>"
          );
          var displayValueNickname = "";
          if (nickname != null) {
            displayValueNickname = nickname;
          }
          //modal for changing modul description
          $("#modal-area").append(
            '<div class="modal fade" id=' +
              idModuleModal +
              ">" +
              '<div class="modal-dialog modal-dialog-centered">' +
              '<form class="modal-content" id="' +
              idModuleForm +
              '">' +
              '<div class="modal-header text-center">' +
              '<h4 class="modal-title text-center w-100 font-weight-bold">Edit Module</h4>' +
              "</div>" +
              '<div class="modal-body  mx-3">' +
              '<div class="md-form mb-3">' +
              '<label data-error="wrong" class=" mb-3" data-success="right">Edit module description</label>' +
              '<input type="text" id="description_field" class="form-control validate" value="' +
              moduleDesc +
              '">' +
              "</div>" +
              '<div class="md-form mb-3">' +
              '<label data-error="wrong" class=" mb-3" data-success="right">Give module a nickname</label>' +
              '<input type="text" id="nickname_field" class="form-control validate" value="' +
              displayValueNickname +
              '">' +
              "</div>" +
              '<div class="md-form mb-3">' +
              '<label data-error="wrong" class=" mb-3" data-success="right">Change module group</label>' +
              '<input type="text" id="group_field" class="form-control validate" value="' +
            groupName +
              '">' +
              "</div>" +
              "</div>" +
              '<button type="submit" class="btn btn-primary btn-signup"' +
              ')">Submit</button>' +
              "</form>" +
              "</div>" +
              "</div>"
          );
          // modal for adding module sensor e.g. temperature
          $("#modal-area").append(
            '<div class="modal fade" id=' +
              idModuleAddSensorModal +
              ">" +
              '<div class="modal-dialog modal-dialog-centered">' +
              '<form class="modal-content" id="' +
              idModuleAddSensorForm +
              '">' +
              '<div class="modal-header text-center">' +
              '<h4 class="modal-title text-center w-100 font-weight-bold">Add Sensor</h4>' +
              "</div>" +
              '<div class="modal-body  mx-3">' +
              '<div class="md-form mb-3">' +
              "<div id=" +
              idModuleAddSensorAlert +
              "></div>" +
              '<label data-error="wrong" class=" mb-3" data-success="right">New Sensor Name</label>' +
              '<input type="text" id="new_sensor_field" class="form-control validate" placeholder="e.g., temperature">' +
              "</div>" +
              "</div>" +
              '<button type="submit" class="btn btn-primary btn-signup"' +
              ')">Submit</button>' +
              "</form>" +
              "</div>" +
              "</div>"
          );
          // modal for deleting module
          $("#modal-area").append(
            '<div class="modal fade" id=' +
              idModuleDeleteModal +
              ">" +
              '<div class="modal-dialog modal-dialog-centered">' +
              '<form class="modal-content" id="' +
              idModuleDeleteForm +
              '">' +
              '<div class="modal-header text-center">' +
              '<h4 class="modal-title text-center w-100 font-weight-bold">Delete Module</h4>' +
              "</div>" +
              '<div class="modal-body  mx-3">' +
              '<div class="md-form mb-3">' +
              '<label data-error="wrong" class=" mb-3" data-success="right">Are you sure you want to delete <b>'+moduleName+'</b>?</label>' +
              "</div>" +
              "</div>" +
              '<div class="dialog-delete-confirmation"><button value="yes" id="yes" type="submit" class="btn btn-primary btn-signup"' +
              ')">Yes</button>' +
              '<button type="reset" value="no" id="no" class=" btn btn-primary btn-signup"' +
              ')">No</button></div>' +
              "</form>" +
              "</div>" +
              "</div>"
          );

          let moduleForm = document.getElementById(idModuleForm);
          moduleForm.addEventListener("submit", (e) => {
            e.preventDefault();
            editModuleInfo(
              moduleName,
              moduleForm.nickname_field.value,
              moduleForm.description_field.value,
              moduleForm.group_field.value,
              idModuleModal
            );
          });
          let addNewSensorForm = document.getElementById(idModuleAddSensorForm);
          addNewSensorForm.addEventListener("submit", (e) => {
            e.preventDefault();
            addSensorToExistingModule(
              moduleName,
              addNewSensorForm.new_sensor_field.value,
              idModuleAddSensorModal,
              idModuleAddSensorAlert,
              sensorList
            );
          });
          let deleteModuleForm = document.getElementById(idModuleDeleteForm);
          deleteModuleForm.addEventListener("reset", (e) => {
            e.preventDefault();
            $("#" + idModuleDeleteModal).modal("hide");
          });
          deleteModuleForm.addEventListener("submit", (e) => {
            e.preventDefault();
            db.collection("users")
              .doc(userUid)
              .collection("sensor")
              .doc(moduleName)
              .delete()
              .then(() => {
                console.log("Module successfully deleted!");
                $("#" + idModuleDeleteModal).modal("hide");
                updateChart();
              });
          });

          if (nickname != null) {
            $("#" + idNickname).append(
              "<div class='vr-module'>" +
                "</div><p class='module-nickname'>" +
                nickname +
                "</p>"
            );
          }
          $("#" + idNickname).append(
            '<button type="button" data-bs-toggle="modal"' +
              'data-bs-target="#' +
              idModuleAddSensorModal +
              '" class="set-to-left btn-sensor-existing add-sensor-button" aria-expanded="true"' +
              'aria-controls="collapseSensor">' +
              "<i class='bx bx-plus'></i>" +
              "</button>" +
              '<button type="button" data-bs-toggle="modal"' +
              'data-bs-target="#' +
              idModuleModal +
              '" class=" btn-sensor-existing add-sensor-button" aria-expanded="true"' +
              'aria-controls="collapseSensor">' +
              '<i class="bx  bx-edit-alt"></i>' +
              "</button>" +
              '<button type="button" data-bs-toggle="modal"' +
              'data-bs-target="#' +
              idModuleDeleteModal +
              '" class=" btn-sensor-existing add-sensor-button" aria-expanded="true"' +
              'aria-controls="collapseSensor">' +
              '<i class="bx bx-trash"></i>' +
              "</button>"
          );

          // append sensor/s to the module card
          for (y = 0; y < sensorList.length; y++) {
            var sensorName = sensorList[y];
            var classWrapperModule =
              "chartAreaWrapper-" +
              sensorName +
              "-" +
              moduleName +
              "-" +
              groupName;

            var classWrapper2Module =
              "chartAreaWrapper2" +
              sensorName +
              "-" +
              moduleName +
              "-" +
              groupName;

            var chartId =
              "chart-" + sensorName + "-" + moduleName + "-" + groupName;

            var chartAxisId =
              "chartAxis-" + sensorName + "-" + moduleName + "-" + groupName;

            var idDeleteSensorForm =
              "deleteSensorForm-" + sensorName + "-" + moduleName + "-" + groupName;
            var idDeleteSensorModal =
              "deleteSensorModal-" + sensorName + "-" + moduleName + "-" + groupName;

              $("#modal-area").append(
                '<div class="modal fade" id=' +
                idDeleteSensorModal +
                ">" +
                '<div class="modal-dialog modal-dialog-centered">' +
                '<form class="modal-content" id="' +
                idDeleteSensorForm +
                '">' +
                '<div class="modal-header text-center">' +
                '<h4 class="modal-title text-center w-100 font-weight-bold">Delete Sensor</h4>' +
                "</div>" +
                '<div class="modal-body  mx-3">' +
                '<div class="md-form mb-3">' +
                '<label data-error="wrong" class=" mb-3" data-success="right">Are you sure you want to delete <b>'+sensorName+'</b> from this module?</label>' +
                "</div>" +
                "</div>" +
                '<div class="dialog-delete-confirmation"><button value="yes" id="yes" type="submit" class="btn btn-primary btn-signup"' +
                ')">Yes</button>' +
                '<button type="reset" value="no" id="no" class=" btn btn-primary btn-signup"' +
                ')">No</button></div>' +
                "</form>" +
                "</div>" +
                "</div>"
              );

              let deleteSensorForm = document.getElementById(idDeleteSensorForm);
              let idModalCopy =JSON.parse(JSON.stringify(idDeleteSensorModal)) ;
              let deletedSensorCopy = JSON.parse(JSON.stringify(sensorName ));
              deleteSensorForm.addEventListener("reset", (e) => {
                e.preventDefault();
                $("#" + idModalCopy).modal("hide");
              });
              deleteSensorForm.addEventListener("submit", (e) => {
                e.preventDefault();
                db.collection("users")
                  .doc(userUid)
                  .collection("sensor")
                  .doc(moduleName)
                  .update({
                    sensors:firebase.firestore.FieldValue.arrayRemove(deletedSensorCopy)
                  })
                  .then(() => {
                    console.log("Sensor successfully deleted!");
                    $("#" + idModalCopy).modal("hide");
                    updateChart();
                  });
              });
            $("#" + idModule).append(
              '<div class="module-name"><h5 class="card-text mt-4 ">' +
                sensorName +
                '</h5>'+
                '<button type="button" data-bs-toggle="modal"' +
                'data-bs-target="#' +
                idDeleteSensorModal +
                '" class=" btn-sensor-existing set-to-left add-sensor-button" aria-expanded="true"' +
                'aria-controls="collapseSensor">' +
                '<i class="bx bx-trash"></i>' +
                "</button></div>"
                +'<div class="chartWrapper"><div class=" mt-3 mb-1 ' +
                classWrapperModule +
                ' cw"><div class="' +
                classWrapper2Module +
                ' cw2"><canvas class="chart" id="' +
                chartId +
                '"></canvas></div></div><canvas id="' +
                chartAxisId +
                '" height="300" width="20"></canvas></div>'
            );

            var ctx = document.getElementById(chartId).getContext("2d"),
              gradient = ctx.createLinearGradient(0, 0, 0, 450);

            // gradient.addColorStop(0.75, "rgba(92, 183, 188,0.3)");
            gradient.addColorStop(0, "rgba(75, 215, 147,0.5)");
            gradient.addColorStop(0.5, "rgba(250,250,250,0)");
            var chartctx = {
              type: "line",
              data: {
                datasets: [
                  {
                    data: 0,
                    backgroundColor: gradient,
                    borderWidth: 1,
                    borderColor: "#5cb7bc",
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [
                    {
                      gridLines: {
                        color: "rgba(200, 200, 200, 0.05)",
                        lineWidth: 1,
                      },
                    },
                  ],
                  yAxes: [
                    {
                      gridLines: {
                        color: "rgba(200, 200, 200, 0.08)",
                        lineWidth: 1,
                      },
                    },
                  ],
                },
                elements: {
                  line: {
                    tension: 0.4,
                  },
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
                tooltips: {
                  mode: "index",
                  intersect: false,
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            };

            var myChart = new Chart(ctx, chartctx);
            let timestampArray = sensorReading.map((a) => a.timestamp);
            newChartArray.push({
              id: chartId,
              chart: myChart,
              timestamp: timestampArray,
            });
            // sensorReading.sort((a, b) => a.timestamp - b.timestamp); //in case sorting is needed

            sensorReading.forEach((e) => {
              var d = new Date(e.timestamp * 1000);
              myChart.data.labels.push(d.toLocaleDateString("en", options));
              myChart.data.datasets.forEach((dataset) => {
                dataset.data.push(e[sensorName]);
              });
            });

            myChart.update();
            addLegend(
              myChart,
              chartAxisId,
              classWrapperModule,
              classWrapper2Module,
              sensorReading.length
            );
            addDragScroll(classWrapperModule);
          }
        });
        setTotalSensor(totalSensor);
        resolve(newChartArray);
      });
  });
}

// set total sensor
function setTotalSensor(totalSensor){
  console.log(totalSensor)
  document.getElementById("sensor-total").innerHTML = totalSensor + " Online"
}

// update the chart
function updateChart() {
  $("#chart-area").empty();
  $("#modal-area").empty();
  chartHandler();
}

async function chartHandler() {
  let arrayOfChart = await createChart();
  try {
    unsubscribe();
  } catch (err) {
    console.log("unsubscribe has not been set yet");
  }
  console.log(arrayOfChart);
  unsubscribe = db
    .collection("users")
    .doc(userUid)
    .collection("sensor")
    .onSnapshot((snapshot) => {
      console.log("listener is called");
      snapshot.forEach((docs) => {
        var sensorList = docs.data().sensors;
        var moduleName = docs.id;
        var nickname = docs.data().nick;
        var groupName = docs.data().group;
        var moduleDesc = docs.data().desc;
        var sensorReading = docs.data().reading;
        var idGroup = "card-" + groupName;
        var idModule = "wrapper-" + moduleName + "-" + groupName;

        if (sensorReading.length != 0) {
          for (y = 0; y < sensorList.length; y++) {
            var sensorName = sensorList[y];
            var classWrapperModule =
              "chartAreaWrapper-" +
              sensorName +
              "-" +
              moduleName +
              "-" +
              groupName;

            var classWrapper2Module =
              "chartAreaWrapper2" +
              sensorName +
              "-" +
              moduleName +
              "-" +
              groupName;
            var chartId =
              "chart-" + sensorName + "-" + moduleName + "-" + groupName;

            var chartAxisId =
              "chartAxis-" + sensorName + "-" + moduleName + "-" + groupName;

            arrayOfChart.forEach((chartInstance) => {
              if (chartId == chartInstance.id) {
                isFound = true;
                let latestLocalData =
                  chartInstance.timestamp[chartInstance.timestamp.length - 1];
                if (
                  sensorReading[sensorReading.length - 1].timestamp >
                  latestLocalData
                ) {
                  console.log(
                    "New data added to :" +
                      chartInstance.id +
                      " | value :" +
                      sensorReading[sensorReading.length - 1][sensorName]
                  );
                  var d = new Date(
                    sensorReading[sensorReading.length - 1].timestamp * 1000
                  );
                  chartInstance.chart.data.labels.push(
                    d.toLocaleDateString("en", options)
                  );
                  chartInstance.chart.data.datasets.forEach((dataset) => {
                    dataset.data.push(
                      sensorReading[sensorReading.length - 1][sensorName]
                    );
                  });
                }
                chartInstance.chart.update();
                addLegend(
                  chartInstance.chart,
                  chartAxisId,
                  classWrapperModule,
                  classWrapper2Module,
                  sensorReading.length
                );
              }
            });
          }
        } else {
          console.log("Still no sensor read");
        }
      });
    });
}
window.onload = function () {
  auth.onAuthStateChanged((user) => {
    if (user) {
      isLoggedIn = true;
      console.log("user logged in: ", user);
      userUid = auth.currentUser.uid;
      getWelcomeMessage();
      chartHandler();
    } else {
      console.log("user logged out");
      userUid = null;
      document.location.href = window.location.origin + "/index.html";
    }
  });
};
