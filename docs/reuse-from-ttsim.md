# How we use ttsim

ttsim is by Jesse Crossen and uses the Unlicense, so reuse is allowed.

## What we do (decided November 2026)

We run **ttsim itself, unchanged**. An earlier version of this project copied
one picture and re-wrote part of the physics by hand; it never looked or moved
like ttsim, so it was thrown away.

- `vendor/ttsim/` holds ttsim's own built files, copied as they are from its
  `docs/` folder (commit f2face4, March 2022): `app.js`, `system.js`,
  `pixi.min.js`, `pixi-filters.js`, `matter.min.js`, `images/parts.png`,
  `images/parts.json`, plus its `LICENSE`. **Do not edit these.**
- `js/ttgame.js` is ours. It asks ttsim to build its standard board, puts one
  of our puzzles on it, and adds the tray, Start / Reset and the solved check.

So the board, hoppers, marbles, ramps, crossovers, slopes, turnstiles, shadows
and all marble movement are ttsim's. Nothing about them is re-created.

## What ttgame.js changes about how ttsim behaves

- ttsim's own mouse handling is switched off, so the board cannot be panned,
  zoomed, resized or edited. Our tray and drag code place parts instead.
- ttsim's toolbars are never created.
- The puzzle's starting parts are marked locked (ttsim's own `isLocked`).
- The simulation is stepped at a steady 60 ticks a second at ttsim's normal
  speed, so it runs the same on fast (120 Hz) screens.
- Drawing is sharpened for high-density screens (ttsim draws at 1x).

## How our puzzle grid maps onto ttsim's standard board

ttsim's standard board is 13 columns by 17 rows. Our row 0 is ttsim row 2
(just under the hoppers); our column 0 is ttsim column 6 (the centre).
The turnstiles are on ttsim row 13: the left one lets out the next blue
marble, the right one the next red.

## Things to know

- ttsim's pegs are solid: a marble that leaves the track bounces off them.
- ttsim draws fixed parts and the player's parts the same way.
- The page needs a web server (it loads files over the network).
- If a change to ttsim itself is ever needed, its source is TypeScript in the
  ttsim repo's `src/` folder and would have to be rebuilt; so far nothing has
  needed it.
