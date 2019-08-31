import { functions as nightFunctions } from "./nightevents.service";
import { functions as dayFunctions } from "./dayevents.service";

let probability_table = {
  "-5": 0.1,
  "-4": 0.15,
  "-3": 0.2,
  "-2": 0.25,
  "-1": 0.35,
  "0": 0.5,
  "1": 0.65,
  "2": 0.75,
  "3": 0.8,
  "4": 0.85,
  "5": 0.9
};

function runProbability(margin) {
  //console.log(margin);
  if (margin > 5) margin = 5;
  if (margin < -5) margin = -5;
  if (
    !!probability_table[String(margin)] &&
    Math.random() < probability_table[String(margin)]
  ) {
    //console.log("success! " + margin);
    return true;
  } else if (!!probability_table[String(margin)]) {
    //console.log("failure! " + margin);
    return false;
  } else {
    return undefined;
  }
}

export function evaluateCheck(roster, contestant, difficulty, stat) {
  let diff =
    difficulty === "easy"
      ? 3
      : difficulty === "normal"
      ? 6
      : difficulty === "hard"
      ? 9
      : -1;
  if (diff < 0) return;
  let margin = roster[contestant][stat] - diff;
  return runProbability(margin);
}

export function evaluateCombat(roster, contestants) {
  let margin =
    roster[contestants[0]].corePower - roster[contestants[1]].corePower;
  let first_wins = runProbability(margin);
  if (first_wins) return contestants[0];
  else if (!first_wins) return contestants[1];
  else return undefined;
}

export function selector(roster, param_day_label) {
  let valid = false;
  let output = undefined;

  while (!valid) {
    output = undefined;
    valid = true;

    let randContestant = Math.floor(Math.random() * roster.length);
    while (roster[randContestant].hasActed || !roster[randContestant].isAlive) {
      randContestant = Math.floor(Math.random() * roster.length);
    }
    roster[randContestant].hasActed = true;

    if (param_day_label === "Day") {
      let randEvent = Math.floor(Math.random() * dayFunctions.length);
      output = dayFunctions[randEvent](roster, randContestant);
    } else if (param_day_label === "Night") {
      let randEvent = Math.floor(Math.random() * nightFunctions.length);
      output = nightFunctions[randEvent](roster, randContestant);
    }

    if (output["text"] === undefined) {
      valid = false;
      roster[randContestant].hasActed = false;
    }
  }
  return output;
}
