# The eleven puzzles (six stages)

Taken from the Turing Tumble Practice Guide (version 1.0, 2021), in book
order. Page numbers are the guide's own printed page numbers.
The game has **six stages**, one per Challenge (1 to 6). The practice puzzles
before a challenge are **real puzzles too**: same solved check as the Challenges
(right marbles and the guide's exact setup), and each must be solved to move on.
Every puzzle uses two marble colours (blue, red) and the two turnstiles at the
bottom of the board (ttsim's stand-in for the real board's levers). Ramps are the first part; the **crossover** is introduced
at Challenge 5 (that is where the guide introduces it too).

| # | Stage | Name in the guide | Guide page | Goal | Parts to add |
|---|---|---|---|---|---|
| 1 | 1 | Challenge 1: Gravity | 1 | All the blue marbles (and only blue) reach the end. | 4 ramps |
| 2 | 2 | Practice Puzzle A for Challenge 2 | 3 | All the blue marbles (and only blue) reach the end. | 3 ramps |
| 3 | 2 | Challenge 2: Re-entry | 5 | Same goal. | 5 ramps |
| 4 | 3 | Practice Puzzle A for Challenge 3 | 7 | The blue marble releases the red marble. | 5 ramps |
| 5 | 3 | Challenge 3: Ignition | 9 | One blue marble, then all the red. | 6 ramps |
| 6 | 4 | Practice Puzzle A for Challenge 4 | 11 | One blue marble, then all the red. | 6 ramps |
| 7 | 4 | Challenge 4: Fusion | 15 | One RED marble (Start is on the red side), then all the blue. | 12 ramps |
| 8 | 5 | Practice Puzzle A for Challenge 5 | 17 | Pattern blue, red, blue, red... | 1 crossover |
| 9 | 5 | Challenge 5: Entropy | 19 | Pattern blue, red, blue, red... | 9 ramps |
| 10 | 6 | Practice Puzzle A for Challenge 6 | 21 | Pattern blue, red, blue, red... | 3 crossovers |
| 11 | 6 | Challenge 6: Total Internal Reflection | 23 | Pattern blue, red, blue, red... | 2 ramps + 5 crossovers |

Marble counts: the guide uses 8 blue and 8 red; we use **3 and 3** (waiting for
8 was too tedious), **2 and 2** for puzzles 10 and 11 (crossovers are slow),
and 1 and 1 for puzzle 4 (as in the guide).

Ramp counts: puzzle 4 (guide says 8, solution uses 7) and Challenge 4 (guide
says 13, solution uses 12): decided with Kimia to give exactly what the
solution uses.

Puzzle 4 has two of its seven solution ramps already fixed on the board (the
lowest one, row 9, and the third lowest, row 7), so the player adds 5. Kimia's
decision: with all seven loose, dozens of other builds also set off the red
marble, and the game turned them down for not matching the guide. Six clean
builds remain (the ramps above row 7 can zigzag differently); the game accepts
all six.

The board is 11 columns wide (-5 to +5): Challenge 4's solution uses the
outermost columns.

## Done

Pre-placed parts and the guide's solution for each puzzle are in
`data/puzzles.js`, read from the guide's PDF (puzzles 7-11 by laying a
row/column grid over the guide's pictures and zooming in on each ramp).
The solutions are for checking our version only, never shown to the person.
Every puzzle was run with its guide solution in the simulator, and the
challenges also fail correctly with a wrong setup.
