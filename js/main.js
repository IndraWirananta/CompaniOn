/*
TODO

Update chart -> data udh disimpen di array map yg isinya group[sensor], sekarang datanya itu 
bakal dipake untuk buat chart2 yang lain
*/

var isLoggedIn = false;
var userUid;
var snapshot;

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
    console.log("removed shadow");
  } else {
    document.getElementById("collapseSensor").classList.add("shadow-toolbar");
    document.getElementById("toolbar").classList.remove("shadow-toolbar");
    console.log("added shadow");
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
// Form Controller
const addSensorForm = document.getElementById("addSensorForm");
addSensorForm.addEventListener("submit", (e) => {
  e.preventDefault();

  var name = addSensorForm.sensor_name_field.value;
  var group = addSensorForm.sensor_group_field.value;
  var desc = addSensorForm.sensor_description_field.value;
  var foundSensor = false

  if (name == "" || name == null || group == "" || group == null) {
    console.log("error1");
    $("#add-sensor-alert").remove();
    $("#alert-add-sensor").append(
      '<div id="add-sensor-alert" class="alert alert-danger alert-dismissible fade show" role="alert">Name and group cannot be empty!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    );
  } else {
    db.collection("users")
      .doc(userUid)
      .collection("sensor")
      .doc(group)
      .collection(name)
      .get()
      .then((doc) => {
        console.log(doc.docs.length);
        if (doc.docs.length > 0) {
          $("#add-sensor-alert").remove();
          $("#alert-add-sensor").append(
            '<div id="add-sensor-alert" class="alert alert-danger alert-dismissible fade show" role="alert">Name already taken by other sensor!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
          );
        } else {
          //add group
          db.collection("users")
            .doc(userUid)
            .collection("sensor")
            .doc(group)
            .set({
              name: group,
              nickname: null,
            })
            //add sensor
            .then(() => {
              db.collection("users")
                .doc(userUid)
                .collection("sensor")
                .doc(group)
                .collection(name)
                .doc("info")
                .set({
                  name: name,
                  nickname: null,
                  desc: desc,
                })
                .then(() => {
                  $("#add-sensor-alert").remove();
                  $("#alert-add-sensor").append(
                    '<div id="add-sensor-alert" class="alert alert-success alert-dismissible fade show" role="alert">Sensor added successfuly!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
                  );
                  db.collection("users")
                  .doc(userUid).get().then((snapshot)=>{
                    listOfSensor = snapshot.data().sensor
                    for(i=0;i<listOfSensor.length;i++){
                      console.log(listOfSensor[i].name , group)
                      if(listOfSensor[i].name  == group && !foundSensor){
                        console.log("up")
                        foundSensor= true
                        listOfSensor[i].sensor.push(name)
                        db.collection("users")
                        .doc(userUid).update({
                          sensor: listOfSensor
                        })
                      }
                    }
                    if(!foundSensor){
                      console.log("bottom")
                      db.collection("users")
                          .doc(userUid).set({
                            sensor: firebase.firestore.FieldValue.arrayUnion({"name":group, "sensor":[name]})
                          },{merge:true})
                    }
                  })
                 
                  addSensorForm.reset();
                })
                .catch((error) => {
                  console.error("Error writing document: ", error);
                });
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        }
      })
      .catch(() => {
        console.error("Error writing document: ", error);
      });
  }
});
var ctx = document.getElementById("chart").getContext("2d");
var chartctx = {
  type: "line",
  data: {
    datasets: [
      {
        label: "Temperature",
        data: 0,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,

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

function addData(data) {
  if (data) {
    myChart.data.labels.push(data[0].data().timestamp);
    myChart.data.datasets.forEach((dataset) => {
      dataset.data.push(data[0].data().temperature);
    });
    myChart.update();
  }
}

function createChart() {
  db.collection("users")
    .doc(userUid)
    .collection("sensor")
    .get()
    .then((e) => {
      e.forEach((doc) => {});
    });
}
function updateChart() {
  
  db.collection("users").doc(userUid).get().then()
  db.collection("users").doc(userUid).collection("sensor").get().then((e)=>{
    e.forEach((doc)=>{
      db.collection("users")
          .doc(userUid)
          .collection("sensor")
          .doc(doc.id).get().then((e)=>{
            console.log(e)
          })
    });
  })
  
}

// db.collection("users")
// .doc(userUid)
// .collection("sensor")
// .doc(doc.id)
// .collection("sensor1")
// .get()
// .then((e) => {
//   e.forEach((doc) => {
//     console.log(doc.data().timestamp);
//     if (doc.id != "info") {
//       var options = {
//         weekday: "short",
//         hour: "numeric",
//         minute: "numeric",
//       };
//       var d = new Date(doc.data().timestamp * 1000);
//       myChart.data.labels.push(d.toLocaleDateString("en", options));
//       myChart.data.datasets.forEach((dataset) => {
//         dataset.data.push(doc.data().temperature);
//       });
//     }
//   });
  
//   var newwidth = $(".chartAreaWrapper2").width() + 100 * e.docs.length;
//   $(".chartAreaWrapper2").width(newwidth);
//   $(".chartAreaWrapper").animate({
//     scrollLeft: newwidth,
//   });

//   myChart.update();
//   setTimeout(function () {
//     var sourceCanvas = myChart.chart.canvas;
//     var copyWidth = myChart.scales['y-axis-0'].width + 10 ;
//     var copyHeight = myChart.scales['y-axis-0'].height + myChart.scales['y-axis-0'].top - 10;
//     var targetCtx = document.getElementById("myChartAxis").getContext("2d");
//     targetCtx.canvas.width = copyWidth;
//     targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth, copyHeight, 0, 0, copyWidth, copyHeight);
//   }, 350);



// })
// .catch((error) => {
//   console.log(error);
// });
// });
window.onload = function () {
  auth.onAuthStateChanged((user) => {
    if (user) {
      isLoggedIn = true;
      console.log("user logged in: ", user);
      userUid = auth.currentUser.uid;
      createChart();
      updateChart();
      getWelcomeMessage();
    } else {
      console.log("user logged out");
      userUid = null;
      document.location.href = window.location.origin + "/index.html";
    }
  });
};

// $(".chart-area").append(
//   '<div class="card mb-3"><div class="card-body chart"> <canvas class="canvas" id="canvas' +
//     doc.id +
//     '"></canvas></div></div>'
// );

// --------------------
// var chart = new Chart(document.getElementById("canvas"+doc.id), {
//   type: "line",
//   data: {
//     datasets: [
//       {
//         label: "Temperature",
//         data: 0,
//         fill: false,
//       },
//     ],
//   },
//   options: {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       yAxes: [
//         {
//           ticks: {
//             beginAtZero: true,
//           },
//         },
//       ],
//     },
//     title: {
//       display: true,
//       text: doc.id + " " + doc.data().nickname==null?doc.data().nickname:"",
//     },
//     tooltips: {
//       mode: "index",
//       intersect: false,
//     },
//     hover: {
//       mode: "nearest",
//       intersect: true,
//     },
//   },
// });
// -----------------------------------------------------------------------
// function parseModule(sensorData) {
//   sensorData.forEach((docs) => {
//     sensor.push(docs.data());
//   });
//   console.log(typeof sensor);

//   config = {
//     type: "line",
//     data: {
//       // labels: ["January", "February", "March", "April", "May", "June", "July"],
//       datasets: [
//         {
//           data: [{ timestamp: "Sales", temperature: 1500 }],
//         },
//       ],
//     },
//     options: {
//       parsing: {
//         xAxisKey: "timestamp",
//         yAxisKey: "temperature",
//       },
//       responsive: true,
//       title: {
//         display: true,
//         text: "Chart.js Line Chart",
//       },
//       tooltips: {
//         mode: "index",
//         intersect: false,
//       },
//       hover: {
//         mode: "nearest",
//         intersect: true,
//       },
//       scales: {
//         xAxes: [
//           {
//             display: true,
//             scaleLabel: {
//               display: true,
//               labelString: "Month",
//             },
//           },
//         ],
//         yAxes: [
//           {
//             display: true,
//             scaleLabel: {
//               display: true,
//               labelString: "Value",
//             },
//           },
//         ],
//       },
//     },
//   };

// }
