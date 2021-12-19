/*
TODO

create parsemodule untuk parse data biar bisa dimunculin di chart

data udh otomatis terupdate meskipun ada di dalem auth.onAuthStateChange
which is good

ambil label dari key object nya maybe
*/

var isLoggedIn = false;
var userUid;
var snapshot;

var chart = new Chart(document.getElementById("canvas"), {
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
    title: {
      display: true,
      text: "Temperature",
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
});

function addData(data) {
  if (data) {
    chart.data.labels.push(data[0].data().timestamp);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data[0].data().temperature);
    });
    chart.update();
  }
}

function updateData() {
  console.log("Update Data");
  db.collection("users")
    .doc(userUid)
    .collection("sensor")
    // .orderBy('field')
    .doc("kandang")
    // .collection("sensor1")
    .onSnapshot((e) => {
      console.log(e._document.data.internalValue);
      console.log(e);
      // addData(e.docs);
      // console.log(e.data());
      // e.docs.forEach(data=>{
      //   console.log(data);
      // })
    });
}

window.onload = function () {
  auth.onAuthStateChanged((user) => {
    if (user) {
      isLoggedIn = true;
      console.log("user logged in: ", user);
      userUid = auth.currentUser.uid;
      updateData();
    } else {
      console.log("user logged out");
      userUid = null;
      document.location.href = window.location.origin + "/index.html";
    }
  });
};

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
