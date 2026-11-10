# Marble Puzzles (working title)

A small, simplified browser version of the first few exercises from the
Turing Tumble Practice Guide. The project is at the planning stage: this
repo holds the docs that describe what we want to build. No code yet.

## What we're making

A web page where a person solves a short series of marble-run puzzles.

For each puzzle:

- The board is **locked**. Nothing on it can be moved, resized or zoomed.
- The puzzle's **starting parts are already in place**.
- The person only **adds the parts they're given** (for these first puzzles,
  ramps) to finish the path.
- They press the lever, and **marbles tumble down, animated** the way they are
  in the ttsim simulator.
- A **reset** button puts the marbles back at the top. That's all it does.

Deliberately left out: speed control, board size, zoom, saving/loading, and
any part that hasn't been introduced yet at that point in the guide.

## The six puzzles (subject to change)

The first six, up to and including Practice Puzzle A for Challenge 4. See
[docs/exercises.md](docs/exercises.md).

## Later idea: the reward page

When the person has built the special pattern *and* watched the marbles run
correctly, a congratulatory page is revealed. Not designed yet; see
[docs/open-questions.md](docs/open-questions.md).

## Where things come from

- Puzzles: the [Turing Tumble Practice Guide](https://upperstory.com/turingtumble/assets/practice-guide-2021.pdf) (UpperStory).
- Look, feel and animation: [ttsim](https://github.com/jessecrossen/ttsim) by Jesse Crossen (Unlicense, free to reuse).
  See [docs/reuse-from-ttsim.md](docs/reuse-from-ttsim.md).
