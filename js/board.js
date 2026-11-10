// Session 2: the locked board, the ramp tray, and drag-to-place.
// No marbles yet. Puzzle 1 only.
(function () {
  "use strict";

  // ---- sizes (pixels on screen) ----
  var SPRITE = 56;            // one ttsim picture is 96px; shown at 56px so 1 ttsim unit = K screen pixels
  var K = SPRITE * 1.5 / 96;  // ttsim draws its 64-unit parts in 96px pictures
  var COL = 68 * K;           // one column step (ttsim spacing is 68 units, same for rows)
  var ROW = 68 * K;           // one row step
  var MAX_COL = 4;            // board runs from column -4 to +4
  var SNAP = 44;              // how close a drop must be to a spot to count
  var SHEET = 1040, FRAME = 96;
  var RAMP_FRAME = { x: 108, y: 732 };   // "Ramp-m" in ttsim's parts.json

  var puzzle = window.PUZZLES.puzzles[0];
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
  document.getElementById("goal").textContent = puzzle.goal_text;

  function spotX(col) { return originX + col * COL; }
  function spotY(row) { return originY + row * ROW; }
  function isSpot(row, col) {
    return row >= 0 && row <= lastRow && Math.abs(col) <= MAX_COL && (row + col) % 2 === 0;
  }
  function key(row, col) { return row + "," + col; }

  function sprite(el, size) {
    var s = size / FRAME;
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.backgroundSize = (SHEET * s) + "px " + (SHEET * s) + "px";
    el.style.backgroundPosition = (-RAMP_FRAME.x * s) + "px " + (-RAMP_FRAME.y * s) + "px";
  }

  function makeRamp(lean, extraClass) {
    var el = document.createElement("div");
    el.className = "ramp " + (extraClass || "");
    el.setAttribute("data-lean", lean);
    sprite(el, SPRITE);
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

  // ---- the player's ramps ----
  var mine = {};              // "row,col" -> element
  var allowed = puzzle.ramps_to_add;

  function remaining() { return allowed - Object.keys(mine).length; }

  function refreshTray() {
    var n = remaining();
    countEl.textContent = n === 0 ? "All ramps placed" : n + (n === 1 ? " ramp" : " ramps") + " left to place";
    trayEl.classList.toggle("empty", n === 0);
  }

  Array.prototype.forEach.call(trayEl.querySelectorAll(".tray-ramp"), function (el) {
    sprite(el, SPRITE);
    el.addEventListener("pointerdown", function (e) {
      if (remaining() === 0) return;
      startDrag(e, el.getAttribute("data-lean"), null);
    });
  });

  function addMine(row, col, lean) {
    var el = makeRamp(lean, "mine");
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
      startDrag(e, lean, null);
    });
  }

  // ---- dragging ----
  var drag = null;

  function startDrag(e, lean) {
    if (drag) return;
    e.preventDefault();
    var ghost = makeRamp(lean, "ghost");
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

    drag = { lean: lean, ghost: ghost, spots: spots, target: null, id: e.pointerId };
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
    if (d.target) addMine(d.target.row, d.target.col, d.lean);
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
      var rc = k.split(",");
      list.push({ row: +rc[0], col: +rc[1], rolls: mine[k].getAttribute("data-lean"), el: mine[k] });
    });
    return list;
  }
  window.BOARD = {
    el: boardEl, puzzle: puzzle, width: boardW, height: boardH, col: COL, row: ROW,
    spotX: spotX, spotY: spotY, getRamps: getRamps, K: K, originX: originX, originY: originY,
    leverY: leverY, levers: leverEls, funnels: funnelEls,
    onChange: function (f) { listeners.push(f); }
  };

  refreshTray();
})();
