# Build plan

**Why:** a puzzle journey given as a gift, which teaches the player how Turing Tumble works
(and who Alia is) before the physical game is handed over. The physical game is the treasure
at the end. The story follows Alia from the world of Ninjago, out of magic and into science,
ending where the Turing Tumble story begins. See the README for the idea and design principles.

Decided with Kimia: a small page that runs the real ttsim simulator, unchanged,
for the board and marbles (see docs/reuse-from-ttsim.md); puzzle layouts read from the UpperStory PDF;
desktop and tablet (mouse or touch); the finished thing is a **journey** of
puzzles with story/code pages between them.

## Shape of the finished thing

A fixed sequence of pages:

Part 1 story → stage 1 puzzle → stage-done page (Part 2 story + clue + code box) → stage 2 puzzles → … → stage 6 → last clue + code → final page (Part 7)

(Six stages = Challenges 1-6. Stages 2 to 6 have two puzzles each: the guide's practice puzzle, then the Challenge.
Both are real puzzles with a solved state. **Every puzzle has to be genuinely solved to move on to the next page**:
solving a stage's practice puzzle opens that stage's Challenge, and solving the Challenge opens the stage's congrats page
and code box. Nothing in a stage can be skipped.)

- A person cannot reach a later page without typing the right code.
- Each puzzle page: locked ttsim board, pre-placed parts, a tray of parts to drag
  in, a Start button, ttsim's marbles, a Reset button (resets marbles only).
- The page itself checks the puzzle goal. Only a genuinely solved run unlocks
  that round's code box. (This is the "watched it run correctly" check.)

## What counts as "solved" (decided with Kimia)

Success needs BOTH of these, every time:

1. **Correct marble output**, by the puzzle's `goal_rule`: blue only (challenges 1-2); one blue then all the red (3); one red then all the blue (4); alternating blue, red, blue... (5-6). Each practice puzzle has a rule of its own in the same way (usually its Challenge's rule; the one before Challenge 3 is "the blue marble sets off the red one").
2. **Correct ramp setup**: the ramps the player placed are exactly the guide's solution
   (`guide_solution_ramps`): every ramp placed, in the right spot, leaning the right way, none extra.

Marbles reaching the goal with any other setup is NOT a solve. Direction is part of the setup.
Checked by `setupCheck()` in `js/ttgame.js`. This is the "built the pattern *and* watched it run
correctly" idea from the README, and it is what unlocks a round's code box.

## Choices I made so you don't have to (say if you disagree)

- Plain web page: HTML, CSS and JavaScript, no build step, so it publishes
  anywhere. It needs a web server to open (not a double-click on the file).
  The board and physics are ttsim's own built files in `vendor/ttsim`.
- All story text, codes and puzzle layouts live in **data files**, not in the
  code. Changing a story line or a code never touches the game logic.
- Codes are stored scrambled (hashed), so they aren't readable in the page
  source. This is a game, not real security: a determined person could still
  skip ahead. Fine for this purpose.
- Progress is remembered in the browser, so a refresh doesn't send someone
  back to the start.

## Sessions (one deliverable each, in this order)

Keep each session to its one job; start a fresh session for the next.

| # | Job | Done when | Needs from Kimia |
|---|---|---|---|
| 1 | **Puzzle data.** Download the guide (public PDF), read the six pages, write `data/puzzles.js` (pre-placed ramps, ramps to add, ball counts, goal). | A picture of each board is shown to Kimia and confirmed to match the guide. | Confirm the six pictures. |
| 2 | **Board and ramps.** Page that draws the locked board from the data, with the ramp tray and drag-to-place (mouse and touch), snapping to valid spots. No marbles yet. Puzzle 1 only. | You can place and remove the 4 ramps on puzzle 1. Nothing else on the board moves. | Quick look and feedback. |
| 3 | **Marbles and levers (the heavy part).** Marble release, physics, ramps and the two bottom levers, Reset. Puzzle 1 only. | Marbles tumble like ttsim; correct solution sends the blue balls to the end. | Judge whether it *feels* right. |
| 4 | **Goal checking and all six puzzles.** Per-puzzle win rules (blue only; blue then red; one blue then all red). Load puzzles 2–6. Check each against the guide's own solution. | All six solve with the guide's solution and fail with a wrong one. | None. |
| 5 | **The journey.** Story pages, congrats pages, code boxes, locking, remembered progress, final page. Placeholder text and codes. | You can only get through by solving and entering codes, start to finish. | Story text and codes (can arrive later; placeholders until then). |
| 6 | **Polish and publish.** Tablet touch check, small-screen sanity, credits visible, publish. | Live link works on a tablet. | Nothing. |

