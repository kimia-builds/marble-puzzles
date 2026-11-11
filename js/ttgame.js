// Marble Puzzles on the real ttsim engine.
//
// ttsim (Jesse Crossen, Unlicense) is loaded exactly as it ships: vendor/ttsim/app.js is its own
// built file, untouched. The board, the parts, the hoppers, the turnstiles, the marbles and all the
// physics on this page are ttsim's own code and pictures. This file only:
//   - builds ttsim's standard board and puts one of our puzzles on it, locked;
//   - switches off ttsim's own mouse handling (no panning, zooming, resizing, flipping fixed parts);
//   - adds the parts tray, Start / Reset, and the solved / not-solved check.
//
// Which puzzle to show comes from the journey (js/journey-core.js): puzzle.html?step=N.
// A step that is still locked sends the person to the furthest page they have reached.
(function () {
  "use strict";

  var TT = "vendor/ttsim/";
  var SHEET = TT + "images/parts.json";

  // ttsim's part type numbers (src/parts/factory.ts, PartType)
  var RAMP = 3, CROSSOVER = 4;
  // where our puzzle grid sits on ttsim's standard 13 x 17 board:
  // our row 0 is ttsim row 2 (just under the hoppers), our column 0 is ttsim's centre column 6
  var ROW0 = 2, COL0 = 6, LAST_ROW = 10, MAX_COL = 5;
  var TURNSTILE_ROW = 13;        // ttsim row of the two turnstiles on the standard board
  var BLUE_HUE = 220, RED_HUE = 0;

  // ---- which puzzle ----
  var J = window.JOURNEY_CORE;
  var step = J.currentStep();
  if (J.pages[step].kind !== "puzzle") { window.location.replace(J.urlFor(step)); return; }
  var allPuzzles = window.PUZZLES.puzzles;
  var puzzle = allPuzzles.filter(function (p) { return p.id === J.pages[step].puzzle; })[0];
  var startColour = puzzle.start_colour || "blue";

  var boardEl = document.getElementById("board");
  var trayEl = document.getElementById("tray");
  var countEl = document.getElementById("tray-count");
  var startBtn = document.getElementById("start");
  var resetBtn = document.getElementById("reset");
  var resultEl = document.getElementById("result");
  var tallyEl = document.getElementById("tally");

  // progress bar on top, Back / Next at the bottom; Next turns on once the puzzle is solved
  var setNext = J.frame(step);

  document.title = "Marble Puzzles: " + puzzle.name;
  document.getElementById("puzzle-name").textContent = puzzle.name;
  document.getElementById("goal").textContent = puzzle.goal_text;
  startBtn.className = startColour;
  startBtn.querySelector(".label").textContent = "Start (lets out a " + startColour + " marble)";
  startBtn.disabled = true;

  // ---- load ttsim ----
  SystemJS.config({
    map: {
      "pixi.js": "./" + TT + "pixi.min.js",
      "pixi-filters": "./" + TT + "pixi-filters.js",
      "matter-js": "./" + TT + "matter.min.js"
    },
    meta: {
      "pixi.js": { format: "global", exports: "PIXI", esModule: true },
      "pixi-filters": { deps: ["pixi.js"], format: "global", exports: "PIXI.filters", esModule: true },
      "matter-js": { esModule: true },
      "poly-decomp": { esModule: true }
    }
  });

  var PIXI, Renderer, PartFactory, Board, BoardBuilder, Animator, GearBase;
  var board, factory, frames;

  SystemJS.import("pixi.js").then(function () {
    PIXI = window.PIXI;
    // draw sharply on high-density screens (ttsim itself draws at 1x)
    PIXI.settings.RESOLUTION = Math.min(window.devicePixelRatio || 1, 2);
    return Promise.all(["renderer", "parts/factory", "board/board", "board/builder", "ui/animator", "parts/gearbit"]
      .map(function (m) { return SystemJS.import(m); }));
  }).then(function (mods) {
    Renderer = mods[0].Renderer;
    PartFactory = mods[1].PartFactory;
    Board = mods[2].Board;
    BoardBuilder = mods[3].BoardBuilder;
    Animator = mods[4].Animator;
    GearBase = mods[5].GearBase;
    PIXI.loader.add(SHEET).load(function () {
      frames = PIXI.loader.resources[SHEET].data.frames;
      setUp(PIXI.loader.resources[SHEET].textures);
    });
  }).catch(function (err) {
    document.getElementById("loading").textContent = "The board could not be loaded.";
    console.error(err);
  });

  // ---- build the board ----
  var drops = {};            // blue / red -> ttsim Drop
  var canvas, spacing;

  function setUp(textures) {
    factory = new PartFactory(textures);
    board = new Board(factory);
    Renderer.stage.addChild(board.view);
    BoardBuilder.initStandardBoard(board);      // ttsim's own standard board: hoppers, sides, slopes, turnstiles

    // one fixed size, chosen once to fit the window (the player cannot zoom)
    var winH = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0);
    var room = winH - 230;            // leave space for the progress bar, title and Back / Next bar
    var size = winH > 0 ? 24 : 32;             // if the window height isn't known yet, use a middling size
    if (winH > 0) [28, 32, 40, 48].forEach(function (s) { if (17.5 * Math.floor(s * 1.0625) <= room) size = s; });
    board.partSize = size;
    spacing = board.spacing;
    var w = Math.round(13.5 * spacing), h = Math.round(17.5 * spacing);
    Renderer.instance.resize(w, h);
    canvas = Renderer.instance.view;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    board.width = w;
    board.height = h;
    board.centerColumn = 6;
    board.centerRow = 8;
    board.view.interactive = false;             // ttsim's own mouse handling is off: the board is locked

    board.drops.forEach(function (d) { drops[d.hue === RED_HUE ? "red" : "blue"] = d; });
    drops.blue.hue = BLUE_HUE;
    drops.blue.onRelease = function () { released("blue"); };
    drops.red.onRelease = function () { released("red"); };

    // the puzzle's fixed parts
    board.bulkUpdate = true;
    puzzle.preplaced_ramps.forEach(function (p) { put(RAMP, p.row, p.col, p.rolls === "left", true); });
    (puzzle.preplaced_crossovers || []).forEach(function (p) { put(CROSSOVER, p.row, p.col, false, true); });
    board.bulkUpdate = false;
    restoreMine();
    fillDrops();

    boardEl.innerHTML = "";
    boardEl.appendChild(canvas);
    setUpTray();
    canvas.addEventListener("pointerdown", onBoardDown);
    startBtn.addEventListener("click", start);
    resetBtn.addEventListener("click", reset);
    refreshUi();
    requestAnimationFrame(frame);
  }

  function put(type, row, col, flipped, locked) {
    var part = factory.make(type);
    part.isFlipped = flipped;
    part.isLocked = locked;
    board.setPart(part, COL0 + col, ROW0 + row);
    if (locked && (type === RAMP || type === CROSSOVER)) dull(board.getPart(COL0 + col, ROW0 + row));   // the board keeps its own copy
    return part;
  }

  // The puzzle's fixed parts are the same green as the player's, just a little duller,
  // so they can be told apart. (A light grey-green tint multiplies the colour down.)
  var FIXED_TINT = 0xB9C6B9;
  function dull(part) {
    if (!part) return;
    for (var layer = 0; layer < 9; layer++) {
      var sprite = part.getSpriteForLayer(layer);
      if (sprite) sprite.tint = FIXED_TINT;
    }
  }

  function fillDrops() {
    board.setDropBallCount(drops.blue, puzzle.balls.blue);
    board.setDropBallCount(drops.red, puzzle.balls.red);
  }

  // ---- the loop: ttsim's own update, at a steady 60 ticks a second on any screen ----
  var last = null, acc = 0, TICK = 1000 / 60;
  function tick() {
    Animator.current.update(1);
    board.update(1);          // at ttsim's normal speed this runs two physics steps
    GearBase.update();
    watchRun();
  }
  function frame(t) {
    if (last !== null) acc += Math.min(t - last, 100);   // a hidden tab doesn't build up a backlog
    last = t;
    var ticked = false;
    while (acc >= TICK) { tick(); acc -= TICK; ticked = true; }
    if (ticked || dragging) Renderer.instance.render(Renderer.stage);
    requestAnimationFrame(frame);
  }

  // ---- the player's parts ----
  var allowed = { ramp: puzzle.ramps_to_add || 0, crossover: puzzle.crossovers_to_add || 0 };

  function kindOf(part) { return part.type === RAMP ? "ramp" : part.type === CROSSOVER ? "crossover" : null; }
  function isMine(part) { return !!part && !part.isLocked && kindOf(part) !== null; }

  function getMine() {
    var list = [];
    for (var row = 0; row <= LAST_ROW; row++) {
      for (var col = -MAX_COL; col <= MAX_COL; col++) {
        var part = board.getPart(COL0 + col, ROW0 + row);
        if (isMine(part)) list.push({ row: row, col: col, kind: kindOf(part), rolls: part.type === RAMP ? (part.isFlipped ? "left" : "right") : "none" });
      }
    }
    return list;
  }
  function remaining(kind) {
    return allowed[kind] - getMine().filter(function (m) { return m.kind === kind; }).length;
  }
  // a free spot the player may use: on the puzzle grid, and empty on ttsim's board
  function isFree(row, col) {
    if (row < 0 || row > LAST_ROW || Math.abs(col) > MAX_COL || (row + col) % 2 !== 0) return false;
    var c = COL0 + col, r = ROW0 + row;
    return board.isBackgroundPart(c, r) && board.canPlacePart(RAMP, c, r);
  }
  function changed() {
    if (started) reset();
    refreshUi();
  }
  // On a puzzle he has already solved, put back the setup that solved it (skipping anything that no
  // longer fits). A puzzle not solved yet always opens fresh, with none of his parts on it.
  function restoreMine() {
    if (J.getProgress() <= step) return;
    J.savedBoard(step).forEach(function (m) {
      if ((m.kind !== "ramp" && m.kind !== "crossover") || !isFree(m.row, m.col) || remaining(m.kind) <= 0) return;
      put(m.kind === "ramp" ? RAMP : CROSSOVER, m.row, m.col, m.rolls === "left", false);
    });
  }

  // ---- tray ----
  function spriteStyle(el, name, size) {
    var f = frames[name].frame, s = size / f.w;
    el.className = "sprite";
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.backgroundSize = (1040 * s) + "px " + (1040 * s) + "px";
    el.style.backgroundPosition = (-f.x * s) + "px " + (-f.y * s) + "px";
  }
  var trayItems = [];
  function setUpTray() {
    trayItems = Array.prototype.slice.call(trayEl.querySelectorAll(".tray-item"));
    trayItems.forEach(function (el) {
      var kind = el.getAttribute("data-kind");
      // ttsim's own toolbar pictures
      var icon = el.querySelector(".icon");
      spriteStyle(icon, kind === "ramp" ? "Ramp-t" : "Crossover-t", 48);
      icon.className = "icon sprite";
      el.addEventListener("pointerdown", function (e) {
        if (remaining(kind) <= 0) return;
        e.preventDefault();
        beginDrag(e, kind, el.getAttribute("data-lean") === "left");
      });
    });
  }

  // ---- dragging a part (from the tray, or one of mine picked up off the board) ----
  var dragging = null;       // { kind, flipped, ghost, preview, target }
  var pending = null;        // a press on one of my parts that is not yet a drag (a tap flips a ramp)

  function boardPoint(e) {
    var box = canvas.getBoundingClientRect();
    var x = e.clientX - box.left - board._layers.x, y = e.clientY - box.top - board._layers.y;
    return { col: Math.round(board.columnForX(x)) - COL0, row: Math.round(board.rowForY(y)) - ROW0,
             inside: e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom };
  }

  function beginDrag(e, kind, flipped) {
    var size = board.partSize * 1.5;           // ttsim draws its parts at 1.5 x the part size
    var ghost = document.createElement("div");
    ghost.id = "ghost";
    ["-b", "-m"].forEach(function (layer) {
      var d = document.createElement("div");
      spriteStyle(d, (kind === "ramp" ? "Ramp" : "Crossover") + layer, size);
      if (flipped) d.style.transform = "scaleX(-1)";
      ghost.appendChild(d);
    });
    document.body.appendChild(ghost);
    // ttsim's own see-through preview part, shown on the spot the part would land on
    var preview = factory.make(kind === "ramp" ? RAMP : CROSSOVER);
    preview.isFlipped = flipped;
    board.partPrototype = preview;
    dragging = { kind: kind, flipped: flipped, ghost: ghost, preview: preview, target: null, size: size };
    moveDrag(e);
    document.addEventListener("pointermove", moveDrag);
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", cancelDrag);
  }

  function moveDrag(e) {
    if (!dragging) return;
    var p = boardPoint(e);
    var ok = p.inside && isFree(p.row, p.col);
    dragging.target = ok ? p : null;
    dragging.preview.visible = ok;
    if (ok) board.layoutPart(dragging.preview, COL0 + p.col, ROW0 + p.row);
    dragging.ghost.style.display = ok ? "none" : "block";
    dragging.ghost.style.transform = "translate(" + (e.clientX - dragging.size / 2) + "px," + (e.clientY - dragging.size / 2) + "px)";
    Renderer.needsUpdate();
  }

  function finishDrag() {
    document.removeEventListener("pointermove", moveDrag);
    document.removeEventListener("pointerup", endDrag);
    document.removeEventListener("pointercancel", cancelDrag);
    document.body.removeChild(dragging.ghost);
    dragging.preview.visible = false;
    board.partPrototype = null;
    dragging.preview.visible = false;
    board._updateSpriteVisibility();
    var d = dragging;
    dragging = null;
    return d;
  }
  function endDrag() {
    var d = finishDrag();
    if (d.target) put(d.kind === "ramp" ? RAMP : CROSSOVER, d.target.row, d.target.col, d.flipped, false);
    changed();
    Renderer.instance.render(Renderer.stage);
  }
  function cancelDrag() {
    finishDrag();
    changed();
    Renderer.instance.render(Renderer.stage);
  }

  // pressing one of my parts on the board: a tap flips a ramp, a drag picks the part up
  function onBoardDown(e) {
    if (dragging || pending) return;
    var p = boardPoint(e);
    var part = board.getPart(COL0 + p.col, ROW0 + p.row);
    if (!isMine(part)) return;
    e.preventDefault();
    pending = { x: e.clientX, y: e.clientY, row: p.row, col: p.col, part: part };
    document.addEventListener("pointermove", pendingMove);
    document.addEventListener("pointerup", pendingUp);
    document.addEventListener("pointercancel", pendingCancel);
  }
  function clearPending() {
    document.removeEventListener("pointermove", pendingMove);
    document.removeEventListener("pointerup", pendingUp);
    document.removeEventListener("pointercancel", pendingCancel);
    var p = pending;
    pending = null;
    return p;
  }
  function pendingMove(e) {
    if (Math.abs(e.clientX - pending.x) < 5 && Math.abs(e.clientY - pending.y) < 5) return;
    var p = clearPending();
    var kind = kindOf(p.part), flipped = p.part.isFlipped;
    board.clearPart(COL0 + p.col, ROW0 + p.row);
    changed();
    beginDrag(e, kind, flipped);
  }
  function pendingUp() {
    var p = clearPending();
    if (p.part.type === RAMP) {
      board.flipPart(COL0 + p.col, ROW0 + p.row);
      changed();
    }
  }
  function pendingCancel() { clearPending(); }

  // ---- running the marbles ----
  var started = false, finished = false;
  var order = [];            // the colour of each marble, in the order they were let out
  var out = { blue: 0, red: 0 };
  var sinceRelease = 0, restTicks = 0;
  var game = { solved: false };

  function say(text, kind) {
    resultEl.textContent = text;
    resultEl.className = kind || "";
  }

  function released(colour) {
    order.push(colour);
    out[colour]++;
    sinceRelease = 0;
    restTicks = 0;
    refreshUi();
  }

  // Start lets out the first marble by asking ttsim's hopper to release one, as a click on it would.
  // After that the turnstiles at the bottom do the work: ttsim releases the next marble when one turns.
  function start() {
    if (started) return;
    started = true;
    finished = false;
    say("Marbles running…", "");
    drops[startColour].releaseBall();
    refreshUi();
  }

  function reset() {
    fillDrops();               // ttsim puts every marble back in its hopper
    order = [];
    out = { blue: 0, red: 0 };
    started = false;
    finished = false;
    sinceRelease = 0;
    restTicks = 0;
    game.solved = false;
    say("", "");
    refreshUi();
  }

  // the run is over when ttsim reports every marble has come to rest
  function watchRun() {
    if (!started || finished) return;
    sinceRelease++;
    restTicks = board.areBallsAtRest ? restTicks + 1 : 0;
    if (sinceRelease > 90 && restTicks > 60) judge();
  }

  // a marble that has left its hopper but come to rest above the turnstiles is stuck
  function anyStuck() {
    var stuck = false;
    board.balls.forEach(function (ball) {
      if (ball.row > 1.7 && ball.row < TURNSTILE_ROW + 0.7) stuck = true;
    });
    return stuck;
  }

  var total = { blue: puzzle.balls.blue, red: puzzle.balls.red };

  // The win rules (each puzzle's "goal_rule" in data/puzzles.js). Each returns { ok, text }.
  // The left turnstile lets out the next blue marble, the right one the next red.
  var RULES = {
    blue_only: function (blueOut, redOut) {
      if (redOut > 0) return { ok: false, text: "A red marble got out. A marble went through the right turnstile, and that lets a red one go. Press Reset and try a different set of ramps." };
      if (blueOut < total.blue) return { ok: false, text: "The run stopped after " + blueOut + " of the " + total.blue + " blue marbles. Press Reset and try again." };
      return { ok: true, text: "Solved! All " + total.blue + " blue marbles made it, and no red ones got out." };
    },
    blue_then_red: function (blueOut, redOut) {
      if (redOut === 0) return { ok: false, text: "The blue marble finished its run without setting off the red one. Press Reset and try again." };
      return { ok: true, text: "Solved! The blue marble set off the red marble." };
    },
    one_red_then_all_blue: function (blueOut, redOut) {
      if (redOut > 1) return { ok: false, text: "A second red marble got out. A marble went through the right turnstile, and that lets another red one go. Only the first red marble should start things off. Press Reset and try again." };
      if (blueOut < total.blue) return { ok: false, text: "The red marble started things off, but only " + blueOut + " of the " + total.blue + " blue marbles came out. Press Reset and try again." };
      return { ok: true, text: "Solved! One red marble started it and all " + total.blue + " blue marbles followed." };
    },
    alternate: function () {
      var n = total.blue + total.red;
      for (var i = 0; i < order.length; i++) {
        var want = i % 2 === 0 ? "blue" : "red";
        if (order[i] !== want) return { ok: false, text: "The pattern broke at marble number " + (i + 1) + ": it was " + order[i] + " but should have been " + want + ". Press Reset and try again." };
      }
      if (order.length < n) return { ok: false, text: "The run stopped after " + order.length + " of the " + n + " marbles. Press Reset and try again." };
      return { ok: true, text: "Solved! Blue, red, blue, red... all " + n + " marbles in the right order." };
    },
    one_blue_then_all_red: function (blueOut, redOut) {
      if (blueOut > 1) return { ok: false, text: "A second blue marble got out. A marble went through the left turnstile, and that lets another blue one go. Only the first blue marble should start things off. Press Reset and try again." };
      if (redOut < total.red) return { ok: false, text: "The blue marble started things off, but only " + redOut + " of the " + total.red + " red marbles came out. Press Reset and try again." };
      return { ok: true, text: "Solved! One blue marble started it and all " + total.red + " red marbles followed." };
    }
  };

  // Is the player's setup the guide's? Same spots, same lean, nothing missing, nothing extra.
  function setupCheck() {
    var want = {}, wantCount = 0;
    (puzzle.guide_solution_ramps || []).forEach(function (g) { want["ramp:" + g.row + "," + g.col] = g.rolls; wantCount++; });
    (puzzle.guide_solution_crossovers || []).forEach(function (g) { want["crossover:" + g.row + "," + g.col] = "none"; wantCount++; });
    var n = 0, wrongWay = 0, bad = 0;
    getMine().forEach(function (r) {
      n++;
      var w = want[r.kind + ":" + r.row + "," + r.col];
      if (!w) bad++; else if (w !== r.rolls) wrongWay++;
    });
    if (bad === 0 && wrongWay === 0 && n === wantCount) return "ok";
    return bad === 0 && n === wantCount ? "wrongway" : "wrong";
  }

  function judge() {
    finished = true;
    game.solved = false;
    if (anyStuck()) {
      say("A marble has stopped part-way down. Press Reset and try a different set of parts.", "lose");
      return;
    }
    var verdict = RULES[puzzle.goal_rule](out.blue, out.red);
    // Success needs BOTH the right marble result AND the right setup (the guide's pattern).
    if (verdict.ok) {
      var setup = setupCheck();
      if (setup === "wrongway") verdict = { ok: false, text: "The marbles got there, but a ramp is leaning the wrong way. The way each ramp leans matters. Press Reset and try again." };
      else if (setup === "wrong") verdict = { ok: false, text: "The marbles got there, but this isn't the setup the puzzle needs: every part has to be placed, in the right spot. Press Reset and try again." };
    }
    say(verdict.text, verdict.ok ? "win" : "lose");
    game.solved = verdict.ok;
    if (verdict.ok) {
      J.reach(step + 1);       // remembered at once, so a refresh doesn't lose the solve
      J.rememberBoard(step, getMine());   // the setup that solved it, shown again when he comes back
      setNext(true);
    }
  }

  function refreshUi() {
    var left = [], totalLeft = 0;
    ["ramp", "crossover"].forEach(function (kind) {
      var n = remaining(kind);
      totalLeft += n;
      if (allowed[kind] > 0) left.push(n + (kind === "ramp" ? (n === 1 ? " ramp" : " ramps") : (n === 1 ? " crossover" : " crossovers")));
      trayItems.forEach(function (el) {
        if (el.getAttribute("data-kind") !== kind) return;
        el.style.display = allowed[kind] > 0 ? "" : "none";
        el.classList.toggle("empty", n <= 0);
        el.querySelector(".count").textContent = n;
      });
    });
    countEl.textContent = totalLeft === 0 ? "All parts placed" : left.join(", ") + " left to place";
    startBtn.disabled = started;
    tallyEl.textContent = "Let out so far: " + out.blue + " blue, " + out.red + " red.";
  }

  // for testing only (not used by the page)
  window.GAME = {
    state: game,
    board: function () { return board; },
    place: function (kind, row, col, lean) {
      if (!isFree(row, col) || remaining(kind) <= 0) return false;
      put(kind === "ramp" ? RAMP : CROSSOVER, row, col, lean === "left", false);
      changed();
      return true;
    },
    getMine: getMine, start: start, reset: reset, tick: tick,
    render: function () { Renderer.instance.render(Renderer.stage); },
    info: function () { return { started: started, finished: finished, order: order.slice(), out: out, result: resultEl.textContent }; }
  };
})();
