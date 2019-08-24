import { Contestant } from "../beans/contestant";
import { daySelector } from "../services/events/dayevents.service";
import { nightSelector } from "../services/events/nightevents.service";

let output = [];
export let roster: Array<Contestant>;

function countRemainingAlive(roster) {
  let alive = 0;
  roster.forEach(element => {
    if (element.isAlive) alive++;
  });
  return alive;
}

export function countRemainingPending(roster) {
  let unacted = 0;
  roster.forEach(element => {
    if (element.isAlive && !element.hasActed) unacted++;
  });
  return unacted;
}

function findWinner(roster) {
  let name = "";
  roster.forEach(element => {
    if (element.isAlive) {
      name = element.name;
    }
  });
  return name;
}

export function pullRandomContestantIndex(roster) {
  while (true) {
    let rand = Math.floor(Math.random() * roster.length);
    if (roster[rand].isAlive && !roster[rand].hasActed) {
      return rand;
    }
  }
}

export function simulation(param_roster: Array<Contestant>, day_num, is_day) {
  roster = param_roster;
  output = [];

  if (day_num <= 0) {
    output = output.concat({
      text: "Your Roster:\n",
      img: []
    });
    for (let contestant of roster) {
      output = output.concat({
        text: contestant.name + " - " + contestant.bio + "\n",
        img: [contestant.name]
      });
    }
    return output;
  }
  let day_label = is_day ? "Day" : "Night";
  output = output.concat({
    text: "=== " + day_label + ": " + day_num + " ===\n",
    img: []
  });

  if (countRemainingAlive(roster) === 1) {
    output = output.concat({
      text: findWinner(roster) + " is the winner!",
      img: [findWinner(roster)]
    });
    return output;
  }

  while (countRemainingPending(roster) > 0) {
    if (countRemainingAlive(roster) === 1) {
      break;
    }
    let results;
    if (is_day === true) {
      results = daySelector(roster);
    } else {
      results = nightSelector(roster);
    }
    output = output.concat(results);
  }

  //report all who died this turn, set all to "has not acted"
  output = output.concat({
    text: "== Death Report for " + day_label + " " + day_num + " ==\n",
    img: []
  });
  let deathcount = 0;
  for (let contestant of roster) {
    if (!contestant.isAlive && contestant.hasActed) {
      deathcount++;
      output = output.concat({
        text: contestant.name + " has died.\n",
        img: [contestant.name]
      });
    }
    contestant.hasActed = false;
  }
  if (deathcount === 0) {
    output = output.concat({
      text: "No one died.\n",
      img: []
    });
  }
  console.log(roster);
  return output;
}
