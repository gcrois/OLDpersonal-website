var x;
var y;

function init() {
  x = document.getElementById("x");
  y = document.getElementById("y");
  console.log(get_coords());
}

function get_coords() {
  return event.clientX, event.clientY;
}
