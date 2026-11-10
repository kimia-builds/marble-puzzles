// Session 3: marbles fall, the ramps move, and the two bottom levers run the show.
// This follows how ttsim (Jesse Crossen, Unlicense) simulates a ramp:
//  - the ramp is a real moving body that pivots around its peg;
//  - a spring "counterweight" holds it level, and a marble rolling onto the
//    far half tips it up to 90 degrees, which lowers the lip and lets the marble go;
//  - a few small "cheats" (pin the peg, limit the swing, nudge the marble to a
//    steady rolling speed) keep it smooth.
// All physics runs in ttsim's own units (a grid step is 68 units, a marble has radius 10)
// and is scaled by BOARD.K only when drawn.
(function () {
  "use strict";
  var M = Matter;
  var B = window.BOARD;
  var K = B.K;

  // ---- ttsim's numbers (src/board/constants.ts) ----
  var SPACING = 68;
  var BALL_RADIUS = 10;
  var PART_DENSITY = 0.100;
  var BALL_DENSITY = 0.008;
  var BALL_FRICTION = 0.03, PART_FRICTION = 0.03;
  var IDEAL_VX = 1.5;
  var NUDGE_ACCEL = 0.001;
  var DAMPER_RADIUS = 32;
  var COUNTERWEIGHT_STIFFNESS = BALL_DENSITY / 8;
  var COUNTERWEIGHT_DAMPING = 0.1;
  var STEPS_PER_TICK = 1;      // ttsim runs two per screen frame at normal speed; we run half that (Kimia's choice)

  // the ramp's outline, as drawn in ttsim (src/parts/partvertices.ts, 'Ramp'):
  // the sloping top, the curved lip, the pivot hub and the counterweight arm
  var RAMP_SHAPES = [
    [{x:13,y:-14},{x:-32,y:-25},{x:-34,y:-30},{x:-34,y:-32},{x:-32,y:-33},{x:16,y:-21}],
    [{x:16,y:-21},{x:25,y:-24},{x:30,y:-21},{x:23,y:-16},{x:14,y:-16}],
    [{x:25,y:-24},{x:27.76,y:-30.97},{x:30,y:-32},{x:33,y:-30},{x:30,y:-21}],
    [{x:-8,y:3},{x:-28,y:11},{x:-33,y:18},{x:-33,y:26},{x:-27,y:33},{x:-16,y:33},{x:-11,y:25},{x:-5,y:6}],
    [{x:-4,y:-7},{x:-8,y:-3},{x:-8,y:2},{x:-4,y:7},{x:9,y:14},{x:14,y:14},{x:14,y:9},{x:6,y:-6}],
    [{x:-4,y:-18},{x:13,y:-14},{x:6,y:-6},{x:-4,y:-7}]
  ];

  // the crossover's outline, as drawn in ttsim (src/parts/partvertices.ts, 'Crossover'): a fixed part
  // with a centre divider and two catching cups. It never moves: marbles just roll across it.
  var CROSSOVER_SHAPES = [
    [{x:-0.125,y:-48.25},{x:-2.75,y:-46},{x:-2.75,y:-15.875},{x:3,y:-15.875},{x:3,y:-46.375}],
    [{x:-3,y:-16},{x:-12,y:-10},{x:-2.25,y:4.25},{x:2.375,y:4.25},{x:12,y:-10},{x:3,y:-16}],
    [{x:-32.25,y:32},{x:-0.05,y:29.5},{x:31.125,y:31.5},{x:32.875,y:34.375},{x:30.375,y:37},{x:-30.25,y:37},{x:-32.75,y:35.125}],
    [{x:-36,y:-28},{x:-43,y:-5},{x:-48,y:-3},{x:-45,y:-21},{x:-36,y:-36}],
    [{x:-43,y:-5},{x:-33,y:7},{x:-39,y:7},{x:-48,y:-3}],
    [{x:-36,y:-36},{x:-32,y:-36},{x:-32,y:-32},{x:-36,y:-28}],
    [{x:36,y:-28},{x:43,y:-5},{x:48,y:-3},{x:45,y:-21},{x:36,y:-36}],
    [{x:43,y:-5},{x:33,y:7},{x:39,y:7},{x:48,y:-3}],
    [{x:36,y:-36},{x:32,y:-36},{x:32,y:-32},{x:36,y:-28}]
  ];

  var engine = M.Engine.create();
  var world = engine.world;

  // walls down both sides so nothing wanders off the board
  var halfW = (B.width / 2) / K;
  [-1, 1].forEach(function (side) {
    M.Composite.add(world, M.Bodies.rectangle(side * (halfW + 20), 400, 40, 4000, { isStatic: true }));
  });

  // ---- ramps ----
  var ramps = [];    // { body, damper, flipped, row, col, cx, cy, el }

  function makeRampBody(flipped) {
    var parts = RAMP_SHAPES.map(function (shape) {
      var verts = shape.map(function (v) { return { x: flipped ? -v.x : v.x, y: v.y }; });
      M.Vertices.clockwiseSort(verts);
      return M.Body.create({ position: M.Vertices.centre(verts), vertices: verts });
    });
    var body = M.Body.create({
      parts: parts, friction: PART_FRICTION, frictionStatic: PART_FRICTION,
      density: PART_DENSITY, restitution: 0
    });
    // ttsim's trick: keep the body's turning point on the peg (the origin), not on its centre of mass
    body.position.x = 0; body.position.y = 0;
    body.positionPrev.x = 0; body.positionPrev.y = 0;
    return body;
  }

  var crossoverBodies = [];   // { body, row, col }
  function rebuildCrossovers() {
    crossoverBodies.forEach(function (c) { M.Composite.remove(world, c.body); });
    crossoverBodies = B.getCrossovers().map(function (c) {
      var parts = CROSSOVER_SHAPES.map(function (shape) {
        var verts = shape.map(function (v) { return { x: v.x, y: v.y }; });
        M.Vertices.clockwiseSort(verts);
        return M.Body.create({ position: M.Vertices.centre(verts), vertices: verts });
      });
      var body = M.Body.create({ parts: parts, isStatic: true, friction: PART_FRICTION, restitution: 0 });
      // same trick as the ramps: the part's origin is its peg, not its centre of mass
      body.position.x = 0; body.position.y = 0; body.positionPrev.x = 0; body.positionPrev.y = 0;
      M.Body.translate(body, { x: c.col * SPACING, y: c.row * SPACING });
      M.Composite.add(world, body);
      return { body: body, row: c.row, col: c.col };
    });
  }

  // bare pegs: a marble landing on a spot with no ramp bounces off the peg (the dots you see on the board)
  var pegs = [];
  var PEG_RADIUS = 4 / K;
  function rebuildPegs(taken) {
    pegs.forEach(function (p) { M.Composite.remove(world, p); });
    pegs = [];
    for (var row = 0; row <= 10; row++) {
      for (var col = -5; col <= 5; col++) {
        if ((row + col) % 2 !== 0 || taken[row + "," + col]) continue;
        var peg = M.Bodies.circle(col * SPACING, row * SPACING, PEG_RADIUS, { isStatic: true, friction: PART_FRICTION, restitution: 0 });
        pegs.push(peg);
      }
    }
    M.Composite.add(world, pegs);
  }

  function rebuildRamps() {
    ramps.forEach(function (r) {
      M.Composite.remove(world, r.body);
      M.Composite.remove(world, r.damper);
    });
    ramps = B.getRamps().map(function (r) {
      var flipped = r.rolls === "left";
      var body = makeRampBody(flipped);
      var cx = r.col * SPACING, cy = r.row * SPACING;
      M.Body.translate(body, { x: cx, y: cy });
      var sign = flipped ? 1 : -1;
      // the counterweight spring: pulls the ramp back to level
      var damper = M.Constraint.create({
        bodyA: body,
        pointA: { x: sign * DAMPER_RADIUS, y: -DAMPER_RADIUS },
        pointB: { x: cx + sign * DAMPER_RADIUS, y: cy },
        stiffness: COUNTERWEIGHT_STIFFNESS, damping: COUNTERWEIGHT_DAMPING
      });
      M.Composite.add(world, [body, damper]);
      return { body: body, damper: damper, flipped: flipped, row: r.row, col: r.col, cx: cx, cy: cy, el: r.el };
    });
    var taken = {};
    ramps.forEach(function (r) { taken[r.row + "," + r.col] = true; });
    B.getCrossovers().forEach(function (c) { taken[c.row + "," + c.col] = true; });
    rebuildCrossovers();
    rebuildPegs(taken);
  }
  rebuildRamps();
  B.onChange(rebuildRamps);

  // ---- marbles ----
  var total = { blue: B.puzzle.balls.blue, red: B.puzzle.balls.red };
  var left = { blue: total.blue, red: total.red };   // still waiting in the funnels
  var done = { blue: 0, red: 0 };                    // marbles that have hit a lever
  var marbles = [];   // { body, el, colour }
  var order = [];     // the colour of each marble, in the order they were let out
  var startColour = B.puzzle.start_colour || "blue";
  var started = false, finished = false, quiet = 0;
  var startBtn = document.getElementById("start");
  var tally = document.getElementById("tally");
  var resultEl = document.getElementById("result");
  var leverEls = B.levers;
  var exitY = (B.leverY - B.originY) / K;   // a marble that falls below this has hit a lever

  function say(text, kind) {
    resultEl.textContent = text;
    resultEl.className = kind || "";
  }

  function refreshUi() {
    B.funnels.blue.textContent = left.blue;
    B.funnels.red.textContent = left.red;
    startBtn.disabled = started;
    tally.textContent = "Hit the left lever: " + leftHits.blue + " blue, " + leftHits.red + " red.  Hit the right lever: " + rightHits.blue + " blue, " + rightHits.red + " red.";
  }
  var rightHits = { blue: 0, red: 0 };
  var leftHits = { blue: 0, red: 0 };

  function release(colour) {
    if (left[colour] === 0) return false;
    left[colour]--;
    order.push(colour);
    var funnelCol = colour === "blue" ? -2 : 2;
    // land on the HIGH end of the ramp below the funnel (not on its pivot), so the marble
    // has to roll down into the lip's pocket before its weight tips the ramp
    var x = funnelCol * SPACING;
    ramps.forEach(function (r) { if (r.row === 0 && r.col === funnelCol) x += r.flipped ? 27 : -27; });
    var body = M.Bodies.circle(x + (Math.random() - 0.5) * 2, -52, BALL_RADIUS, {
      density: BALL_DENSITY, friction: BALL_FRICTION, frictionStatic: BALL_FRICTION, restitution: 0.05
    });
    body.isBall = true;
    M.Composite.add(world, body);
    var el = document.createElement("div");
    el.className = "marble " + colour;
    B.el.appendChild(el);
    marbles.push({ body: body, el: el, colour: colour });
    quiet = 0;
    refreshUi();
    return true;
  }

  // pressing Start lets out the first blue marble; after that the levers do the work
  function start() {
    if (started) return;
    started = true;
    finished = false;
    say("Marbles running…", "");
    release(startColour);
  }

  function reset() {
    marbles.forEach(function (m) { M.Composite.remove(world, m.body); B.el.removeChild(m.el); });
    marbles = [];
    left = { blue: total.blue, red: total.red };
    order = [];
    done = { blue: 0, red: 0 };
    leftHits = { blue: 0, red: 0 };
    rightHits = { blue: 0, red: 0 };
    started = false; finished = false; quiet = 0;
    say("", "");
    refreshUi();
  }

  // a marble reached the bottom: the lever it hit lets out the next marble
  function hitLever(colour, x) {
    var side = x < 0 ? "left" : "right";
    var el = leverEls[side];
    el.classList.add("hit");
    setTimeout(function () { el.classList.remove("hit"); }, 350);
    (side === "left" ? leftHits : rightHits)[colour]++;
    done[colour]++;
    release(side === "left" ? "blue" : "red");
    quiet = 0;
  }

  // The three win rules (each puzzle's "goal_rule" in data/puzzles.js). Each looks at how many
  // marbles of each colour got out and reached a lever, and returns { ok, text }.
  // Start lets out one marble (blue unless the puzzle says red); the left lever lets out another blue, the right one a red.
  var RULES = {
    // puzzles 1-3: every blue marble gets to the end and no red marble is ever let out
    blue_only: function (blueOut, redOut) {
      if (redOut > 0) return { ok: false, text: "A red marble got out. A marble hit the right lever, and that lets a red one go. Press Reset and try a different set of ramps." };
      if (blueOut < total.blue) return { ok: false, text: "The run stopped after " + blueOut + " of the " + total.blue + " blue marbles. Press Reset and try again." };
      return { ok: true, text: "Solved! All " + total.blue + " blue marbles made it, and no red ones got out." };
    },
    // puzzle 4: the blue marble sets off the red marble
    blue_then_red: function (blueOut, redOut) {
      if (redOut === 0) return { ok: false, text: "The blue marble finished its run without setting off the red one. Press Reset and try again." };
      return { ok: true, text: "Solved! The blue marble set off the red marble." };
    },
    // challenge 4: one red marble starts things off, then every blue marble comes out
    one_red_then_all_blue: function (blueOut, redOut) {
      if (redOut > 1) return { ok: false, text: "A second red marble got out. A marble hit the right lever, and that lets another red one go. Only the first red marble should start things off. Press Reset and try again." };
      if (blueOut < total.blue) return { ok: false, text: "The red marble started things off, but only " + blueOut + " of the " + total.blue + " blue marbles came out. Press Reset and try again." };
      return { ok: true, text: "Solved! One red marble started it and all " + total.blue + " blue marbles followed." };
    },
    // challenges 5-6: the marbles come out blue, red, blue, red, ... all the way through
    alternate: function () {
      var n = total.blue + total.red;
      for (var i = 0; i < order.length; i++) {
        var want = i % 2 === 0 ? "blue" : "red";
        if (order[i] !== want) return { ok: false, text: "The pattern broke at marble number " + (i + 1) + ": it was " + order[i] + " but should have been " + want + ". Press Reset and try again." };
      }
      if (order.length < n) return { ok: false, text: "The run stopped after " + order.length + " of the " + n + " marbles. Press Reset and try again." };
      return { ok: true, text: "Solved! Blue, red, blue, red... all " + n + " marbles in the right order." };
    },
    // puzzles 5-6: one blue marble starts things off, then every red marble comes out
    one_blue_then_all_red: function (blueOut, redOut) {
      if (blueOut > 1) return { ok: false, text: "A second blue marble got out. A marble hit the left lever, and that lets another blue one go. Only the first blue marble should start things off. Press Reset and try again." };
      if (redOut < total.red) return { ok: false, text: "The blue marble started things off, but only " + redOut + " of the " + total.red + " red marbles came out. Press Reset and try again." };
      return { ok: true, text: "Solved! One blue marble started it and all " + total.red + " red marbles followed." };
    }
  };

  // Is the player's ramp setup the guide's? Same spots, same lean, nothing missing, nothing extra.
  // Returns "ok", "wrongway" (right spots but a ramp leans the wrong way) or "wrong" (anything else).
  function setupCheck() {
    var want = {}, wantCount = 0;
    (B.puzzle.guide_solution_ramps || []).forEach(function (g) { want["ramp:" + g.row + "," + g.col] = g.rolls; wantCount++; });
    (B.puzzle.guide_solution_crossovers || []).forEach(function (g) { want["crossover:" + g.row + "," + g.col] = "none"; wantCount++; });
    var mine = B.getMine(), n = 0, wrongWay = 0, bad = 0;
    mine.forEach(function (r) {
      n++;
      var w = want[r.kind + ":" + r.row + "," + r.col];
      if (!w) bad++; else if (w !== r.rolls) wrongWay++;
    });
    if (bad === 0 && wrongWay === 0 && n === wantCount) return "ok";
    return bad === 0 && n === wantCount ? "wrongway" : "wrong";
  }

  // when nothing is left rolling, decide how the run went
  function judge() {
    finished = true;
    var rule = RULES[B.puzzle.goal_rule];
    var blueOut = total.blue - left.blue, redOut = total.red - left.red;
    // Practice puzzles are just for trying things: no winning, no losing, no checking the setup.
    if (B.puzzle.practice) {
      say("Run finished: " + blueOut + " blue and " + redOut + " red marbles came out. Change the ramps and press Reset to try again, as often as you like.", "");
      window.MARBLES.solved = false;
      return;
    }
    var verdict = rule(blueOut, redOut);
    // Success needs BOTH the right marble result AND the right ramp setup (the guide's pattern).
    // Marbles can sometimes reach the goal with a different or incomplete setup, which doesn't count.
    if (verdict.ok) {
      var setup = setupCheck();
      if (setup === "wrongway") verdict = { ok: false, text: "The marbles got there, but a ramp is leaning the wrong way. The way each ramp leans matters. Press Reset and try again." };
      else if (setup === "wrong") verdict = { ok: false, text: "The marbles got there, but this isn't the setup the puzzle needs: every ramp has to be placed, in the right spot. Press Reset and try again." };
    }
    say(verdict.text, verdict.ok ? "win" : "lose");
    window.MARBLES.solved = verdict.ok;
  }

  startBtn.addEventListener("click", start);
  document.getElementById("reset").addEventListener("click", reset);
  // changing the ramps starts you over, so a result always matches what's on the board
  B.onChange(function () { if (started) reset(); });

  // ---- ttsim's "cheats", run after every physics step ----
  function partOf(body) { return body.parent && body.parent !== body ? body.parent : body; }

  function afterStep() {
    // which marbles are touching which ramp
    var pairs = engine.pairs.collisionActive || [];
    var contacts = new Map();
    pairs.forEach(function (pair) {
      var a = partOf(pair.bodyA), b = partOf(pair.bodyB);
      var ramp = null, ball = null;
      ramps.forEach(function (r) { if (r.body === a) { ramp = r; ball = b; } else if (r.body === b) { ramp = r; ball = a; } });
      if (!ramp || !ball || !ball.isBall) return;
      var tangent = pair.collision.tangent || M.Vector.perp(pair.collision.normal);
      if (!contacts.has(ramp)) contacts.set(ramp, []);
      contacts.get(ramp).push({ ball: ball, tangent: tangent });
    });

    ramps.forEach(function (r) {
      var body = r.body, touching = contacts.get(r) || [];
      // pin the ramp to its peg
      var delta = M.Vector.sub({ x: r.cx, y: r.cy }, body.position);
      M.Body.translate(body, delta);
      M.Body.setVelocity(body, { x: 0, y: 0 });
      // limit the swing to 0..90 degrees, like a counterweighted lever
      var rot = (r.flipped ? -body.angle : body.angle) / (Math.PI / 2);
      var angleDelta = 0;
      if (rot < 0 || rot > 1) {
        var target = (r.flipped ? -1 : 1) * Math.min(Math.max(0, rot), 1) * (Math.PI / 2);
        angleDelta = target - body.angle;
        M.Body.rotate(body, angleDelta);
        M.Body.setAngularVelocity(body, 0);
        rot = Math.min(Math.max(0, rot), 1);
      }
      // marbles riding on it move with any correction
      var carry = M.Vector.rotate(delta, angleDelta);
      touching.forEach(function (c) { M.Body.translate(c.ball, carry); });

      // nudge marbles on the upper half toward a steady rolling speed
      if (rot < 0.25) {
        touching.forEach(function (c) {
          var ball = c.ball;
          if (ball.position.y / SPACING >= r.row) return;     // only marbles above the peg
          if (ball.velocity.y < 0) M.Body.setVelocity(ball, { x: ball.velocity.x, y: 0 });
          var sign = r.flipped ? -1 : 1;
          var t = { x: c.tangent.x, y: c.tangent.y };
          if (Math.abs(t.y) / Math.abs(t.x) > 0.3) return;     // only fairly level surfaces
          if ((sign < 0 && t.x > 0) || (sign > 0 && t.x < 0)) t = { x: -t.x, y: -t.y };
          var target = IDEAL_VX * sign, current = ball.velocity.x, accel = 0;
          if (sign > 0) { if (current < target) accel = NUDGE_ACCEL; else if (current > target) accel = -NUDGE_ACCEL; }
          else { if (target < current) accel = NUDGE_ACCEL; else if (target > current) accel = -NUDGE_ACCEL; }
          if (accel === 0) return;
          accel *= Math.min(Math.abs(current - target) * 4, 1);
          M.Body.applyForce(ball, ball.position, M.Vector.mult(t, accel * ball.mass));
        });
      }
    });
  }

  // ---- the crossover: ttsim's "conveyor with memory" (src/parts/partbody.ts) ----
  // A crossover keeps each marble going the way it was already travelling (left-to-right stays
  // left-to-right), so two marbles can cross each other's paths without ever interacting.
  function trackBall(b) {
    var col = b.position.x / SPACING, c = Math.round(col);
    if (b.tColumn === undefined) { b.tColumn = c; b.lastDistinct = c; }
    else if (c !== b.tColumn) { b.lastDistinct = b.tColumn; b.tColumn = c; }
    b.gridCol = col;
    b.gridRow = b.position.y / SPACING;
  }

  function nudgeBall(ball, tangent, sign, mag, push) {
    if (sign === 0) return;
    var t = { x: tangent.x, y: tangent.y };
    if (Math.abs(t.y) / Math.abs(t.x) > 0.3) return;       // only fairly level surfaces
    if ((sign < 0 && t.x > 0) || (sign > 0 && t.x < 0)) t = { x: -t.x, y: -t.y };
    var target = IDEAL_VX * sign * mag, current = ball.velocity.x, accel = 0;
    if (sign > 0) { if (current < target) accel = NUDGE_ACCEL; else if (current > target) accel = -NUDGE_ACCEL; }
    else { if (target < current) accel = NUDGE_ACCEL; else if (target > current) accel = -NUDGE_ACCEL; }
    if (accel === 0) return;
    accel *= Math.min(Math.abs(current - target) * 4, 1) * (push || 1);
    M.Body.applyForce(ball, ball.position, M.Vector.mult(t, accel * ball.mass));
  }

  function crossoverStep() {
    marbles.forEach(function (m) { trackBall(m.body); });
    if (crossoverBodies.length === 0) return;
    // marbles touching a crossover get nudged along their direction of travel
    var pairs = engine.pairs.collisionActive || [];
    pairs.forEach(function (pair) {
      var a = partOf(pair.bodyA), b = partOf(pair.bodyB), cx = null, ball = null;
      crossoverBodies.forEach(function (c) { if (c.body === a) { cx = c; ball = b; } else if (c.body === b) { cx = c; ball = a; } });
      if (!cx || !ball || !ball.isBall) return;
      var tangent = pair.collision.tangent || M.Vector.perp(pair.collision.normal);
      var sign;
      if (ball.lastDistinct < ball.tColumn) sign = 1;
      else if (ball.lastDistinct > ball.tColumn) sign = -1;
      else if (ball.gridRow < cx.row) {                       // top half
        sign = ball.gridCol < cx.col ? 1 : -1;
        ball.lastDistinct -= sign;                            // remember it for the bottom half
      } else sign = ball.gridCol < cx.col ? -1 : 1;           // bottom half
      // Above the cups a marble must simply fall in on the side it came from, so it is only
      // pushed along once it is down inside the part (not while it is still on top of a wall).
      var inside = ball.position.y > cx.row * SPACING - 28;
      if (ball.gridRow < cx.row && !inside) return;
      nudgeBall(ball, tangent, sign, ball.gridRow < cx.row ? 16 : 1);
    });
    // marbles near a crossover are steered even when not touching
    marbles.forEach(function (m) {
      var ball = m.body, currentSign = ball.velocity.x > 0 ? 1 : -1;
      crossoverBodies.forEach(function (cx) {
        if (Math.abs(Math.round(ball.gridRow) - cx.row) > 1 || Math.abs(Math.round(ball.gridCol) - cx.col) > 1) return;
        if (ball.gridRow < cx.row && ball.position.y <= cx.row * SPACING - 28) {
          return;                                              // still above the cups: just fall
        } else if (ball.gridRow < cx.row && ball.velocity.x > 0.001) {
          if (Math.abs(ball.velocity.x) < Math.abs(ball.velocity.y)) M.Body.applyForce(ball, ball.position, { x: currentSign * NUDGE_ACCEL * ball.mass, y: 0 });
        } else if (ball.gridRow > cx.row) {
          var want = 0;
          if (ball.lastDistinct < ball.tColumn) want = 1; else if (ball.lastDistinct > ball.tColumn) want = -1;
          if (want !== 0 && want !== currentSign) M.Body.applyForce(ball, ball.position, { x: want * NUDGE_ACCEL * ball.mass, y: 0 });
        }
      });
    });
  }

  // ---- the loop: fixed 60-per-second ticks, drawing after each ----
  var last = null, acc = 0, TICK = 1000 / 60;
  function step() {
    for (var i = 0; i < STEPS_PER_TICK; i++) { M.Engine.update(engine, TICK); afterStep(); crossoverStep(); }
    if (started && !finished) {
      quiet++;
      if (marbles.length === 0) judge();                 // nothing left rolling: the run is over
      else if (quiet > 30 * 60) {                        // 30 seconds with no marble reaching a lever
        finished = true;
        say("A marble seems to be stuck. Press Reset and try a different set of ramps.", B.puzzle.practice ? "" : "lose");
        window.MARBLES.solved = false;
      }
    }
  }
  function draw() {
    ramps.forEach(function (r) {
      if (r.el) r.el.style.transform = "rotate(" + r.body.angle + "rad) scaleX(" + (r.flipped ? -1 : 1) + ")";
    });
    for (var i = marbles.length - 1; i >= 0; i--) {
      var m = marbles[i], p = m.body.position;
      if (p.y > exitY) {                    // reached the levers
        M.Composite.remove(world, m.body);
        B.el.removeChild(m.el);
        marbles.splice(i, 1);
        hitLever(m.colour, p.x);
        refreshUi();
      } else {
        m.el.style.transform = "translate(" + (B.originX + p.x * K) + "px," + (B.originY + p.y * K) + "px)";
      }
    }
  }
  function frame(t) {
    if (last !== null) acc += Math.min(t - last, 100);   // a hidden tab doesn't build up a huge backlog
    last = t;
    while (acc >= TICK) { step(); acc -= TICK; }
    draw();
    requestAnimationFrame(frame);
  }
  refreshUi();
  requestAnimationFrame(frame);

  window.MARBLES = { engine: engine, marbles: function () { return marbles; }, start: start, reset: reset, solved: false,
                     step: step, draw: draw, count: function () { return done; } };
})();
