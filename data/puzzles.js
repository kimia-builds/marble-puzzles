// Puzzle data (kept as a .js file so the page opens straight from the folder).
window.PUZZLES = {
 "_about": "Read from the vector drawings in the Turing Tumble Practice Guide 1.0 (UpperStory). Grid: row 0 = top row of ramps just under the ball funnels, rows count down; col 0 = centre column, negative = left, positive = right; one col step = half a peg gap (row+col is always even). 'rolls' = the direction a ball rolls off the ramp. guide_solution_ramps are for checking our version only, never shown to the player.",
 "puzzles": [
  {
   "id": 1,
   "name": "Challenge 1: Gravity",
   "guide_page": 1,
   "goal_text": "Make all of the blue balls (and only the blue balls) reach the end.",
   "goal_rule": "blue_only",
   "balls": {
    "blue": 8,
    "red": 8
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
   "goal_text": "Make all of the blue balls (and only the blue balls) reach the end.",
   "goal_rule": "blue_only",
   "balls": {
    "blue": 8,
    "red": 8
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
   "goal_text": "Make all of the blue balls (and only the blue balls) reach the end. The starting setup leads balls to the right lever, so use the ramps to lead them back to the left lever.",
   "goal_rule": "blue_only",
   "balls": {
    "blue": 8,
    "red": 8
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
   "goal_text": "Start the machine by releasing the blue ball. The blue ball should then release the red ball.",
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
   "ramps_to_add": 7,
   "note": "The guide lists 8 ramps but its own solution only uses 7; Kimia decided to give 7."
  },
  {
   "id": 5,
   "name": "Challenge 3: Ignition",
   "guide_page": 9,
   "goal_text": "Release one blue ball and then all of the red balls.",
   "goal_rule": "one_blue_then_all_red",
   "balls": {
    "blue": 8,
    "red": 8
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
   "goal_text": "Release one blue ball and then all of the red balls.",
   "goal_rule": "one_blue_then_all_red",
   "balls": {
    "blue": 8,
    "red": 8
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
  }
 ]
};
