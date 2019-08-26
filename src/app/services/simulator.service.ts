import { Contestant } from "../beans/contestant";
import { selector } from "../services/events/eventmaster.service";

let output = [];
export let roster: Array<Contestant>;
export let death_tracker = [];
let day_num: number;
let day_label: string;

function countRemainingAlive(roster) {
  let alive = 0;
  roster.forEach(contestant => {
    if (contestant.isAlive) alive++;
  });
  return alive;
}

export function countRemainingPending(roster) {
  let unacted = 0;
  roster.forEach(contestant => {
    if (contestant.isAlive && !contestant.hasActed) unacted++;
  });
  return unacted;
}

function findWinner(roster) {
  let name = "";
  for (let i = 0; i < roster.length; i++) {
    if (roster[i].isAlive) {
      name = roster[i].name;
      roster[i].meansOfDeath = "survived!";
      death_tracker.push(i);
    }
  }
  return name;
}

export function killContestant(roster, contestant, means) {
  death_tracker.push(contestant);
  roster[contestant].kill(means + " on " + day_label + " " + day_num + ".");
}

export function pullRandomContestantIndex(roster) {
  while (true) {
    let rand = Math.floor(Math.random() * roster.length);
    if (roster[rand].isAlive && !roster[rand].hasActed) {
      return rand;
    }
  }
}

function preGame() {
  death_tracker = [];
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
}

function deathRecap() {
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
}

export function simulation(
  param_roster: Array<Contestant>,
  param_day_num,
  is_day
) {
  roster = param_roster;
  output = [];
  day_num = param_day_num;

  if (day_num <= 0) {
    preGame();
    return output;
  }

  day_num = param_day_num;
  day_label = is_day ? "Day" : "Night";

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
    let results = selector(roster, day_label);
    output = output.concat(results);
  }

  //report all who died this turn, set all to "has not acted"
  output = output.concat({
    text: "== Death Report for " + day_label + " " + day_num + " ==\n",
    img: []
  });
  deathRecap();

  //console.log(roster);
  return output;
}
