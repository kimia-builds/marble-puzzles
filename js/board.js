// The locked board, the ramp tray, and drag-to-place.
// Which puzzle to show comes from the address: index.html?puzzle=3 (default 1).
// Session 5 (the journey) will replace this with proper page-to-page progress.
(function () {
  "use strict";

  // ---- sizes (pixels on screen) ----
  var SPRITE = 56;            // one ttsim picture is 96px; shown at 56px so 1 ttsim unit = K screen pixels
  var K = SPRITE * 1.5 / 96;  // ttsim draws its 64-unit parts in 96px pictures
  var COL = 68 * K;           // one column step (ttsim spacing is 68 units, same for rows)
  var ROW = 68 * K;           // one row step
  var MAX_COL = 5;            // board runs from column -5 to +5
  var SNAP = 44;              // how close a drop must be to a spot to count
  var SHEET = 1040, FRAME = 96;
  var FRAMES = {                          // "Ramp-m" and "Crossover-m" in ttsim's parts.json
    ramp: { x: 108, y: 732 },
    crossover: { x: 108, y: 628 }
  };

  var allPuzzles = window.PUZZLES.puzzles;
  var wanted = parseInt(new URLSearchParams(window.location.search).get("puzzle"), 10);
  if (!(wanted >= 1 && wanted <= allPuzzles.length)) wanted = 1;
  var puzzle = allPuzzles[wanted - 1];

  // temporary "jump to puzzle" links, for checking each puzzle (the journey replaces these)
  var pickerEl = document.getElementById("picker");
  allPuzzles.forEach(function (p, i) {
    var a = document.createElement("a");
    a.href = "?puzzle=" + (i + 1);
    a.textContent = i + 1;
    a.title = p.name;
    if (i + 1 === wanted) a.className = "current";
    pickerEl.appendChild(a);
  });
  document.title = "Marble Puzzles: " + puzzle.name;
  var lastRow = 10;           // bottom row of spots
  var boardEl = document.getElementById("board");
  var trayEl = document.getElementById("tray");
  var countEl = document.getElementById("tray-count");

  var PAD = 24;
  var TOP = 100;              // room for the funnels above row 0
  var boardW = 2 * MAX_COL * COL + SPRITE + 2 * PAD - 0;
  var LEVER_ZONE = 64;        // room under the last row for the two levers
  var boardH = TOP + lastRow * ROW + SPRITE / 2 + PAD + LEVER_ZONE;
  var leverY = TOP + lastRow * ROW + SPRITE / 2 + 8;   // top edge of the levers: a marble reaching this has "hit" one
  var originX = boardW / 2;   // x of column 0
  var originY = TOP;          // y of row 0

  boardEl.style.width = boardW + "px";
  boardEl.style.height = boardH + "px";

  document.getElementById("puzzle-name").textContent = puzzle.name;
  document.getElementById("start").className = puzzle.start_colour || "blue";
  document.getElementById("start").textContent = "Start (lets out a " + (puzzle.start_colour || "blue") + " marble)";
  document.getElementById("goal").textContent = (puzzle.practice ? "Practice: try anything, there's no winning or losing here. " : "") + puzzle.goal_text;

  function spotX(col) { return originX + col * COL; }
  function spotY(row) { return originY + row * ROW; }
  function isSpot(row, col) {
    return row >= 0 && row <= lastRow && Math.abs(col) <= MAX_COL && (row + col) % 2 === 0;
  }
  function key(row, col) { return row + "," + col; }

  function sprite(el, size, kind) {
    var frame = FRAMES[kind || "ramp"];
    var s = size / FRAME;
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.backgroundSize = (SHEET * s) + "px " + (SHEET * s) + "px";
    el.style.backgroundPosition = (-frame.x * s) + "px " + (-frame.y * s) + "px";
  }

  // kind is "ramp" (with a lean) or "crossover" (no lean; marbles pass straight across)
  function makeRamp(lean, extraClass, kind) {
    kind = kind || "ramp";
    var el = document.createElement("div");
    el.className = "ramp " + kind + " " + (extraClass || "");
    el.setAttribute("data-lean", lean || "none");
    el.setAttribute("data-kind", kind);
    sprite(el, SPRITE, kind);
    return el;
  }

  function placeRampEl(el, row, col) {
    el.style.left = (spotX(col) - SPRITE / 2) + "px";
    el.style.top = (spotY(row) - SPRITE / 2) + "px";
  }

  // ---- draw the fixed parts of the board ----
  var occupied = {};          // "row,col" -> true for every ramp (locked or mine)

  for (var r = 0; r <= lastRow; r++) {
    for (var c = -MAX_COL; c <= MAX_COL; c++) {
      if (!isSpot(r, c)) continue;
      var peg = document.createElement("div");
      peg.className = "peg";
      peg.style.left = spotX(c) + "px";
      peg.style.top = spotY(r) + "px";
      boardEl.appendChild(peg);
    }
  }

  var funnelEls = {};
  [["blue", -2, puzzle.balls.blue], ["red", 2, puzzle.balls.red]].forEach(function (f) {
    var fun = document.createElement("div");
    fun.className = "funnel " + f[0];
    fun.textContent = f[2];
    funnelEls[f[0]] = fun;
    fun.style.left = spotX(f[1]) + "px";
    fun.style.top = (spotY(0) - 85) + "px";
    boardEl.appendChild(fun);
  });

  // the two levers at the bottom: left lets the next blue marble out, right the next red
  var leverEls = {};
  [["left", "Left lever", "lets out the next blue marble"], ["right", "Right lever", "lets out the next red marble"]].forEach(function (l) {
    var el = document.createElement("div");
    el.className = "lever " + l[0];
    el.innerHTML = "<strong>" + l[1] + "</strong><span>" + l[2] + "</span>";
    el.style.top = leverY + "px";
    boardEl.appendChild(el);
    leverEls[l[0]] = el;
  });

  var lockedEls = [];
  puzzle.preplaced_ramps.forEach(function (p) {
    var el = makeRamp(p.rolls, "locked");
    lockedEls.push(el);
    placeRampEl(el, p.row, p.col);
    boardEl.appendChild(el);
    occupied[key(p.row, p.col)] = true;
  });
  var lockedCrossovers = puzzle.preplaced_crossovers || [];
  lockedCrossovers.forEach(function (p) {
    var el = makeRamp("none", "locked", "crossover");
    placeRampEl(el, p.row, p.col);
    boardEl.appendChild(el);
    occupied[key(p.row, p.col)] = true;
  });

  // ---- the player's ramps ----
  var mine = {};              // "row,col" -> element (ramps and crossovers I placed)
  var allowed = { ramp: puzzle.ramps_to_add || 0, crossover: puzzle.crossovers_to_add || 0 };

  function kindOf(el) { return el.getAttribute("data-kind"); }
  function placedCount(kind) {
    return Object.keys(mine).filter(function (k) { return kindOf(mine[k]) === kind; }).length;
  }
  function remaining(kind) { return allowed[kind] - placedCount(kind); }

  function refreshTray() {
    var left = [], total = 0;
    ["ramp", "crossover"].forEach(function (kind) {
      var n = remaining(kind);
      total += n;
      if (allowed[kind] > 0) left.push(n + (kind === "ramp" ? (n === 1 ? " ramp" : " ramps") : (n === 1 ? " crossover" : " crossovers")));
      Array.prototype.forEach.call(trayEl.querySelectorAll('.tray-ramp[data-kind="' + kind + '"]'), function (el) {
        el.parentNode.classList.toggle("empty", n === 0);
        el.parentNode.style.display = allowed[kind] > 0 ? "" : "none";
      });
    });
    countEl.textContent = total === 0 ? "All parts placed" : left.join(", ") + " left to place";
  }

  Array.prototype.forEach.call(trayEl.querySelectorAll(".tray-ramp"), function (el) {
    var kind = el.getAttribute("data-kind");
    sprite(el, SPRITE, kind);
    el.addEventListener("pointerdown", function (e) {
      if (remaining(kind) === 0) return;
      startDrag(e, el.getAttribute("data-lean"), kind);
    });
  });

  function addMine(row, col, lean, kind) {
    kind = kind || "ramp";
    var el = makeRamp(lean, "mine", kind);
    placeRampEl(el, row, col);
    boardEl.appendChild(el);
    mine[key(row, col)] = el;
    occupied[key(row, col)] = true;
    changed();
    el.addEventListener("pointerdown", function (e) {
      // pick it up: it leaves the board and is carried until dropped
      delete mine[key(row, col)];
      delete occupied[key(row, col)];
      boardEl.removeChild(el);
      changed();
      refreshTray();
      startDrag(e, lean, kind);
    });
  }

  // ---- dragging ----
  var drag = null;

  function startDrag(e, lean, kind) {
    if (drag) return;
    e.preventDefault();
    var ghost = makeRamp(lean, "ghost", kind);
    document.body.appendChild(ghost);

    var spots = [];
    for (var r = 0; r <= lastRow; r++) {
      for (var c = -MAX_COL; c <= MAX_COL; c++) {
        if (!isSpot(r, c) || occupied[key(r, c)]) continue;
        var s = document.createElement("div");
        s.className = "spot";
        s.style.width = "26px";
        s.style.height = "26px";
        s.style.left = (spotX(c) - 13) + "px";
        s.style.top = (spotY(r) - 13) + "px";
        boardEl.appendChild(s);
        spots.push({ row: r, col: c, el: s });
      }
    }

    drag = { lean: lean, kind: kind, ghost: ghost, spots: spots, target: null, id: e.pointerId };
    moveDrag(e);
    document.addEventListener("pointermove", moveDrag);
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", cancelDrag);
  }

  function moveDrag(e) {
    if (!drag) return;
    drag.ghost.style.left = (e.clientX - SPRITE / 2) + "px";
    drag.ghost.style.top = (e.clientY - SPRITE / 2) + "px";

    var box = boardEl.getBoundingClientRect();
    var px = e.clientX - box.left - boardEl.clientLeft;
    var py = e.clientY - box.top - boardEl.clientTop;
    var best = null, bestD = SNAP;
    drag.spots.forEach(function (s) {
      var d = Math.hypot(px - spotX(s.col), py - spotY(s.row));
      if (d < bestD) { bestD = d; best = s; }
    });
    drag.target = best;
    drag.spots.forEach(function (s) { s.el.classList.toggle("near", s === best); });
  }

  function finishDrag() {
    document.removeEventListener("pointermove", moveDrag);
    document.removeEventListener("pointerup", endDrag);
    document.removeEventListener("pointercancel", cancelDrag);
    document.body.removeChild(drag.ghost);
    drag.spots.forEach(function (s) { boardEl.removeChild(s.el); });
    var d = drag;
    drag = null;
    return d;
  }

  function endDrag() {
    var d = finishDrag();
    if (d.target) addMine(d.target.row, d.target.col, d.lean, d.kind);
    refreshTray();
  }

  function cancelDrag() {
    finishDrag();
    refreshTray();
  }

  // ---- share the board with the marble code (js/marbles.js) ----
  var listeners = [];
  function changed() { listeners.forEach(function (f) { f(); }); }
  function getRamps() {
    var list = puzzle.preplaced_ramps.map(function (p, i) { return { row: p.row, col: p.col, rolls: p.rolls, el: lockedEls[i] }; });
    Object.keys(mine).forEach(function (k) {
      if (kindOf(mine[k]) !== "ramp") return;
      var rc = k.split(",");
      list.push({ row: +rc[0], col: +rc[1], rolls: mine[k].getAttribute("data-lean"), el: mine[k] });
    });
    return list;
  }
  function getCrossovers() {
    var list = lockedCrossovers.map(function (p) { return { row: p.row, col: p.col }; });
    Object.keys(mine).forEach(function (k) {
      if (kindOf(mine[k]) !== "crossover") return;
      var rc = k.split(",");
      list.push({ row: +rc[0], col: +rc[1] });
    });
    return list;
  }
  // for testing only (not used by the page): put parts on the board the way a player would
  function placeRamp(row, col, lean) {
    if (!isSpot(row, col) || occupied[key(row, col)] || remaining("ramp") === 0) return false;
    addMine(row, col, lean, "ramp");
    refreshTray();
    return true;
  }
  function placeCrossover(row, col) {
    if (!isSpot(row, col) || occupied[key(row, col)] || remaining("crossover") === 0) return false;
    addMine(row, col, "none", "crossover");
    refreshTray();
    return true;
  }
  function clearMine() {
    Object.keys(mine).forEach(function (k) { boardEl.removeChild(mine[k]); delete mine[k]; delete occupied[k]; });
    changed();
    refreshTray();
  }
  function getMine() {
    return Object.keys(mine).map(function (k) {
      var rc = k.split(",");
      return { row: +rc[0], col: +rc[1], kind: kindOf(mine[k]), rolls: mine[k].getAttribute("data-lean") };
    });
  }
  window.BOARD = {
    getMine: getMine, placeRamp: placeRamp, placeCrossover: placeCrossover, getCrossovers: getCrossovers, clearMine: clearMine,
    el: boardEl, puzzle: puzzle, width: boardW, height: boardH, col: COL, row: ROW,
    spotX: spotX, spotY: spotY, getRamps: getRamps, K: K, originX: originX, originY: originY,
    leverY: leverY, levers: leverEls, funnels: funnelEls,
    onChange: function (f) { listeners.push(f); }
  };

  refreshTray();
})();
