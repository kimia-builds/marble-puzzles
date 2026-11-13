// Puzzle data (kept as a .js file so the page opens straight from the folder).
window.PUZZLES = {
 "_about": "Read from the vector drawings in the Turing Tumble Practice Guide 1.0 (UpperStory). Grid: row 0 = top row of ramps just under the marble funnels, rows count down; col 0 = centre column, negative = left, positive = right; one col step = half a peg gap (row+col is always even). 'rolls' = the direction a marble rolls off the ramp. guide_solution_ramps are for checking our version only, never shown to the player. Crossovers: 'preplaced_crossovers' are fixed; 'guide_solution_crossovers' are the ones the player places ('crossovers_to_add' of them). 'also_accepted_ramps' (optional): other complete sets of player ramps that count as solved as well as the guide's. 'start_colour' (default blue) is the colour the Start button lets out first.",
 "puzzles": [
  {
   "id": 1,
   "name": "Challenge 1: Gravity",
   "guide_page": 1,
   "goal_text": "Make all of the blue marbles (and only the blue marbles) reach the end.",
   "goal_rule": "blue_only",
   "balls": {
    "blue": 3,
    "red": 3
   },
   "preplaced_ramps": [
    {
     "row": 0,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 1,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 2,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 4,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 6,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 8,
     "col": -2,
     "rolls": "right"
    }
   ],
   "guide_solution_ramps": [
    {
     "row": 3,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 5,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 9,
     "col": -1,
     "rolls": "left"
    }
   ],
   "ramps_to_add": 4
  },
  {
   "id": 2,
   "name": "Practice Puzzle A for Challenge 2",
   "guide_page": 3,
   "goal_text": "Make all of the blue marbles (and only the blue marbles) reach the end.",
   "goal_rule": "blue_only",
   "balls": {
    "blue": 3,
    "red": 3
   },
   "preplaced_ramps": [
    {
     "row": 0,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 1,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 3,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 4,
     "col": 0,
     "rolls": "left"
    },
    {
     "row": 6,
     "col": -2,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": -3,
     "rolls": "right"
    },
    {
     "row": 8,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 10,
     "col": 0,
     "rolls": "left"
    }
   ],
   "guide_solution_ramps": [
    {
     "row": 2,
     "col": 0,
     "rolls": "right"
    },
    {
     "row": 5,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 9,
     "col": -1,
     "rolls": "right"
    }
   ],
   "ramps_to_add": 3
  },
  {
   "id": 3,
   "name": "Challenge 2: Re-entry",
   "guide_page": 5,
   "goal_text": "Make all of the blue marbles (and only the blue marbles) reach the end. The starting setup leads marbles to the right turnstile, so use the ramps to lead them back to the left turnstile.",
   "goal_rule": "blue_only",
   "balls": {
    "blue": 3,
    "red": 3
   },
   "preplaced_ramps": [
    {
     "row": 0,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 1,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 2,
     "col": 0,
     "rolls": "right"
    },
    {
     "row": 3,
     "col": 1,
     "rolls": "right"
    },
    {
     "row": 4,
     "col": 2,
     "rolls": "right"
    },
    {
     "row": 5,
     "col": 3,
     "rolls": "right"
    }
   ],
   "guide_solution_ramps": [
    {
     "row": 6,
     "col": 4,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": 3,
     "rolls": "left"
    },
    {
     "row": 8,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 9,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 10,
     "col": 0,
     "rolls": "left"
    }
   ],
   "ramps_to_add": 5
  },
  {
   "id": 4,
   "name": "Practice Puzzle A for Challenge 3",
   "guide_page": 7,
   "goal_text": "Start the machine by releasing the blue marble. The blue marble should then release the red marble.",
   "goal_rule": "blue_then_red",
   "balls": {
    "blue": 1,
    "red": 1
   },
   "preplaced_ramps": [
    {
     "row": 0,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 0,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 1,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 1,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 2,
     "col": 0,
     "rolls": "right"
    },
    {
     "row": 7,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 9,
     "col": 1,
     "rolls": "right"
    }
   ],
   "guide_solution_ramps": [
    {
     "row": 3,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 4,
     "col": 0,
     "rolls": "right"
    },
    {
     "row": 5,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 6,
     "col": 0,
     "rolls": "right"
    },
    {
     "row": 8,
     "col": 0,
     "rolls": "right"
    }
   ],
   "also_accepted_ramps": [
    [
     {
      "row": 3,
      "col": 1,
      "rolls": "left"
     },
     {
      "row": 4,
      "col": 0,
      "rolls": "left"
     },
     {
      "row": 5,
      "col": -1,
      "rolls": "right"
     },
     {
      "row": 6,
      "col": 0,
      "rolls": "right"
     },
     {
      "row": 8,
      "col": 0,
      "rolls": "right"
     }
    ],
    [
     {
      "row": 3,
      "col": 1,
      "rolls": "left"
     },
     {
      "row": 4,
      "col": 0,
      "rolls": "right"
     },
     {
      "row": 5,
      "col": 1,
      "rolls": "right"
     },
     {
      "row": 6,
      "col": 2,
      "rolls": "left"
     },
     {
      "row": 8,
      "col": 0,
      "rolls": "right"
     }
    ],
    [
     {
      "row": 3,
      "col": 1,
      "rolls": "right"
     },
     {
      "row": 4,
      "col": 2,
      "rolls": "left"
     },
     {
      "row": 5,
      "col": 1,
      "rolls": "left"
     },
     {
      "row": 6,
      "col": 0,
      "rolls": "right"
     },
     {
      "row": 8,
      "col": 0,
      "rolls": "right"
     }
    ],
    [
     {
      "row": 3,
      "col": 1,
      "rolls": "right"
     },
     {
      "row": 4,
      "col": 2,
      "rolls": "left"
     },
     {
      "row": 5,
      "col": 1,
      "rolls": "right"
     },
     {
      "row": 6,
      "col": 2,
      "rolls": "left"
     },
     {
      "row": 8,
      "col": 0,
      "rolls": "right"
     }
    ],
    [
     {
      "row": 3,
      "col": 1,
      "rolls": "right"
     },
     {
      "row": 4,
      "col": 2,
      "rolls": "right"
     },
     {
      "row": 5,
      "col": 3,
      "rolls": "left"
     },
     {
      "row": 6,
      "col": 2,
      "rolls": "left"
     },
     {
      "row": 8,
      "col": 0,
      "rolls": "right"
     }
    ]
   ],
   "ramps_to_add": 5,
   "note": "The guide lists 8 ramps and its solution uses 7. Two of those 7 (the lowest, row 9, and the third lowest, row 7) are fixed on the board here, so the player adds 5: Kimia's decision, to cut down the number of other builds that also work. Five other clean builds still work (the four ramps above row 7 can zigzag differently, every part on the board still touched): they are listed in also_accepted_ramps and count as solved too."
  },
  {
   "id": 5,
   "name": "Challenge 3: Ignition",
   "guide_page": 9,
   "goal_text": "Release one blue marble and then all of the red marbles.",
   "goal_rule": "one_blue_then_all_red",
   "balls": {
    "blue": 3,
    "red": 3
   },
   "preplaced_ramps": [
    {
     "row": 0,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 0,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 6,
     "col": 4,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": 3,
     "rolls": "right"
    },
    {
     "row": 8,
     "col": 4,
     "rolls": "left"
    },
    {
     "row": 9,
     "col": 3,
     "rolls": "right"
    }
   ],
   "guide_solution_ramps": [
    {
     "row": 1,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 1,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 2,
     "col": 0,
     "rolls": "right"
    },
    {
     "row": 3,
     "col": 1,
     "rolls": "right"
    },
    {
     "row": 4,
     "col": 2,
     "rolls": "right"
    },
    {
     "row": 5,
     "col": 3,
     "rolls": "right"
    }
   ],
   "ramps_to_add": 6
  },
  {
   "id": 6,
   "name": "Practice Puzzle A for Challenge 4",
   "guide_page": 11,
   "goal_text": "Release one blue marble and then all of the red marbles.",
   "goal_rule": "one_blue_then_all_red",
   "balls": {
    "blue": 3,
    "red": 3
   },
   "preplaced_ramps": [
    {
     "row": 0,
     "col": -2,
     "rolls": "left"
    },
    {
     "row": 0,
     "col": 2,
     "rolls": "right"
    },
    {
     "row": 1,
     "col": -3,
     "rolls": "right"
    },
    {
     "row": 1,
     "col": 3,
     "rolls": "left"
    },
    {
     "row": 2,
     "col": -2,
     "rolls": "left"
    },
    {
     "row": 2,
     "col": 2,
     "rolls": "right"
    },
    {
     "row": 3,
     "col": -3,
     "rolls": "right"
    },
    {
     "row": 3,
     "col": 3,
     "rolls": "left"
    },
    {
     "row": 4,
     "col": -2,
     "rolls": "left"
    },
    {
     "row": 4,
     "col": 2,
     "rolls": "right"
    },
    {
     "row": 5,
     "col": -3,
     "rolls": "right"
    },
    {
     "row": 5,
     "col": 3,
     "rolls": "left"
    }
   ],
   "guide_solution_ramps": [
    {
     "row": 6,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 6,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 7,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 8,
     "col": 0,
     "rolls": "right"
    },
    {
     "row": 9,
     "col": 1,
     "rolls": "right"
    }
   ],
   "ramps_to_add": 6
  },
  {
   "id": 7,
   "name": "Challenge 4: Fusion",
   "guide_page": 15,
   "goal_text": "Release one red marble and then all of the blue marbles. The Start button is on the red side this time, so the first marble is red. The paths start far apart: use the ramps to bring them together.",
   "goal_rule": "one_red_then_all_blue",
   "start_colour": "red",
   "balls": {
    "blue": 3,
    "red": 3
   },
   "preplaced_ramps": [
    {
     "row": 0,
     "col": -2,
     "rolls": "left"
    },
    {
     "row": 0,
     "col": 2,
     "rolls": "right"
    },
    {
     "row": 1,
     "col": -3,
     "rolls": "left"
    },
    {
     "row": 1,
     "col": 3,
     "rolls": "right"
    },
    {
     "row": 2,
     "col": -4,
     "rolls": "left"
    },
    {
     "row": 2,
     "col": 4,
     "rolls": "right"
    }
   ],
   "guide_solution_ramps": [
    {
     "row": 3,
     "col": -5,
     "rolls": "right"
    },
    {
     "row": 4,
     "col": -4,
     "rolls": "right"
    },
    {
     "row": 5,
     "col": -3,
     "rolls": "right"
    },
    {
     "row": 6,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 7,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 3,
     "col": 5,
     "rolls": "left"
    },
    {
     "row": 4,
     "col": 4,
     "rolls": "left"
    },
    {
     "row": 5,
     "col": 3,
     "rolls": "left"
    },
    {
     "row": 6,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 8,
     "col": 0,
     "rolls": "left"
    },
    {
     "row": 9,
     "col": -1,
     "rolls": "left"
    }
   ],
   "ramps_to_add": 12,
   "note": "The guide lists 13 ramps but its own solution only uses 12; given 12, as with puzzle 4."
  },
  {
   "id": 8,
   "name": "Practice Puzzle A for Challenge 5",
   "guide_page": 17,
   "goal_text": "Make the pattern blue, red, blue, red, blue, red...  The new crossover part lets two paths cross without touching.",
   "goal_rule": "alternate",
   "balls": {
    "blue": 3,
    "red": 3
   },
   "preplaced_ramps": [
    {
     "row": 0,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 0,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 1,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 1,
     "col": 1,
     "rolls": "right"
    },
    {
     "row": 2,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 2,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 3,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 3,
     "col": 1,
     "rolls": "right"
    },
    {
     "row": 4,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 4,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 5,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 5,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": 1,
     "rolls": "right"
    },
    {
     "row": 8,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 8,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 9,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 9,
     "col": 1,
     "rolls": "right"
    }
   ],
   "guide_solution_ramps": [],
   "guide_solution_crossovers": [
    {
     "row": 6,
     "col": 0
    }
   ],
   "ramps_to_add": 0,
   "crossovers_to_add": 1
  },
  {
   "id": 9,
   "name": "Challenge 5: Entropy",
   "guide_page": 19,
   "goal_text": "Make the pattern blue, red, blue, red, blue, red... You have to build a path for the red marbles over to the left turnstile, and the crossover lets it cross the blue marbles' path.",
   "goal_rule": "alternate",
   "balls": {
    "blue": 3,
    "red": 3
   },
   "preplaced_ramps": [
    {
     "row": 0,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 1,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 3,
     "col": 1,
     "rolls": "right"
    },
    {
     "row": 4,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 5,
     "col": 1,
     "rolls": "right"
    },
    {
     "row": 6,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": 1,
     "rolls": "right"
    },
    {
     "row": 8,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 9,
     "col": 1,
     "rolls": "right"
    }
   ],
   "preplaced_crossovers": [
    {
     "row": 2,
     "col": 0
    }
   ],
   "guide_solution_ramps": [
    {
     "row": 0,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 1,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 3,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 4,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 5,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 6,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 7,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 8,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 9,
     "col": -1,
     "rolls": "left"
    }
   ],
   "ramps_to_add": 9,
   "crossovers_to_add": 0
  },
  {
   "id": 10,
   "name": "Practice Puzzle A for Challenge 6",
   "guide_page": 21,
   "goal_text": "Make the pattern blue, red, blue, red, blue, red... The blue and red paths cross three times, and each crossing needs a crossover.",
   "goal_rule": "alternate",
   "balls": {
    "blue": 2,
    "red": 2
   },
   "preplaced_ramps": [
    {
     "row": 0,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 0,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 1,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 1,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 3,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 3,
     "col": 1,
     "rolls": "right"
    },
    {
     "row": 4,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 4,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 5,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 5,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": -1,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": 1,
     "rolls": "right"
    },
    {
     "row": 8,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 8,
     "col": 2,
     "rolls": "left"
    },
    {
     "row": 9,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 9,
     "col": 1,
     "rolls": "left"
    }
   ],
   "guide_solution_ramps": [],
   "guide_solution_crossovers": [
    {
     "row": 2,
     "col": 0
    },
    {
     "row": 6,
     "col": 0
    },
    {
     "row": 10,
     "col": 0
    }
   ],
   "ramps_to_add": 0,
   "crossovers_to_add": 3
  },
  {
   "id": 11,
   "name": "Challenge 6: Total Internal Reflection",
   "guide_page": 23,
   "goal_text": "Make the pattern blue, red, blue, red, blue, red... The blue and red paths cross five times.",
   "goal_rule": "alternate",
   "balls": {
    "blue": 2,
    "red": 2
   },
   "preplaced_ramps": [
    {
     "row": 1,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 1,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 3,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 3,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 5,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 5,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 7,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 7,
     "col": 1,
     "rolls": "left"
    },
    {
     "row": 9,
     "col": -1,
     "rolls": "right"
    },
    {
     "row": 9,
     "col": 1,
     "rolls": "left"
    }
   ],
   "guide_solution_ramps": [
    {
     "row": 0,
     "col": -2,
     "rolls": "right"
    },
    {
     "row": 0,
     "col": 2,
     "rolls": "left"
    }
   ],
   "guide_solution_crossovers": [
    {
     "row": 2,
     "col": 0
    },
    {
     "row": 4,
     "col": 0
    },
    {
     "row": 6,
     "col": 0
    },
    {
     "row": 8,
     "col": 0
    },
    {
     "row": 10,
     "col": 0
    }
   ],
   "ramps_to_add": 2,
   "crossovers_to_add": 5
  }
 ]
};
