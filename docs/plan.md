# Build plan

Decided with Kimia: small new page that borrows ttsim's ramp/ball pictures and
its marble-physics library; puzzle layouts read from the UpperStory PDF;
desktop and tablet (mouse or touch); the finished thing is a **journey** of
puzzles with story/code pages between them.

## Shape of the finished thing

A fixed sequence of pages:

story 1 → puzzle 1 → congrats + code box → story 2 → puzzle 2 → congrats + code box → … → puzzle 6 → final page

- A person cannot reach a later page without typing the right code.
- Each puzzle page: locked board, pre-placed ramps, a tray of ramps to drag
  in, a lever button, animated marbles, a Reset button (resets marbles only).
- The page itself checks the puzzle goal. Only a genuinely solved run unlocks
  that round's code box. (This is the "watched it run correctly" check.)

## Choices I made so you don't have to (say if you disagree)

- Plain web page: HTML, CSS and JavaScript, no build step, so it opens
  straight from the folder and publishes anywhere. Physics library: matter.js.
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
| 1 | **Puzzle data.** Download the guide (public PDF), read the six pages, write `data/puzzles.json` (pre-placed ramps, ramps to add, ball counts, goal). | A picture of each board is shown to Kimia and confirmed to match the guide. | Confirm the six pictures. |
| 2 | **Board and ramps.** Page that draws the locked board from the data, with the ramp tray and drag-to-place (mouse and touch), snapping to valid spots. No marbles yet. Puzzle 1 only. | You can place and remove the 4 ramps on puzzle 1. Nothing else on the board moves. | Quick look and feedback. |
| 3 | **Marbles and levers (the heavy part).** Marble release, physics, ramps and the two bottom levers, Reset. Puzzle 1 only. | Marbles tumble like ttsim; correct solution sends the blue balls to the end. | Judge whether it *feels* right. |
| 4 | **Goal checking and all six puzzles.** Per-puzzle win rules (blue only; blue then red; one blue then all red). Load puzzles 2–6. Check each against the guide's own solution. | All six solve with the guide's solution and fail with a wrong one. | None. |
| 5 | **The journey.** Story pages, congrats pages, code boxes, locking, remembered progress, final page. Placeholder text and codes. | You can only get through by solving and entering codes, start to finish. | Story text and codes (can arrive later; placeholders until then). |
| 6 | **Polish and publish.** Tablet touch check, small-screen sanity, credits visible, publish. | Live link works on a tablet. | Nothing. |

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
- No reading of the whole ttsim source: only the sprite sheet and physics notes
  in `docs/reuse-from-ttsim.md`.
- Show finished slices one visible change at a time, as with Habitat.
