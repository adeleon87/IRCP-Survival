import { format } from "../../services/formatter.service";
import {
  countRemainingPending,
  pullRandomContestantIndex
} from "../../services/simulator.service";
import {
  giveContestantTrait,
  findTraitsByPropertyFamily
} from "../traithandler.service";

let numFunctions = 6;
let contestants = [];
let valid = false;

export function daySelector(roster) {
  valid = false;
  let text = "";
  while (!valid) {
    contestants = [];
    text = "";

    let randEvent = Math.floor(Math.random() * numFunctions);
    let randContestant = Math.floor(Math.random() * roster.length);
    while (roster[randContestant].hasActed || !roster[randContestant].isAlive) {
      randContestant = Math.floor(Math.random() * roster.length);
    }
    contestants.push(randContestant);

    switch (randEvent) {
      case 0:
        valid = true;
        text = dayEvent1(roster);
        break;
      case 1:
        valid = true;
        text = dayEvent2(roster);
        break;
      case 2:
        valid = true;
        text = dayEvent3(roster);
        break;
      case 3:
        valid = true;
        text = dayEvent4(roster);
        break;
      case 4:
        valid = true;
        text = dayEvent5(roster);
        break;
      case 5:
        valid = true;
        text = dayEvent6(roster);
        break;
    }
  }

  let names = [];
  for (let contestant in contestants) {
    names.push(roster[contestants[contestant]].name);
  }
  return {
    text: text,
    img: names
  };
}

// basic event
function dayEvent1(roster) {
  roster[contestants[0]].hasActed = true;
  return format("@name1 picks flowers.", roster[contestants[0]]);
}

// kill event
function dayEvent2(roster) {
  roster[contestants[0]].hasActed = true;
  roster[contestants[0]].isAlive = false;
  return format("@name1 blows up!", roster[contestants[0]]);
}

// basic event
function dayEvent3(roster) {
  roster[contestants[0]].hasActed = true;
  return format("@name1 wanders around.", roster[contestants[0]]);
}

// basic event with core stat conditionals, kill potential
function dayEvent4(roster) {
  roster[contestants[0]].hasActed = true;
  let text = "@name1 gets trapped in a random cave-in while looking for loot. ";
  if (roster[contestants[0]].corePower >= 7) {
    if (giveContestantTrait(roster, contestants[0], 3)) {
      text +=
        "@subject1 easily moves the rubble out of the way, finding a forgotten fishing net. ";
      text +=
        "@name1's Survival goes from " +
        (roster[contestants[0]].coreSurvival - 1) +
        " to " +
        roster[contestants[0]].coreSurvival;
    } else {
      text +=
        "@subject1 easily moves the rubble out of the way, grumbling about the lack of loot.";
    }
  } else if (roster[contestants[0]].corePower >= 4) {
    text +=
      "@subject1 manages to escape by the skin of @poss1 teeth, having to forgo any found loot.";
  } else {
    roster[contestants[0]].isAlive = false;
    text += "@subject1 is unable to escape, and will eventually suffocate!";
  }
  return format(text, roster[contestants[0]]);
}

// event with multiple characters, kill event
function dayEvent5(roster) {
  if (countRemainingPending(roster) < 2) {
    valid = false;
    return "";
  }
  roster[contestants[0]].hasActed = true;
  contestants.push(pullRandomContestantIndex(roster));
  roster[contestants[1]].hasActed = true;
  roster[contestants[1]].isAlive = false;
  let text = "@name1 kills @name2 ";
  let weapons = findTraitsByPropertyFamily(roster, contestants[0], "weapon");
  if (weapons.length >= 1) {
    if (weapons[0].includes("weapon-spear")) {
      text += "by tossing a spear through @poss2 sternum!";
    }
  } else {
    text += "with @poss1 bare hands!";
  }
  return format(text, [roster[contestants[0]], roster[contestants[1]]]);
}

function dayEvent6(roster) {
  roster[contestants[0]].hasActed = true;
  let text = "@name1 happens across a roving band of ancient tribal people. ";
  if (roster[contestants[0]].coreSocial >= 7) {
    if (giveContestantTrait(roster, contestants[0], 1)) {
      text +=
        "@subject1 flags them down, and, thanks to @poss1 charm, receives a spear. ";
      text +=
        "@name1's Power goes from " +
        (roster[contestants[0]].corePower - 1) +
        " to " +
        roster[contestants[0]].corePower +
        ".";
    } else {
      text +=
        "The roving band recognizes @object1, and @name1 goes @poss1 own way.";
    }
  } else if (roster[contestants[0]].coreSocial >= 4) {
    text +=
      "@subject1 waves at them, but they posture aggressively. @name1 opts to leave them alone.";
  } else {
    roster[contestants[0]].isAlive = false;
    text +=
      "@subject1 accidentally insults them, and is speared in the noggin!";
  }
  return format(text, roster[contestants[0]]);
}
