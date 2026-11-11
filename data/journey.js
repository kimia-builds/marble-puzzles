// The journey: every page, in order. All words and codes live here, never in the game code.
//
// Page kinds:
//   story  - a page of story with no code. Next is on straight away. (Not used at the moment.)
//   puzzle - one puzzle from data/puzzles.js (by its id). Must be solved to go on.
//   clue   - one part of the story, then a question (the "clue") and a code box.
//            The answer to the question is the code; the right code opens the next page (that part's stage).
//            Part 1 opens the journey. Parts 2-6 sit on the "Stage done!" page of the stage before.
//   final  - the last page (Part 7).
//
// Codes are stored scrambled ("code_hash"), so they can't be read in the page source.
// To make a hash for a new code, open the page and type in the browser console:
//   JOURNEY_CORE.hash("YOURCODE")
// "code_letters" is how many letters the code has, word by word: [7] is one 7-letter word,
// [4, 11] is a 4-letter word, a gap, then an 11-letter word. The page draws one box per letter
// (like Hangman), so the number of boxes is an extra clue.
//
// The story is Alia's Story Beats (seven parts). Part N goes with stage N; Part 7 is the final page.
// The codes themselves are deliberately not written here.
window.JOURNEY = {
  title: "Marble Puzzles",
  pages: [
    { kind: "clue", stage: 1, heading: "Part 1: Ana and Alia",
      text: [
        "Back in Imperium, way before the Merge, Sora used to be called Ana. Ana's favourite class in school was always coding. Her coding teacher would give out whiteboards with green gears and blue and red marbles, for them to use to solve coding puzzles.",
        "One day, Ana was in Coding class, and she got paired with a girl called Alia. Ana and Alia were both very talented at technology and maths, so they made a great team.",
        "At the back of the class, another girl was sitting and watching them, fuming with jealousy. Why did Ana and Alia have to be so good at the board puzzles? Maybe if she got close enough, she could copy their answers..."
      ],
      clue: "Who do you think was watching Alia and Ana from the back of the class? Here's a clue: her name begins with a \"J\". Do you remember? She's quite forgettable...",
      code_letters: [7], code_hash: "ohfuox699t" },

    { kind: "puzzle", stage: 1, puzzle: 1 },

    { kind: "clue", stage: 1, heading: "Stage 1 done!",
      story_heading: "Part 2: After the Merge",
      text: [
        "Many years later, Ana is now Sora, and, well... you already know what happened to Sora. But what about Alia?",
        "The thing about talented technologists is that evil people are constantly looking for ways to exploit their talents for their own evil purposes! And that's how Alia ended up working for the Administration.",
        "Alia was hired by the Technology department, where she worked on one of her special interests: AI robots. She built some pretty awesome robots, but then she realised - oh no! These robots are evil!"
      ],
      clue: "Three of these robots were trying to hunt our Ninja friends in the Administration until Nya put them into Fake-cation, but... what were those robots called?",
      code_letters: [4, 11], code_hash: "3km9llfaqu" },

    { kind: "puzzle", stage: 2, puzzle: 2 },
    { kind: "puzzle", stage: 2, puzzle: 3 },

    { kind: "clue", stage: 2, heading: "Stage 2 done!",
      story_heading: "Part 3: Doubts",
      text: [
        "Alia does not enjoy working for the Administration. Those evil robots almost tried to eliminate our beloved Ninjas! And anyway, Alia has always been passionate about something else.",
        "Maybe she could be a ninja, like Sora?",
        "Being a ninja is cool, but Alia really loves science and technology. When she is building tech products, it feels like she's using the source energy of dragons to create magic! (Except that she's coding.)",
        "For example, did you know that an \"aft-thruster\" is the engine at the bottom of a spaceship that propels it forward! And did you know that the energy that makes comets fly at such high speed is just gravity?"
      ],
      clue: "In the old episodes of Ninjago, there was a comet with a cool name. I'll give you a clue, it rhymes with \"smelled a bee\"...",
      code_letters: [5, 1], code_hash: "6j28g4x0xf" },

    { kind: "puzzle", stage: 3, puzzle: 4 },
    { kind: "puzzle", stage: 3, puzzle: 5 },

    { kind: "clue", stage: 3, heading: "Stage 3 done!",
      story_heading: "Part 4: Deep Space Industry",
      text: [
        "It took a lot of hard work and determination, but Alia finally managed to quit her job at the Administration and move into a much cooler job in the Deep Space Industry.",
        "Every day she learns something new. For example, space radiation is so dangerous, we must always have a radiation shield to protect us when we travel in space. If the radiation shield gets compromised, then things could go very wrong!",
        "So Alia and her colleagues work hard to make sure that inter-realm travel through space happens as safely as possible. Sometimes, people even communicate with each other in different realms, using space satellites.",
        "Wait, what's that? There seems to be a message incoming from an AI somewhere in the universe, through a communication satellite. It's crackly, but it's clear:",
        "\"We are compatible.\""
      ],
      clue: "Who is this message from?",
      code_letters: [5], code_hash: "2anis6fitaw" },

    { kind: "puzzle", stage: 4, puzzle: 6 },
    { kind: "puzzle", stage: 4, puzzle: 7 },

    { kind: "clue", stage: 4, heading: "Stage 4 done!",
      story_heading: "Part 5: R.E.N.",
      text: [
        "After receiving the message from P.I.X.A.L. and hearing about the love between her and Zane, Alia was quite moved. Technology really is amazing, and not all A.I. robots she builds in her life need to be evil like the Robo Eliminators in the Administration. Perhaps she could try again?",
        "Alia gets to work. Over at the Deep Space Industry, she starts coding the brain of a little AI robo-companion whom she will name R.E.N.",
        "R.E.N. will be a special space robot that will need no helmet to survive in space. Alia begins uploading all the information the robot will need to survive. For example, R.E.N. needs to know about return winches. What's that?",
        "A return winch is a cable that pulls you back to the spacecraft at high speed, like a lasso.",
        "People and ninjas may not always remember all of the words that we learn, but robots can have excellent information storage and recall capacity."
      ],
      clue: "See if you can solve this riddle: \"They snatched Jay's to make him an Administration worker, but R.E.N.'s one will be just fine... we hope!\"",
      code_letters: [6], code_hash: "x0pdtr0w3g" },

    { kind: "puzzle", stage: 5, puzzle: 8 },
    { kind: "puzzle", stage: 5, puzzle: 9 },

    { kind: "clue", stage: 5, heading: "Stage 5 done!",
      story_heading: "Part 6: Eniac",
      text: [
        "Alia is almost finished with building R.E.N. He's pretty cool actually! He can talk, walk, follow orders, and exchange pleasantries.",
        "But just as Alia was about to install a final software update to her robo-companion, the Deep Space Industry receives some bad news.",
        "There's a broken communication satellite near the planet, Eniac!"
      ],
      clue: "Eniac is an uninhabited planet with extreme temperatures, but can you figure out which kinds of temperatures we're talking? Here's a clue: the climate on Eniac is similar to that of the Never Kingdom.",
      code_letters: [8], code_hash: "fmpynnw8go" },

    { kind: "puzzle", stage: 6, puzzle: 10 },
    { kind: "puzzle", stage: 6, puzzle: 11 },

    { kind: "final", heading: "Part 7: Let's knock this one out!",
      text: [
        "There's no time to update R.E.N.'s software. Alia must get on with the space mission to fix the broken communication satellite. They get on their spaceship and travel towards the planet Eniac.",
        "\"Come on, R.E.N.\" she says, \"let's knock this one out!\"",
        "R.E.N. approaches the satellite and gives the space satellite a MASSIVE punch in the side. And another one. And again.",
        "\"Wait, R.E.N.! What are you doing?!\" Alia is panicking. The satellite looks like it might not survive after these punches to the side.",
        "\"I'm knocking the satellite out, like you asked!\" replies R.E.N. in his robotic voice.",
        "\"It's an expression, R.E.N.! It means like, let's get this over with, let's do the job, you know?\"",
        "The pair quickly try to evacuate the scene, having completely failed the mission. Not only did they not fix the satellite, they actually broke it even more.",
        "On their way home in the spaceship, Alia sighs and wonders to herself, \"Should I get rid of R.E.N.? Maybe he's too much trouble...\"",
        "Just then, R.E.N. approaches Alia, with his little robot arm out in a LEGO hand shape and says:",
        "\"Lobster high five?\"",
        "THE END",
        "(to be continued)"
      ] }
  ]
};
