/*
TODO

create parsemodule untuk parse data biar bisa dimunculin di chart

data udh otomatis terupdate meskipun ada di dalem auth.onAuthStateChange
which is good

ambil label dari key object nya maybe


*/

var isLoggedIn = false;
var sensor = [];

function parseModule(sensorData) {
  var label = [];
  var reading = [];

  for (i = 0; sensorData[i] != "end" && i < sensorData.length; i++) {
    label.push(sensorData[i]);
  }

  console.log(label);

  for (i = 0; i < sensorData.length; i += label.length) {
    reading.push(sensorData.substr(0, addy.indexOf(",")));
  }
}

auth.onAuthStateChanged((user) => {
  if (user) {
    isLoggedIn = true;
    console.log("user logged in: ", user);
    var userUid = auth.currentUser.uid;

    db.collection("users")
      .doc(userUid).collection("sensor").doc("kandang").collection("sensor1")
      .onSnapshot((snapshot) => {
        sensor = snapshot;
        snapshot.docs.forEach(doc=>{
          console.log(doc.data());
        })
        console.log(Object.keys(sensor));
      });
  } else {
    console.log("user logged out");
  }
});

var MONTHS = [""];
var config = {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: window.chartColors.red,
        borderColor: window.chartColors.red,
        data: sensor,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
    tooltips: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Month",
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Value",
          },
        },
      ],
    },
  },
};

window.onload = function () {
  var ctx = document.getElementById("canvas").getContext("2d");
  window.myLine = new Chart(ctx, config);
};
