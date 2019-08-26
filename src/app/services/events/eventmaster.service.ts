import { functions as nightFunctions } from "./nightevents.service";
import { functions as dayFunctions } from "./dayevents.service";

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
