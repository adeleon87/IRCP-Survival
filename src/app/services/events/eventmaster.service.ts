import { functions as nightFunctions } from "./nightevents.service";
import { functions as dayFunctions } from "./dayevents.service";
import {
  countRemainingPending,
  pullRandomContestantIndex
} from "../simulator.service";

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

let social_probability_table = {
  "-5": [0.1, 0.25],
  "-4": [0.1, 0.4],
  "-3": [0.15, 0.5],
  "-2": [0.25, 0.65],
  "-1": [0.3, 0.75],
  "0": [0.35, 0.8],
  "1": [0.4, 0.85],
  "2": [0.45, 0.85],
  "3": [0.5, 0.85],
  "4": [0.6, 0.9],
  "5": [0.75, 0.9]
};

function runProbability(margin) {
  //console.log(margin);
  if (margin > 5) margin = 5;
  if (margin < -5) margin = -5;
  let str_mgn = String(margin);
  if (
    !!probability_table[str_mgn] &&
    Math.random() < probability_table[str_mgn]
  ) {
    //console.log("success! " + margin);
    return true;
  } else if (!!probability_table[str_mgn]) {
    //console.log("failure! " + margin);
    return false;
  } else {
    return undefined;
  }
}

function runSocialProbability(margin) {
  let rand_num = Math.random();
  if (margin > 5) margin = 5;
  if (margin < -5) margin = -5;
  let str_mgn = String(margin);
  if (
    !!social_probability_table[str_mgn] &&
    rand_num < social_probability_table[str_mgn][0]
  ) {
    return 1;
  } else if (
    !!social_probability_table[str_mgn] &&
    rand_num < social_probability_table[str_mgn][1]
  ) {
    return 0;
  } else if (!!social_probability_table[str_mgn]) {
    return -1;
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
      : 0;
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

export function evaluateSocial(roster, contestants, is_combat_check) {
  if (roster[contestants[0]]["relationships"][contestants[1]] === undefined) {
    roster[contestants[0]]["relationships"][contestants[1]] = 0;
  }
  if (roster[contestants[1]]["relationships"][contestants[0]] === undefined) {
    roster[contestants[1]]["relationships"][contestants[0]] = 0;
  }
  let margin = Math.ceil(
    (roster[contestants[0]]["relationships"][contestants[1]] +
      roster[contestants[1]]["relationships"][contestants[0]]) /
      2
  );
  if (is_combat_check) {
    margin *= -1;
    return runProbability(margin);
  } else {
    return runSocialProbability(margin);
  }
}

function evaluatePreconditons(roster, contestants, preconditions) {
  for (let index in preconditions) {
    if (preconditions[index].startsWith("num-contestants: ")) {
      let num = Number(preconditions[index].substr(17));
      if (countRemainingPending(roster) < num - 1) return false;
      else {
        for (let i = 1; i < num; i++) {
          contestants.push(pullRandomContestantIndex(roster));
          roster[contestants[i]].hasActed = true;
        }
      }
    } else if (preconditions[index] === "check-social-combat") {
      if (!evaluateSocial(roster, contestants, true)) return false;
    }
  }
  return true;
}

export function selector(roster, param_day_label) {
  let valid = false;
  let output = undefined;
  let randContestants = [];

  while (!valid) {
    do {
      randContestants[0] = Math.floor(Math.random() * roster.length);
    } while (
      roster[randContestants[0]].hasActed ||
      !roster[randContestants[0]].isAlive
    );
    roster[randContestants[0]].hasActed = true;

    if (param_day_label === "Day") {
      let randEvent = Math.floor(Math.random() * dayFunctions.length);
      if (dayFunctions[randEvent]["preconditions"].length > 0) {
        if (
          !evaluatePreconditons(
            roster,
            randContestants,
            dayFunctions[randEvent]["preconditions"]
          )
        ) {
          for (let index of randContestants) {
            roster[index].hasActed = false;
          }
          continue;
        }
      }
      valid = true;
      for (let index of randContestants) {
        roster[index].hasActed = true;
      }
      output = dayFunctions[randEvent]["function"](roster, randContestants);
    } else if (param_day_label === "Night") {
      let randEvent = Math.floor(Math.random() * nightFunctions.length);
      if (nightFunctions[randEvent]["preconditions"].length > 0) {
        if (
          !evaluatePreconditons(
            roster,
            randContestants,
            nightFunctions[randEvent]["preconditions"]
          )
        ) {
          for (let index of randContestants) {
            roster[index].hasActed = false;
          }
          continue;
        }
      }
      valid = true;
      output = nightFunctions[randEvent]["function"](roster, randContestants);
    }
  }
  return output;
}
