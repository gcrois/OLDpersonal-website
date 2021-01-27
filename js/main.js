/*let link_busy = {};

function setup_link(id, label, display, link) {
  elm = $("#" + id);
  console.log(elm, "added listener")

  link_busy[id] = false;

  elm.mouseover(function(){
    if (!link_busy[id]) {
      backspace(id);
      link_busy[id] = true;
      type_out(id, display);
    }
  });

  elm.mouseout(function(){
    if (link_busy[id]) {
      link_busy[id] = false;
      backspace(id)
      while (!link_busy[id]);
      type_out(id, label);
    }

    //type_out(id, display)
    //write_link(id, label, display, link);
  });

}

function write_link(id, label, display, link) {
  console.log(arguments)
}

function write_label() {

}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function type_out(id, msg) {
  $("#" + id)[0].innerHTML += msg[0];
  msg = msg.substring(1);
  if (msg.length && link_busy[id]) {
    setTimeout(function(){type_out(id, msg);}, 100 - getRandomInt(100));
  } else {
    link_busy[id] = false;
  }
}

function backspace(id) {
  let elm = $("#" + id);
  if (elm.text()) {
    elm.text(elm.text().slice(0, -1));
    setTimeout(function(){backspace(id);}, 20 - getRandomInt(10));
  }
}*/

/*
let links = {};

class Link {
  constructor(elm, label, link) {
    this.elm = elm;
    this.label = label;
    this.link = link;
    this.goal = "";

    elm.mouseover(function(){
      this.goal = label;
    });

    elm.mouseout(function(){
      this.goal = link;
    });
  }
}

function setup_link(id, label, display, link) {
  elm = $("#" + id);

  link[id].hover = false;
}

String.prototype.replaceAt = function(index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }
 
    return this.substring(0, index) + replacement + this.substring(index + 1);
}

function backspace(id, desired_hover, next, args, loc) {
  let elm = $("#" + id);
  if (loc == undefined) {
    loc = elm.text().length - 1;
  }
  if ((new Set(elm.text())).size != 1 && link_hover[id] == desired_hover) {
    console.log("backspacing");
    elm.text(elm.text().replaceAt(loc, "\xa0"));
    setTimeout(function(){backspace(id, desired_hover, loc - 1);}, 20 - getRandomInt(10));
  } else {
    next(...args);
  }
}

function type_out(id, msg, desired_hover) {
  let elm = $("#" + id);
  if (elm.text() != msg && desired_hover == link_hover[id]) {
    let first_emptychar = elm.text().replaceAll('\xa0','').length;
    elm.text(elm.text().replaceAt(first_emptychar, msg[first_emptychar]));
    setTimeout(function(){type_out(id, msg);}, 100 - getRandomInt(100));
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
*/