**Status:** Sessions 1 to 4 are done, and the board and marbles were then rebuilt on the real ttsim engine
(Kimia found the hand-made version did not look or feel like ttsim). All 11 puzzles solve with the guide's solution on it.
The bottom of the board is ttsim's slopes and two turnstiles (Kimia's choice, replacing the earlier lever bars); speed is ttsim's normal speed.
Practice puzzles were free play for a while; now that the board is the real ttsim one they are ordinary solvable puzzles again, checked exactly like the Challenges (Kimia's decision). Also since playtesting: runs use 3 marbles instead of 8; the crossover part, Challenges 4-6 and practice 5/6 were added (11 puzzles, 6 stages). Session 4: the page could show any of the puzzles by number (replaced in Session 5 by the journey). Each puzzle uses its own win rule from `data/puzzles.js`.

**Session 5, first slice (flow only, plain look):** the journey works end to end with placeholder text and codes.
Page order (decided with Kimia): Part 1 story → Stage 1 puzzle → a page with "Stage done", the next story part, a clue
and the code box → the next stage's puzzles → … → after Stage 6, a clue + code page → final page (Part 7).
The clue on each page is a small extra puzzle or question whose answer is the code.
- `index.html` is the journey (story, clue and final pages); `puzzle.html?step=N` is the board. Opening `index.html`
  goes to the furthest page reached. Locked pages can't be opened by changing the address.
- All words, clues and codes are in `data/journey.js`. Codes are stored scrambled; make one with
  `JOURNEY_CORE.hash("CODE")` in the browser console. Placeholder codes: 111, 222, ... 666.
- Every page has the same frame (Kimia's request): a progress bar on top (one segment per page, grouped by
  stage; orange = this page), and Back (bottom left) and Next (bottom right) always in the same place.
  Next is greyed out until the page is done: story read, puzzle solved, or right code typed (then it turns orange).
- Dark grey page; the board (ttsim draws it white) and the parts tray stay light.
- Solving a puzzle is remembered at once. A code page already passed shows the code he typed, in a green box,
  with "Code already found" (Kimia's request).
- The Part 1 page keeps its big "Start Stage 1" button (Kimia's request), as well as Next. Reopening the link
  after only reading Part 1 lands on Part 1 again: the story counts as read once he presses Start or Next.
- The final page has a "Start over" button (asks first).
- Still to do in Session 5: the real story text and clues/codes (waiting on alia-story-beats.md), then the look,
  one visible change at a time.

Sessions 2 and 3 are the biggest. If session 3 runs long, split it at "marbles
fall" versus "levers and win check" rather than letting it sprawl.

## Not blocking, but needed by session 5

- The story pages' words.
- The codes, and what the encryption/decryption steps are (cipher type, what
  the person is shown, what they type). If a step needs its own little tool
  (for example a decoder wheel), tell me before session 5 so I can size it.

## Publishing (settled)

Kimia confirmed UpperStory's guide is free to use for non-commercial purposes
as long as credit is given. This project is non-commercial. So: credit
UpperStory (and ttsim's Jesse Crossen) visibly in the game and README, and
keep it non-commercial. The repo can be made public.

## Rules to keep it cheap

- Each session starts by reading only this file and the one data file it needs.
- ttsim is used as it is, never re-created by hand. If something should look or
  move differently, check how ttsim does it first (docs/reuse-from-ttsim.md).
- Show finished slices one visible change at a time, as with Habitat.
