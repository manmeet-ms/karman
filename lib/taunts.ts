
export const TAUNTS = [
  "Your discipline just rage-quit 💀",
  "Manmeet, was Netflix worth the shame?",
  "Honor level: -3. Try again.",
  "Oh no, another one bites the dust!",
  "Manmeet, did your motivation run out of fuel?",
  "Your discipline just filed for bankruptcy!",
  "Was that nap worth the shame?",
  "TimeBlock? More like TimeFlop.",
  "Someone's stacking violations like it's a leaderboard!",
  "Oops! You missed more than just a task today.",
];

export const getRandomTaunt = () => {
    return TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
};
