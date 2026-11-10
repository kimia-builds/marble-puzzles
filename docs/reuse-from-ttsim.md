# What we can reuse from ttsim

ttsim is by Jesse Crossen and uses the Unlicense, so reuse is allowed.
Everything here is a candidate. Nothing is decided.

## Likely useful

| Item | Where in ttsim | Note |
|---|---|---|
| Ramp, ball, drop and board-pin pictures | `docs/images/parts.png` and `parts.json` | One sprite sheet. Ramp, ball and drop are in it. |
| Original artwork the sheet is made from | `src/svg/parts.svg` | Editable, for changing colours or sizes. |
| Ball animation / physics | `src/board/physics.ts`, `src/parts/partbody.ts` | Uses matter.js. This is what makes the tumbling look right. |
| Drawing the board | `src/board/board.ts`, `src/parts/part.ts` | Uses pixi.js. |

## Not in ttsim, so we'd have to make it

- The bottom of the board: the two levers and the "press to start" plunger.
  ttsim releases balls by clicking a drop instead.
- The locked, pre-set board for each puzzle.
- The "which parts you may add" tray.

## Probably not needed

Crossovers, interceptors, bits, gears, turnstiles, colour wheel, zoom,
speed, board-size, schematic view, save/load toolbar items.

## Watch out for

- ttsim was last updated in 2022 and its build tooling is Linux-oriented.
  Its own README says it "will probably kind of work on macOS".
- It ships a built `docs/app.js` (about 300 KB) alongside the TypeScript source.
