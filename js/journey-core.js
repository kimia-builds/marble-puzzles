// Shared by every page of the journey: the page order, remembered progress, and code checking.
//
// Progress is one number, remembered in this browser: how far along the journey the person has got
// (an index into JOURNEY.pages). A page beyond it is locked. It only ever goes up.
(function () {
  "use strict";

  var KEY = "marble-puzzles-progress";
  var pages = window.JOURNEY.pages;

  function getProgress() {
    var n = 0;
    try { n = parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) { n = memory; }
    return Math.max(0, Math.min(n, pages.length - 1));
  }
  var memory = 0;   // used only if the browser won't let us remember anything
  function reach(step) {
    if (step <= getProgress()) return;
    memory = step;
    try { localStorage.setItem(KEY, String(step)); } catch (e) { /* kept in memory instead */ }
  }

  // the right codes he has typed, so a code page he comes back to still shows his code
  var CODES = "marble-puzzles-codes", codeMemory = {};
  function readCodes() {
    try { return JSON.parse(localStorage.getItem(CODES)) || {}; } catch (e) { return codeMemory; }
  }
  function rememberCode(step, code) {
    var all = readCodes();
    all[step] = String(code).trim();
    codeMemory = all;
    try { localStorage.setItem(CODES, JSON.stringify(all)); } catch (e) { /* kept in memory instead */ }
  }
  function foundCode(step) { return readCodes()[step]; }

  // the parts that solved each puzzle, so going back to a solved puzzle shows his setup
  // (only the parts: the marbles always start again in their hoppers; unsolved puzzles open fresh)
  var BOARDS = "marble-puzzles-boards", boardMemory = {};
  function readBoards() {
    try { return JSON.parse(localStorage.getItem(BOARDS)) || {}; } catch (e) { return boardMemory; }
  }
  function rememberBoard(step, parts) {
    var all = readBoards();
    all[step] = parts;
    boardMemory = all;
    try { localStorage.setItem(BOARDS, JSON.stringify(all)); } catch (e) { /* kept in memory instead */ }
  }
  function savedBoard(step) { return readBoards()[step] || []; }

  // the address of a page: puzzles have their own page, everything else is on index.html
  function urlFor(step) {
    return (pages[step].kind === "puzzle" ? "puzzle.html" : "index.html") + "?step=" + step;
  }

  // which page this address asks for; anything locked or missing goes to the furthest page reached
  function currentStep() {
    var s = parseInt(new URLSearchParams(window.location.search).get("step"), 10);
    if (s >= 0 && s < pages.length && s <= getProgress()) return s;
    s = getProgress();
    // show the page actually being shown in the address bar
    if (pages[s].kind === "puzzle" ? /puzzle\.html$/.test(location.pathname) : !/puzzle\.html$/.test(location.pathname)) {
      try { history.replaceState(null, "", urlFor(s)); } catch (e) {}
    }
    return s;
  }

  // finish this page: unlock the next one and go there
  function next(step) {
    reach(step + 1);
    window.location.href = urlFor(step + 1);
  }

  // a small, fixed scrambling of a code, so codes aren't readable in the page source (not real security)
  function normalise(code) { return String(code).toUpperCase().replace(/[^A-Z0-9]/g, ""); }   // case, spaces and dots don't matter
  function hash(code) {
    var s = normalise(code), h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }

  // "Stage 2 · Puzzle 1 of 2"
  function stageLabel(step) {
    var p = pages[step];
    if (!p.stage) return "";
    var inStage = [];
    pages.forEach(function (q, i) { if (q.kind === "puzzle" && q.stage === p.stage) inStage.push(i); });
    var label = "Stage " + p.stage + " of 6";
    if (p.kind === "puzzle" && inStage.length > 1) label += " · Puzzle " + (inStage.indexOf(step) + 1) + " of " + inStage.length;
    return label;
  }

  // The frame every page shares, always in the same places:
  //   top: a progress bar with one segment per page (grouped by stage);
  //   bottom: Back (left), Start over (centre) and Next (right). Next stays greyed out until the page is done.
  // Returns setNext(on) to switch Next on once the puzzle is solved or the code is right.
  function frame(step) {
    var top = document.createElement("header");
    top.id = "progress";
    var label = document.createElement("p");
    label.className = "progress-label";
    var p = pages[step];
    label.textContent = p.kind === "final" ? "The end" : (p.stage ? stageLabel(step) : "Start");
    var bar = document.createElement("div");
    bar.className = "progress-bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuemin", "1");
    bar.setAttribute("aria-valuemax", String(pages.length));
    bar.setAttribute("aria-valuenow", String(step + 1));
    var group = null, groupKey = null, reached = getProgress();
    pages.forEach(function (q, i) {
      var key = q.stage || q.kind;          // the opening story sits with stage 1's puzzle; the end on its own
      if (q.kind === "story") key = 1;
      if (key !== groupKey) {
        group = document.createElement("div");
        group.className = "progress-group";
        bar.appendChild(group);
        groupKey = key;
      }
      var seg = document.createElement("span");
      seg.className = "seg " + q.kind + (i < step ? " done" : i === step ? " here" : i <= reached ? " done" : "");
      group.appendChild(seg);
    });
    top.appendChild(label);
    top.appendChild(bar);
    document.body.insertBefore(top, document.body.firstChild);

    var bottom = document.createElement("nav");
    bottom.id = "step-nav";
    bottom.setAttribute("aria-label", "Back and next");
    bottom.innerHTML = '<button id="back" type="button">← Back</button><button id="restart" type="button">Start over</button><button id="next" type="button">Next →</button>';
    document.body.appendChild(bottom);
    var back = bottom.querySelector("#back"), nextBtn = bottom.querySelector("#next");
    bottom.querySelector("#restart").addEventListener("click", function () {
      if (window.confirm("Start the whole journey again from the beginning?")) window.JOURNEY_CORE.startOver();
    });
    back.disabled = step === 0;
    back.addEventListener("click", function () { if (step > 0) window.location.href = urlFor(step - 1); });
    nextBtn.addEventListener("click", function () { if (!nextBtn.disabled) next(step); });
    function setNext(on) { nextBtn.disabled = !on || step >= pages.length - 1; nextBtn.classList.toggle("ready", !nextBtn.disabled); }
    setNext(reached > step);
    return setNext;
  }

  window.JOURNEY_CORE = {
    pages: pages, getProgress: getProgress, reach: reach, urlFor: urlFor,
    currentStep: currentStep, next: next, hash: hash, stageLabel: stageLabel, frame: frame,
    rememberCode: rememberCode, foundCode: foundCode,
    rememberBoard: rememberBoard, savedBoard: savedBoard,
    startOver: function () { try { localStorage.removeItem(KEY); localStorage.removeItem(CODES); localStorage.removeItem(BOARDS); } catch (e) {} memory = 0; codeMemory = {}; boardMemory = {}; window.location.href = urlFor(0); }
  };
})();
