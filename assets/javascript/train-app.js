$(document).ready(() => {

// Bringing in Firebase
var config = {
  apiKey: "CONTACT ME",
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
var frequency = 0;

// Capturing button click to submit a new train
$("#submit-train").on("click", function(event) {
    event.preventDefault();

    // Collecting user inputs
    name = $("#input-name").val().trim();
    destination = $("#input-destination").val().trim();
    initialTime = $("#input-time").val().trim();
    frequency = $("#input-frequency").val().trim();

    console.log(name);
    console.log(destination);
    console.log(initialTime);
    console.log(frequency);

    // Pushing the data to the database
    database.ref().push({
      name: name,
      destination: destination,
      initialTime: initialTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Clearing entry boxes
    $("#input-name").val("");
    $("#input-destination").val("");
    $("#input-time").val("");
    $("#input-frequency").val("");
});

// Firebase watcher
database.ref().on("child_added", function(childSnapshot) {
  // Storing the snapshot in a variable
  var snapvalue = childSnapshot.val();

  var trainName = snapvalue.name;
  var trainDestination = snapvalue.destination;
  var trainFrequency = snapvalue.frequency;
  var initialTrain = snapvalue.initialTime;

  var splitTime = initialTime.split(":");
  var initialTimeConverted = moment().hours(splitTime[0]).minutes(splitTime[1]);
  var maxTime = moment().max([moment(), initialTimeConverted]);
  var nextTrain = 0;
  var minutesUntilDeparture = 0;

  if (maxTime === initialTimeConverted) {
    nextTrain = initialTimeConverted.format("hh:mm A");
    minutesUntilDeparture = initialTimeConverted.diff(moment(), "minutes");
  } else {
    var diffTime = moment().diff(initialTimeConverted, "minutes");
    console.log(diffTime);
    var timeRemainder = diffTime % frequency;
    console.log(timeRemainder);
    minutesUntilDeparture = frequency - timeRemainder;
    console.log(minutesUntilDeparture)
    nextTrain = moment().add(minutesUntilDeparture, "minutes").format("hh:mm A")
  };


  console.log(snapvalue.name);
  console.log(snapvalue.destination);
  console.log(snapvalue.initialTime);
  console.log(snapvalue.frequency);
  console.log(minutesUntilDeparture);
  console.log(nextTrain);
  console.log(snapvalue.dateAdded);

  $("#train-data").append(
    "<tr>" +
    "<td>" + trainName + "</td>" +
    "<td>" + trainDestination + "</td>" +
    "<td>" + trainFrequency + "</td>" +
    "<td>" + nextTrain + "</td>" +
    "<td>" + minutesUntilDeparture + "</td>" +
    "</tr>"
  );
});

});