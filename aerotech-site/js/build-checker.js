/* =========================================================
   AeroTech - Build Checker page
   Checks if the parts picked in the dropdowns work together.
   Rules checked:
     - CPU socket matches motherboard socket
     - RAM type (DDR4 / DDR5) matches the motherboard
     - Motherboard size fits in the case
     - Graphics card is not too long for the case
     - Power supply is big enough for the parts
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  // the ids of all the dropdowns
  var partNames = ["cpu", "mobo", "ram", "gpu", "storage", "psu", "case"];

  var form = document.getElementById("build-form");
  var checkBtn = document.getElementById("check-btn");
  var addAllBtn = document.getElementById("add-all-btn");
  var cartMessage = document.getElementById("cart-message");
  var problemList = document.getElementById("problem-list");

  // Gets the info about the part picked in a dropdown.
  // Returns null if nothing is picked yet.
  function getPart(name) {
    var select = document.getElementById("select-" + name);
    if (select.value === "") {
      return null;
    }
    var option = select.options[select.selectedIndex];
    return {
      name: option.getAttribute("data-name"),
      price: Number(option.getAttribute("data-price")),
      socket: option.getAttribute("data-socket"),
      ram: option.getAttribute("data-ram"),
      size: option.getAttribute("data-size"),
      watts: Number(option.getAttribute("data-watts")) || 0,
      length: Number(option.getAttribute("data-length")) || 0,
      maxgpu: Number(option.getAttribute("data-maxgpu")) || 0,
      supply: Number(option.getAttribute("data-supply")) || 0
    };
  }

  // Works out all the problems with the current build.
  // Each problem has a message and a list of which parts are the cause.
  function findProblems(p) {
    var problems = [];

    if (p.cpu && p.mobo && p.cpu.socket !== p.mobo.socket) {
      problems.push({
        parts: ["cpu", "mobo"],
        message: "The CPU socket (" + p.cpu.socket + ") does not match the motherboard socket (" + p.mobo.socket + ")."
      });
    }

    if (p.ram && p.mobo && p.ram.ram !== p.mobo.ram) {
      problems.push({
        parts: ["ram", "mobo"],
        message: "The motherboard needs " + p.mobo.ram + " memory but you picked " + p.ram.ram + "."
      });
    }

    // an ATX motherboard will not fit in a Micro-ATX case
    if (p.mobo && p.case && p.mobo.size === "ATX" && p.case.size === "mATX") {
      problems.push({
        parts: ["mobo", "case"],
        message: "A full ATX motherboard will not fit in this small case."
      });
    }

    if (p.gpu && p.case && p.gpu.length > p.case.maxgpu) {
      problems.push({
        parts: ["gpu", "case"],
        message: "The graphics card is " + p.gpu.length + "mm long but the case only fits " + p.case.maxgpu + "mm."
      });
    }

    var watts = getTotalWatts(p);
    if (p.psu && p.psu.supply < watts + 100) {
      problems.push({
        parts: ["psu"],
        message: "This build uses about " + watts + "W so you need a power supply of at least " + (watts + 100) + "W."
      });
    }

    return problems;
  }

  // adds up the watts for every part that is picked
  function getTotalWatts(p) {
    var total = 0;
    for (var i = 0; i < partNames.length; i++) {
      var part = p[partNames[i]];
      if (part) {
        total = total + part.watts;
      }
    }
    return total;
  }

  // Updates the whole page. showDetails is true when the
  // "Check Compatibility" button was clicked.
  function updateBuild(showDetails) {
    var p = {};
    var picked = 0;
    var total = 0;

    for (var i = 0; i < partNames.length; i++) {
      var name = partNames[i];
      p[name] = getPart(name);
      if (p[name]) {
        picked++;
        total = total + p[name].price;
      }
    }

    var problems = findProblems(p);

    // tick or cross next to each dropdown
    for (var j = 0; j < partNames.length; j++) {
      var partName = partNames[j];
      var icon = document.getElementById("status-" + partName);
      icon.className = "status-icon";
      icon.textContent = "";

      if (p[partName]) {
        var hasProblem = false;
        for (var k = 0; k < problems.length; k++) {
          if (problems[k].parts.indexOf(partName) !== -1) {
            hasProblem = true;
          }
        }
        if (hasProblem) {
          icon.textContent = "\u2717";
          icon.className = "status-icon bad";
        } else {
          icon.textContent = "\u2713";
          icon.className = "status-icon ok";
        }
      }
    }

    // summary box
    document.getElementById("sum-cpu").textContent = p.cpu ? p.cpu.name : "\u2014";
    document.getElementById("sum-mobo").textContent = p.mobo ? p.mobo.name : "\u2014";
    document.getElementById("sum-ram").textContent = p.ram ? p.ram.name : "\u2014";
    document.getElementById("sum-gpu").textContent = p.gpu ? p.gpu.name : "\u2014";
    document.getElementById("sum-watts").textContent = getTotalWatts(p) + "W";
    document.getElementById("sum-total").textContent = "$" + total.toLocaleString("en-US", { minimumFractionDigits: 2 });

    var status = document.getElementById("sum-status");
    if (picked === 0) {
      status.textContent = "Pick some parts to get started";
      status.className = "summary-status";
    } else if (problems.length > 0) {
      status.textContent = "\u2717 " + problems.length + " problem(s) found";
      status.className = "summary-status bad";
    } else if (picked < partNames.length) {
      status.textContent = "\u2713 Looking good so far (" + picked + " of " + partNames.length + " parts)";
      status.className = "summary-status ok";
    } else {
      status.textContent = "\u2713 All Parts Compatible";
      status.className = "summary-status ok";
    }

    // list of problems, only shown after clicking the check button
    problemList.innerHTML = "";
    if (showDetails) {
      if (picked === 0) {
        problemList.innerHTML = "<li>Choose at least one part first.</li>";
      } else if (problems.length === 0) {
        problemList.innerHTML = "<li class=\"good\">No problems found!</li>";
      } else {
        for (var m = 0; m < problems.length; m++) {
          var li = document.createElement("li");
          li.textContent = problems[m].message;
          problemList.appendChild(li);
        }
      }
    }

    cartMessage.textContent = "";
    return { picked: picked, problems: problems };
  }

  // update whenever a dropdown changes
  form.addEventListener("change", function () {
    updateBuild(false);
  });

  // reset button: wait a moment so the form is cleared first
  form.addEventListener("reset", function () {
    setTimeout(function () {
      updateBuild(false);
    }, 0);
  });

  checkBtn.addEventListener("click", function () {
    updateBuild(true);
  });

  addAllBtn.addEventListener("click", function () {
    var result = updateBuild(false);

    if (result.picked === 0) {
      cartMessage.textContent = "Pick some parts first!";
      cartMessage.className = "cart-message bad";
    } else if (result.problems.length > 0) {
      cartMessage.textContent = "Fix the problems first (click Check Compatibility to see them).";
      cartMessage.className = "cart-message bad";
    } else {
      cartMessage.textContent = "Added " + result.picked + " part(s) to your cart!";
      cartMessage.className = "cart-message ok";
    }
  });

  updateBuild(false);
});
