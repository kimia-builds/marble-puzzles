// The journey: every page, in order. All words and codes live here, never in the game code.
//
// Page kinds:
//   story  - a page of story. Next is on straight away; "button" adds a big button that does the same.
//   puzzle - one puzzle from data/puzzles.js (by its id). Must be solved to go on.
//   clue   - after a stage: congrats, the next part of the story, a clue, and a code box.
//            The right code opens the next page.
//   final  - the last page (Part 7).
//
// Codes are stored scrambled ("code_hash"), so they can't be read in the page source.
// To make a hash for a new code, open the page and type in the browser console:
//   JOURNEY_CORE.hash("YOURCODE")
// Upper/lower case and spaces don't matter when he types a code.
//
// EVERYTHING BELOW IS PLACEHOLDER TEXT until the real story (alia-story-beats.md) and codes arrive.
// Placeholder codes: 111 after stage 1, 222 after stage 2, ... 666 after stage 6.
window.JOURNEY = {
  title: "Marble Puzzles",
  pages: [
    { kind: "story", stage: 1, heading: "Part 1",
      text: ["Placeholder: Part 1 of Alia's story goes here."],
      button: "Start Stage 1" },

    { kind: "puzzle", stage: 1, puzzle: 1 },

    { kind: "clue", stage: 1, heading: "Stage 1 done!",
      story_heading: "Part 2",
      text: ["Placeholder: Part 2 of Alia's story goes here."],
      clue: "Placeholder clue for the stage 2 code. (Test code: 111)",
      code_hash: "kahocjowww" },

    { kind: "puzzle", stage: 2, puzzle: 2 },
    { kind: "puzzle", stage: 2, puzzle: 3 },

    { kind: "clue", stage: 2, heading: "Stage 2 done!",
      story_heading: "Part 3",
      text: ["Placeholder: Part 3 of Alia's story goes here."],
      clue: "Placeholder clue for the stage 3 code. (Test code: 222)",
      code_hash: "bk614y91yw" },

    { kind: "puzzle", stage: 3, puzzle: 4 },
    { kind: "puzzle", stage: 3, puzzle: 5 },

    { kind: "clue", stage: 3, heading: "Stage 3 done!",
      story_heading: "Part 4",
      text: ["Placeholder: Part 4 of Alia's story goes here."],
      clue: "Placeholder clue for the stage 4 code. (Test code: 333)",
      code_hash: "yhi0i9lyrd" },

    { kind: "puzzle", stage: 4, puzzle: 6 },
    { kind: "puzzle", stage: 4, puzzle: 7 },

    { kind: "clue", stage: 4, heading: "Stage 4 done!",
      story_heading: "Part 5",
      text: ["Placeholder: Part 5 of Alia's story goes here."],
      clue: "Placeholder clue for the stage 5 code. (Test code: 444)",
      code_hash: "w24vln2jit" },

    { kind: "puzzle", stage: 5, puzzle: 8 },
    { kind: "puzzle", stage: 5, puzzle: 9 },

    { kind: "clue", stage: 5, heading: "Stage 5 done!",
      story_heading: "Part 6",
      text: ["Placeholder: Part 6 of Alia's story goes here."],
      clue: "Placeholder clue for the stage 6 code. (Test code: 555)",
      code_hash: "10p61y9ikvp" },

    { kind: "puzzle", stage: 6, puzzle: 10 },
    { kind: "puzzle", stage: 6, puzzle: 11 },

    { kind: "clue", stage: 6, heading: "Stage 6 done!",
      text: ["Placeholder: a short congrats before the last page."],
      clue: "Placeholder clue for the final code. (Test code: 666)",
      code_hash: "1t1pb8g12ov" },

    { kind: "final", heading: "Part 7",
      text: ["Placeholder: Part 7, the final page. The treasure is the real Turing Tumble."] }
  ]
};
