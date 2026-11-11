# Turing Tumble Treasure Hunt

*(repository: `marble-puzzles`)*

A browser puzzle journey made as a gift. It teaches a young player how
[Turing Tumble](https://upperstory.com/turingtumble/) works, one puzzle at a time,
so that by the time the real, physical game is handed over they already know how
to use it and who its characters are. The physical Turing Tumble is the treasure
at the end of the hunt.

## The idea

- **Real Turing Tumble from the start.** Every puzzle is a real one, taken in order
  from UpperStory's official Practice Guide (Challenges 1 to 6 and their practice
  puzzles). The game needs a little commitment before it gets good, so the journey
  starts with it straight away.
- **A story wrapped around it.** The puzzles are joined by a story told through
  Alia, the heroine of Turing Tumble's own story, who is there from the first stage.
  It begins in the world of LEGO Ninjago and, stage by stage, follows Alia out of
  magic and into science, ending where the Turing Tumble story begins.
- **One new thing at a time.** Each puzzle adds only a little. Ramps come first;
  the crossover arrives at Challenge 5.
- **Nothing can be skipped.** Every puzzle has to be genuinely solved to move on.
- **Finish on the real thing.** The last page leads to the physical game.

## How it unfolds

Six stages, one per Challenge. Stage 1 is Challenge 1; Stages 2 to 6 each have the
guide's practice puzzle, then the Challenge. Eleven puzzles in all.

**Part 1 story, question and code box → Stage 1 puzzle → "Stage done" page (Part 2 of the
story, a question, a code box) → Stage 2's puzzles → … → Part 6 and its code → Stage 6's
puzzles → final page (Part 7).**

- Each of Parts 1 to 6 ends with a question about the story; its answer is the code
  that opens that part's stage. Capitals, spaces and dots don't matter when typing it.
- A progress bar on every page shows how far along the journey you are.
  **Back** (bottom left) and **Next** (bottom right) are always in the same place;
  Next stays greyed out until the page is done (puzzle solved, or right code typed).
- Progress is remembered in the browser, so the player can stop and come back
  another day and pick up where they left off.

The whole journey is delivered at once and the player unlocks the stages in their
own time.

## Design principles

- **Short instructions, minimal reading.**
- **A steady rhythm.** Every stage follows the same pattern and every page has the
  same frame, so there is always a familiar baseline to come back to.
- **True to the physical game.** The puzzles use the same parts, in the same order,
  and behave the same way as the real Turing Tumble. The board and marbles are the
  real [ttsim](https://github.com/jessecrossen/ttsim) simulator, running unchanged.

## Each puzzle

- The board is **locked**. Nothing on it can be moved, resized or zoomed.
- The puzzle's **starting parts are already in place**.
- The player only **adds the parts they're given** (ramps, later crossovers) to
  finish the path: drag a part onto the board, tap a ramp to flip it.
- **Start** lets the first marble go; **Reset marbles** puts them back at the top.
- A **solved** puzzle keeps the player's parts: going back to it shows the setup that
  solved it, with the marbles back in their hoppers. A puzzle not solved yet always
  opens fresh, with none of the player's parts on it.
- **Solved** means both the right marbles came out *and* the parts are where the
  guide's solution puts them (see "What counts as solved" in [docs/plan.md](docs/plan.md));
  one practice puzzle accepts a few other equally good builds).

Deliberately left out: speed control, board size, zoom, saving or loading boards by hand, and any part
that hasn't been introduced yet at that point in the guide.

The puzzles themselves are listed in [docs/exercises.md](docs/exercises.md).

## Status

All eleven puzzles work, joined into the full journey with its progress bar and
Back/Next. The real story (seven parts), its questions and its six codes are in, all
in `data/journey.js`. Still to come: the look, then a tablet check and
publishing. See [docs/plan.md](docs/plan.md).

## Where things come from

- Puzzles: the [Turing Tumble Practice Guide](https://upperstory.com/turingtumble/assets/practice-guide-2021.pdf)
  by UpperStory, free to use for non-commercial purposes with credit.
- Board, parts, marbles and physics: [ttsim](https://github.com/jessecrossen/ttsim) by Jesse Crossen
  (Unlicense, free to reuse), copied unchanged into `vendor/ttsim`.
  See [docs/reuse-from-ttsim.md](docs/reuse-from-ttsim.md).
- Turing Tumble and its characters belong to UpperStory; LEGO and Ninjago are
  trademarks of the LEGO Group. This is a non-commercial fan project, not
  affiliated with either.

## Trying it

The page loads its parts over the network, so it has to be opened through a web
server (the Claude preview, or the published site), not by double-clicking
`index.html`. Start at `index.html`: it always opens the furthest page reached.
