function get_link(id, label, display, link) {
  if (link == undefined) link = display
  elm = $("#" + id);
  if (elm.text() == label) {
    elm.text("");
    type_out(id, display);
    setTimeout(function(){elm.attr("href", link);}, 100);
  } else {
    //elm.text(label); elm.attr("href", "#");
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function type_out(id, msg) {
  $("#" + id)[0].innerHTML += msg[0];
  msg = msg.substring(1);
  if (msg.length) {
    setTimeout(function(){type_out(id, msg);}, 100 - getRandomInt(100));
  }
}