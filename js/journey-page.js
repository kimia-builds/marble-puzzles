// The journey's story, clue and final pages (index.html). Puzzles are on puzzle.html.
// Opening index.html with no address takes the person to the furthest page they have reached.
// Back and Next sit in the same place on every page (see frame() in js/journey-core.js).
(function () {
  "use strict";

  var J = window.JOURNEY_CORE;
  var step = J.currentStep();
  var page = J.pages[step];

  // a puzzle step belongs on the puzzle page
  if (page.kind === "puzzle") { window.location.replace(J.urlFor(step)); return; }

  var setNext = J.frame(step);
  var root = document.getElementById("page");

  function el(tag, text, cls) {
    var e = document.createElement(tag);
    if (text) e.textContent = text;
    if (cls) e.className = cls;
    root.appendChild(e);
    return e;
  }
  function paragraphs(list) { (list || []).forEach(function (t) { el("p", t, "story"); }); }

  if (page.kind === "story") {
    el("h1", page.heading);
    paragraphs(page.text);
    // reading the story is all this page asks, so Next is on straight away;
    // the page's own button does the same as Next
    setNext(true);
    if (page.button) {
      var go = el("button", page.button, "begin");
      go.addEventListener("click", function () { J.next(step); });
    }
  }

  if (page.kind === "clue") {
    el("h1", page.heading, "congrats");
    if (page.story_heading) el("h2", page.story_heading);
    paragraphs(page.text);

    var box = el("section", "", "code-box");
    var clue = document.createElement("p");
    clue.className = "clue";
    clue.textContent = page.clue;
    box.appendChild(clue);

    var form = document.createElement("form");
    form.innerHTML = '<label for="code">Code</label>' +
      '<input id="code" autocomplete="off" autocapitalize="characters" spellcheck="false">' +
      '<button type="submit">Check</button>';
    box.appendChild(form);
    var input = form.querySelector("input");
    var msg = document.createElement("p");
    msg.className = "code-msg";
    msg.setAttribute("role", "status");
    box.appendChild(msg);

    function found() {
      input.disabled = true;
      form.querySelector("button").disabled = true;
      setNext(true);
    }
    // already got past this page before: show the code he found, no need to type it again
    if (J.getProgress() > step) {
      input.value = J.foundCode(step) || "";
      found();
      msg.textContent = "✓ Code already found.";
      msg.className = "code-msg right";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (input.disabled) return;
      if (J.hash(input.value) === page.code_hash) {
        J.rememberCode(step, input.value);
        J.reach(step + 1);
        found();
        msg.textContent = "✓ Right! Press Next.";
        msg.className = "code-msg right";
      } else {
        msg.textContent = "✗ Not that one. Try again.";
        msg.className = "code-msg wrong";
        input.select();
      }
    });
    if (!input.disabled) input.focus();
  }

  if (page.kind === "final") {
    el("h1", page.heading);
    paragraphs(page.text);
    var again = el("button", "Start over", "start-over");
    again.addEventListener("click", function () {
      if (window.confirm("Start the whole journey again from the beginning?")) J.startOver();
    });
  }
})();
