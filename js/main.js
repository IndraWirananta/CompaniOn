/*
TODO

update chart-> sort by latest timestamp -> add to chart -> profit
*/

var isLoggedIn = false;
var userUid;

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

//capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
    arrCategory.push(addCategoryInput.value);
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
        '<button type="button" onclick="deleteCategory(' +
        "'" +
        e +
        "'" +
        ')" class="category-del"><i style="vertical-align:middle" " class="bx category-delete-btn bx-x"></i></button></li>'
    );
  });
}
// delete category
function deleteCategory(e) {
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

  var name = addSensorForm.sensor_name_field.value;
  var group = addSensorForm.sensor_group_field.value;
  var desc = addSensorForm.sensor_description_field.value;

  if (
    name == "" ||
    name == null ||
    group == "" ||
    group == null ||
    arrCategory.length == 0
  ) {
    $("#add-sensor-alert").remove();
    $("#alert-add-sensor").append(
      '<div id="add-sensor-alert" class="alert alert-danger alert-dismissible fade show" role="alert">Name, group, and sensor cannot be empty!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
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
              name: name,
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
    db.collection("users")
      .doc(userUid)
      .collection("sensor")
      .get()
      .then((doc) => {
        var newChartArray = [];
        doc.forEach((docs) => {
          var sensorList = docs.data().sensors;
          var moduleName = docs.data().name;
          var groupName = docs.data().group;
          var moduleDesc = docs.data().desc;
          var sensorReading = docs.data().reading;
          var idGroup = "card-" + groupName;
          var idModule = "wrapper-" + moduleName + "-" + groupName;

          if ($("#" + idGroup).length == 0) {
            // check if element exist or not
            $("#chart-area").append(
              '<div class="card mb-4 text-start"><div class="card text-start"><div class="card-body" id="' +
                idGroup +
                '"><h2 class="card-title">' +
                capitalizeFirstLetter(groupName) +
                "</h2><br></div></div></div>"
            );
          }

          // append module card into group card
          $("#" + idGroup).append(
            '<div class="card-body group-wrapper mb-3" id="' +
              idModule +
              '"><h3 class="card-title">' +
              capitalizeFirstLetter(moduleName) +
              "</h3><p class='card-text'>" +
              capitalizeFirstLetter(moduleDesc) +
              "</p><hr /></div>"
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

            $("#" + idModule).append(
              '<h5 class="card-text mt-4 ">' +
                capitalizeFirstLetter(sensorName) +
                '</h5><div class="chartWrapper"><div class="mb-5 ' +
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
            addLegend(myChart, chartAxisId,classWrapperModule,classWrapper2Module,sensorReading.length);
            addDragScroll(classWrapperModule);
          }
        });
        resolve(newChartArray);
      });
  });
}

// update the chart
function updateChart() {
  db.collection("users")
    .doc(userUid)
    .collection("sensor")
    .onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        var sensorList = docs.data().sensors;
        var moduleName = docs.data().name;
        var groupName = docs.data().group;
        var moduleDesc = docs.data().desc;
        var sensorReading = docs.data().reading;
        var idGroup = "card-" + groupName;
        var idModule = "wrapper-" + moduleName + "-" + groupName;
        console.log(sensorList + moduleName + groupName);
      });
    });
}

async function chartHandler() {
  let arrayOfChart = await createChart();
  console.log(arrayOfChart);

  db.collection("users")
    .doc(userUid)
    .collection("sensor")
    .onSnapshot((snapshot) => {
      snapshot.forEach((docs) => {
        var sensorList = docs.data().sensors;
        var moduleName = docs.data().name;
        var groupName = docs.data().group;
        var moduleDesc = docs.data().desc;
        var sensorReading = docs.data().reading;
        var idGroup = "card-" + groupName;
        var idModule = "wrapper-" + moduleName + "-" + groupName;

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
              addLegend(chartInstance.chart, chartAxisId,classWrapperModule,classWrapper2Module, sensorReading.length);
            }
          });
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
