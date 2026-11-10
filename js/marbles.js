// Session 3 (first half): marbles fall, and the ramps move.
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
  }
  rebuildRamps();
  B.onChange(rebuildRamps);

  // ---- marbles ----
  var left = { blue: B.puzzle.balls.blue, red: B.puzzle.balls.red };
  var done = { blue: 0, red: 0 };
  var marbles = [];   // { body, el, colour }
  var blueBtn = document.getElementById("drop-blue");
  var redBtn = document.getElementById("drop-red");
  var tally = document.getElementById("tally");
  var bottomY = (B.height - B.originY) / K + 40;   // below this a marble has left the board

  function refreshUi() {
    blueBtn.textContent = "Drop a blue marble (" + left.blue + " left)";
    redBtn.textContent = "Drop a red marble (" + left.red + " left)";
    blueBtn.disabled = left.blue === 0;
    redBtn.disabled = left.red === 0;
    tally.textContent = "At the end: " + done.blue + " blue, " + done.red + " red";
  }

  function drop(colour) {
    if (left[colour] === 0) return;
    left[colour]--;
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
    refreshUi();
  }

  function reset() {
    marbles.forEach(function (m) { M.Composite.remove(world, m.body); B.el.removeChild(m.el); });
    marbles = [];
    left = { blue: B.puzzle.balls.blue, red: B.puzzle.balls.red };
    done = { blue: 0, red: 0 };
    refreshUi();
  }

  blueBtn.addEventListener("click", function () { drop("blue"); });
  redBtn.addEventListener("click", function () { drop("red"); });
  document.getElementById("reset").addEventListener("click", reset);

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

  // ---- the loop: fixed 60-per-second ticks, drawing after each ----
  var last = null, acc = 0, TICK = 1000 / 60;
  function step() {
    for (var i = 0; i < STEPS_PER_TICK; i++) { M.Engine.update(engine, TICK); afterStep(); }
  }
  function draw() {
    ramps.forEach(function (r) {
      if (r.el) r.el.style.transform = "rotate(" + r.body.angle + "rad) scaleX(" + (r.flipped ? -1 : 1) + ")";
    });
    for (var i = marbles.length - 1; i >= 0; i--) {
      var m = marbles[i], p = m.body.position;
      if (p.y > bottomY) {                  // fell out of the bottom
        M.Composite.remove(world, m.body);
        B.el.removeChild(m.el);
        marbles.splice(i, 1);
        done[m.colour]++;
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

  window.MARBLES = { engine: engine, marbles: function () { return marbles; }, drop: drop, reset: reset,
                     step: step, draw: draw, count: function () { return done; } };
})();
