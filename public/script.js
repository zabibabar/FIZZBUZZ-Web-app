//Sample code for get and post provided by Spenser
function get(url) {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.onload = function() {
      resolve({ status: http.status, data: JSON.parse(http.response) });
    };
    http.open("GET", url);
    http.send();
  });
}

function post(url, data) {
  data = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    http.onload = function() {
      resolve({ status: http.status, data: JSON.parse(http.response) });
    };
    http.open("POST", url);
    //Make sure that the server knows we're sending it json data.
    http.setRequestHeader("Content-Type", "application/json");
    http.send(data);
  });
}

//Runs when login page is loaded
function login() {
  //stores the username for the current session in local storage
  var username = document.getElementById("uname").value;
  localStorage.setItem("username", username);

  //if a username is entered the score is retrieved, and main window opened
  if (username) {
    //using the provided function to get the score and saving it local storage
    get("http://127.0.0.1:3000/" + username).then(function(response) {
      if (response.status == 200) {
        var score = response.data.score;
        localStorage.setItem("score", score);
      } else {
        //User not found.
        //response.data is null
        console.log("User not found");
        post("http://127.0.0.1:3000/" + username, { score: 0 }); //create a new user.
      }
      window.open("main.html", "_self");
    });
  }
}

//Runs when the main page is loaded
function loadScore() {
  //Retrieves the username
  var username = localStorage.getItem("username");
  get("http://127.0.0.1:3000/" + username).then(function(response) {
    if (response.status == 200) {
      var score = parseInt(response.data.score);

      document.getElementById("hiddenCounter").innerHTML = score; //Save the hidden counter
      if (score) {
        if (score % 3 == 0 && score % 5 == 0) score = "FIZZBUZZ";
        else if (score % 3 == 0) score = "FIZZ";
        else if (score % 5 == 0) score = "BUZZ";
      }
      //New score displayed
      document.getElementById("numDisplay").innerHTML = score; //Display the score
    } else document.getElementById("numDisplay").innerHTML = "Click increment to begin!";
  });
}

//When increment button on the main page is clicked
function increment() {
  //Retrieves the username
  var username = localStorage.getItem("username");
  //Gets the score when increment was clicked
  let currVal = parseInt(
    document.getElementById("hiddenCounter").innerHTML,
    10
  );
  let newVal = currVal + 1; //new score

  //posts and set the new score
  post("http://127.0.0.1:3000/" + username, { score: newVal });
  document.getElementById("hiddenCounter").innerHTML = newVal;

  //Fizz buzz calculation
  if (newVal % 3 == 0 && newVal % 5 == 0) newVal = "FIZZBUZZ";
  else if (newVal % 3 == 0) newVal = "FIZZ";
  else if (newVal % 5 == 0) newVal = "BUZZ";

  //New score displayed
  document.getElementById("numDisplay").innerHTML = newVal;
}
