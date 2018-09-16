$(document).ready(() => {

// Bringing in Firebase
var config = {
    apiKey: "AIzaSyCFGxI2aunPoDWYmMtKA9L45MuJ4sFfr0M",
    authDomain: "train-tracking-application.firebaseapp.com",
    databaseURL: "https://train-tracking-application.firebaseio.com",
    projectId: "train-tracking-application",
    storageBucket: "train-tracking-application.appspot.com",
    messagingSenderId: "172820875504"
  };
  firebase.initializeApp(config);

// Creating a variable for the Firebase database
var database = firebase.database();

// Creating the initial variables for the entries
var name = "";
var destination = "";
var initialTime = "";
var timeFormat = "HH:mm";
var frequency = 0;
var format = dateFns.format;



// Capturing button click to submit a new train
$("#submit-train").on("click", function(event) {
    event.preventDefault();

    name = $("#input-name").val().trim();
    destination = $("#input-destination").val().trim();
    initialTime = $("#input-time").val().trim();
    var convertedTime = format(initialTime, timeFormat);
    frequency = $("#input-frequency").val().trim();
    difference = dateFns.differenceInMinutes(new Date(), dateFns.subYears(convertedTime, 1));
    timeApart = difference % frequency;
    minutesUntilDeparture = frequency - timeApart;
    console.log(minutesUntilDeparture);
    nextTrain = dateFns.addMinutes(new Date(), minutesUntilDeparture);

    database.ref().push({
      name: name,
      destination: destination,
      initialTime: initialTime,
      frequency: frequency,
      minutesUntilDeparture: minutesUntilDeparture,
      nextTrain: nextTrain,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

// Firebase watcher
database.ref().on("child_added", function(childSnapshot) {

  var snapvalue = childSnapshot.val();

  console.log(snapvalue.name);
  console.log(snapvalue.destination);
  console.log(snapvalue.initialTime);
  console.log(snapvalue.frequency);
  console.log(snapvalue.minutesUntilDeparture);
  console.log(snapvalue.nextTrain);
  console.log(snapvalue.dateAdded);

  $("#train-data").append(
    "<tr>" +
    "<td>" + snapvalue.name + "</td>" +
    "<td>" + snapvalue.destination + "</td>" +
    "<td>" + snapvalue.frequency + "</td>" +
    "<td>" + snapvalue.nextTrain + "</td>" +
    "<td>" + snapvalue.minutesUntilDeparture + "</td>" +
    "</tr>"
  );
});

});