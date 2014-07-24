// Generated by CoffeeScript 1.7.1
var animStr, displayInfoBool, displayMode, displayModeOptions, documentKeys, dragBool, drawRandomChart, event2key, forceIn, nextAnimation, prevAnimation, redrawGraph, refreshAnimation, resizeFit, setAnimation, setCustomAnimation, staggerBool, staggerInt, toggleDrag, toggleGraph, toggleInfo, toggleStagger;

dragBool = false;

staggerBool = true;

displayInfoBool = true;

staggerInt = 50;

event2key = {
  97: "a",
  66: "b",
  99: "c",
  68: "d",
  101: "e",
  102: "f",
  71: "g",
  104: "h",
  105: "i",
  106: "j",
  107: "k",
  108: "l",
  109: "m",
  78: "n",
  111: "o",
  112: "p",
  113: "q",
  82: "r",
  83: "s",
  116: "t",
  117: "u",
  118: "v",
  119: "w",
  120: "x",
  121: "y",
  27: "esc",
  37: "left",
  39: "right",
  38: "up",
  40: "down",
  13: "enter"
};

animStr = "callout.bounce";

displayMode = "bottle";

displayModeOptions = ["bottle", "graph"];

resizeFit = function(selector) {
  return $(selector).bigtext();
};

setAnimation = function(animationName) {
  return animStr = animationName;
};

setCustomAnimation = function(animationName, animationObject) {
  $.Velocity.RegisterUI(animationName, animationObject);
  return animStr = animationName;
};

forceIn = function() {
  $("#bottle div").velocity("fadeIn");
  return $("#graph svg rect").velocity("fadeIn");
};

toggleDrag = function() {
  $(".drag-btn").toggleClass('is-active');
  return dragBool = !dragBool;
};

toggleStagger = function() {
  $(".stagger-btn").toggleClass('is-active');
  staggerBool = !staggerBool;
  return staggerInt = staggerBool ? $("#stagger-slider").val() : 0;
};

documentKeys = function(event) {
  var letter, myKey;
  myKey = event2key[event.which];
  letter = String.fromCharCode(event.charCode);
  console.log(event.type, event.which, event.charCode, myKey, letter);
  switch (myKey) {
    case "enter":
    case "a":
      return refreshAnimation();
    case "s":
      return toggleStagger();
    case "d":
      return toggleDrag();
    case "esc":
      return forceIn();
    case "n":
    case "down":
      return nextAnimation();
    case "b":
    case "up":
      return prevAnimation();
    case "g":
      return toggleGraph();
    case "r":
      return redrawGraph();
  }
};

refreshAnimation = function() {
  if (staggerBool) {
    staggerInt = $("#stagger-slider").val();
  }
  $("#bottle div").velocity(animStr, {
    stagger: staggerInt,
    drag: dragBool
  });
  return $("#graph svg rect").velocity(animStr, {
    stagger: staggerInt,
    drag: dragBool
  });
};

nextAnimation = function() {
  $("#uiPackEffects option:selected").next().attr("selected", "selected");
  setAnimation($("select option:selected").val());
  return refreshAnimation();
};

prevAnimation = function() {
  $("#uiPackEffects option:selected").prev().attr("selected", "selected");
  setAnimation($("select option:selected").val());
  return refreshAnimation();
};

toggleGraph = (function(_this) {
  return function() {
    var gcs;
    gcs = $("#graph-container-switch");
    if (gcs.hasClass("is-graph")) {
      $("#graph").velocity({
        opacity: 0
      }, {
        display: "none"
      });
      $("#container").velocity({
        opacity: 1
      }, {
        display: "inline-block"
      });
      displayMode = "bottle";
    } else {
      $("#container").velocity({
        opacity: 0
      }, {
        display: "none"
      });
      $("#graph").velocity({
        opacity: 1
      }, {
        display: "inline-block"
      });
      displayMode = '"graph';
    }
    return gcs.toggleClass("is-graph");
  };
})(this);

redrawGraph = function() {
  if ($("#graph-container-switch").hasClass("is-graph")) {
    return $("#graph").velocity({
      opacity: 0
    }, {
      display: "none",
      complete: function() {
        d3.selectAll("#graph svg").remove();
        drawRandomChart();
        return $("#graph").velocity({
          opacity: 1
        }, {
          display: "inline-block"
        });
      }
    });
  }
};

toggleInfo = function() {
  displayInfoBool = !displayInfoBool;
  if (displayInfoBool) {
    return $("#info p").velocity({
      opacity: 1
    }, {
      display: "inline-block"
    });
  } else {
    return $("#info p").velocity({
      opacity: 0
    }, {
      display: "none"
    });
  }
};

drawRandomChart = function() {
  var barPadding, chartSize, dataset, h, maxValue, minValue, num, svg, topMargin, w, _i;
  w = 600;
  h = 200;
  topMargin = 100;
  chartSize = 30;
  barPadding = 5;
  dataset = [];
  maxValue = 20;
  minValue = 2;
  for (num = _i = 1; 1 <= chartSize ? _i < chartSize : _i > chartSize; num = 1 <= chartSize ? ++_i : --_i) {
    dataset.push(Math.floor(Math.random() * (maxValue - minValue)) + minValue);
  }
  svg = d3.select("#graph").append("svg").attr("width", w).attr("height", h + topMargin);
  return svg.selectAll("rect").data(dataset).enter().append("rect").attr("x", function(d, i) {
    return i * (w / dataset.length);
  }).attr("y", function(d) {
    return h - ((d / maxValue) * h);
  }).attr("width", w / dataset.length - barPadding).attr("height", function(d) {
    return (d / maxValue) * h;
  }).attr("fill", function(d) {
    var v;
    v = (d * 10) + 30;
    return "rgb(" + v + ", " + v + ", " + (v + 10) + ")";
  });
};

$(document).ready((function(_this) {
  return function() {
    resizeFit("#bottle");
    drawRandomChart();
    toggleInfo();
    $(document).on('keyup', documentKeys);
    $("#stagger-slider").change(function() {
      return $("#stagger-slider-val").text($("#stagger-slider").val());
    });
    $("#anim").submit(function(evt) {
      evt.preventDefault();
      setAnimation($("input.anim-box").val());
      return refreshAnimation();
    });
    $("#uiPackEffects").change(function(evt) {
      evt.preventDefault();
      setAnimation($("select option:selected").val());
      return refreshAnimation();
    });
    $(".serif-btn").click(function() {
      $("#bottle").toggleClass('sans-serif');
      return $(".serif-btn").toggleClass('sans-serif');
    });
    $(".next-btn").click(function() {
      return nextAnimation();
    });
    $(".prev-btn").click(function() {
      return prevAnimation();
    });
    $(".refresh-btn").click(function() {
      return refreshAnimation();
    });
    $(".force-in-btn").click(function() {
      return forceIn();
    });
    $(".stagger-btn").click(function() {
      return toggleStagger();
    });
    $(".new-graph-btn").click(function() {
      return redrawGraph();
    });
    $(".toggle-info-btn").click(function() {
      return toggleInfo();
    });
    return $(".toggle-graph-btn").click(function() {
      return toggleGraph();
    });
  };
})(this));
