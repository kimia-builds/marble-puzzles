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
    el("h1", page.heading, page.story_heading ? "congrats" : "");
    if (page.story_heading) el("h2", page.story_heading);
    paragraphs(page.text);

    var box = el("section", "", "code-box");
    var clue = document.createElement("p");
    clue.className = "clue";
    clue.textContent = page.clue;
    box.appendChild(clue);

    // One box per letter, like Hangman: the number of boxes is part of the clue.
    // A gap between groups of boxes is a space between two words.
    var form = document.createElement("form");
    var letters = document.createElement("div");
    letters.className = "letters";
    letters.setAttribute("role", "group");
    letters.setAttribute("aria-label", "Code, one letter in each box");
    var boxes = [];
    (page.code_letters || [1]).forEach(function (count) {
      var word = document.createElement("span");
      word.className = "word";
      for (var k = 0; k < count; k++) {
        var b = document.createElement("input");
        b.autocomplete = "off";
        b.spellcheck = false;
        b.setAttribute("autocapitalize", "characters");
        b.setAttribute("aria-label", "Letter " + (boxes.length + 1));
        word.appendChild(b);
        boxes.push(b);
      }
      letters.appendChild(word);
    });
    form.appendChild(letters);
    var check = document.createElement("button");
    check.type = "submit";
    check.textContent = "Check";
    form.appendChild(check);
    box.appendChild(form);

    function typed() { return boxes.map(function (b) { return b.value; }).join(""); }
    // put letters into the boxes starting at box "from"; anything that isn't a letter or number is skipped
    function fill(text, from) {
      var chars = String(text).toUpperCase().replace(/[^A-Z0-9]/g, "").split("");
      var i = from;
      while (chars.length && i < boxes.length) boxes[i++].value = chars.shift();
      return Math.min(i, boxes.length - 1);
    }
    boxes.forEach(function (b, i) {
      b.addEventListener("input", function () {
        var v = b.value;
        b.value = "";
        var at = fill(v, i);
        if (boxes[i].value) boxes[at].focus();
      });
      b.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !b.value && i > 0) { boxes[i - 1].value = ""; boxes[i - 1].focus(); e.preventDefault(); }
        if (e.key === "ArrowLeft" && i > 0) { boxes[i - 1].focus(); e.preventDefault(); }
        if (e.key === "ArrowRight" && i < boxes.length - 1) { boxes[i + 1].focus(); e.preventDefault(); }
        if (e.key === " ") e.preventDefault();
      });
      b.addEventListener("focus", function () { b.select(); });
      b.addEventListener("paste", function (e) {
        e.preventDefault();
        boxes[fill((e.clipboardData || window.clipboardData).getData("text"), i)].focus();
      });
    });
    var msg = document.createElement("p");
    msg.className = "code-msg";
    msg.setAttribute("role", "status");
    box.appendChild(msg);

    function found() {
      boxes.forEach(function (b) { b.disabled = true; });
      check.disabled = true;
      setNext(true);
    }
    // already got past this page before: show the code he found, no need to type it again
    if (J.getProgress() > step) {
      fill(J.foundCode(step) || "", 0);
      found();
      msg.textContent = "✓ Code already found.";
      msg.className = "code-msg right";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (check.disabled) return;
      if (J.hash(typed()) === page.code_hash) {
        J.rememberCode(step, typed());
        J.reach(step + 1);
        found();
        msg.textContent = "✓ Right! Press Next.";
        msg.className = "code-msg right";
      } else {
        msg.textContent = "✗ Not that one. Try again.";
        msg.className = "code-msg wrong";
        (boxes.filter(function (b) { return !b.value; })[0] || boxes[boxes.length - 1]).focus();   // first empty box, or the last one to start correcting
      }
    });
    if (!check.disabled) boxes[0].focus();
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
