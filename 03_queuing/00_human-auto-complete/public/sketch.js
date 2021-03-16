// Open and connect input socket
let socket = io();

// Listen for confirmation of connection
socket.on("connect", function() {
  console.log("Connected", socket.id);
});

// String being typed
let str = "";
// Is it my turn?
let myTurn = false;

// Paragraph element
let p;

function setup() {
  noCanvas();

  // Create paragraph element
  p = createP("");

  // Listen for my turn
  socket.on("go", function() {
    myTurn = true;
    p.removeClass("disabled")
  });

  // Listen for changes to text
  socket.on("add", function(data) {
    // Update string
    str += data;
    // Update paragraph element
    p.html(str);
  });

  socket.on("remove", function() {
    // Remove last character from string
    str = str.substring(0, str.length - 1);
    // Update paragraph element
    p.html(str);
  });
}

// Only listen for ASCII keystrokes
function keyTyped() {
  // Send data
  if (myTurn) socket.emit("add", key);
}

// Delete things
function keyPressed() {
  if (myTurn) {
    // Send message to remove
    if (keyCode == DELETE || keyCode == BACKSPACE) {
      socket.emit("remove");
    }
    // You're done with your turn at each word break
    else if (keyCode == ENTER || keyCode == RETURN || key == " ") {
      // Send a space
      socket.emit("add", " ");
      socket.emit("next");
      // No longer your turn
      myTurn = false;
      // Disable paragraph
      p.addClass("disabled");
    }
  }
}
