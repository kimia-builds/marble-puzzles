# Marble Puzzles (working title)

A small, simplified browser version of the first few exercises from the
Turing Tumble Practice Guide. All eleven puzzles work, joined into one journey
with story, clue and code pages between the stages (placeholder words for now; see docs/plan.md).

## What we're making

A web page where a person solves a short series of marble-run puzzles.

For each puzzle:

- The board is **locked**. Nothing on it can be moved, resized or zoomed.
- The puzzle's **starting parts are already in place**.
- The person only **adds the parts they're given** (for these first puzzles,
  ramps) to finish the path.
- They press Start, and **marbles tumble down** in the real ttsim simulator:
  the board, parts, marbles and physics are ttsim's own code, running unchanged.
- A **reset** button puts the marbles back at the top. That's all it does.

Deliberately left out: speed control, board size, zoom, saving/loading, and
any part that hasn't been introduced yet at that point in the guide.

## The puzzles

Eleven puzzles in six stages (Challenges 1 to 6, each preceded by the guide's
practice puzzle where it has one). All eleven are real puzzles: each has to be
solved to move on to the next page. The crossover is introduced at
Challenge 5. See [docs/exercises.md](docs/exercises.md).

## Later idea: the reward page

When the person has built the special pattern *and* watched the marbles run
correctly (both are required; see "What counts as solved" in docs/plan.md), a congratulatory page is revealed. Not designed yet; see
[docs/open-questions.md](docs/open-questions.md).

## Where things come from

- Puzzles: the [Turing Tumble Practice Guide](https://upperstory.com/turingtumble/assets/practice-guide-2021.pdf) (UpperStory).
- Board, parts, marbles and physics: [ttsim](https://github.com/jessecrossen/ttsim) by Jesse Crossen (Unlicense, free to reuse),
  copied unchanged into `vendor/ttsim`. See [docs/reuse-from-ttsim.md](docs/reuse-from-ttsim.md).

## Trying it

The page loads its parts over the network, so it has to be opened through a
web server (the Claude preview, or the published site), not by double-clicking
`index.html`. Start at `index.html`: it always opens the furthest page reached.
The story words, clues and codes are all in `data/journey.js`.
