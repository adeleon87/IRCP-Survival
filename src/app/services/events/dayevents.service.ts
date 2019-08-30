import { format } from "../../services/formatter.service";
import {
  countRemainingPending,
  pullRandomContestantIndex,
  killContestant
} from "../../services/simulator.service";
import {
  giveContestantTrait,
  findTraitsByPropertyFamily
} from "../traithandler.service";
import { evaluateCheck } from "./eventmaster.service";

export let functions = [dayEvent1, dayEvent3, dayEvent4, dayEvent5, dayEvent6];

// basic event
function dayEvent1(roster, contestant) {
  return format("@name1 picks flowers.", roster[contestant]);
}

// kill event
function dayEvent2(roster, contestant) {
  killContestant(roster, contestant, "unexpectedly blew up");
  return format("@name1 blows up!", roster[contestant]);
}

// basic event
function dayEvent3(roster, contestant) {
  return format("@name1 wanders around.", roster[contestant]);
}

// basic event with core stat conditionals, kill potential
function dayEvent4(roster, contestant) {
  let text = "@name1 gets trapped in a random cave-in while looking for loot. ";
  if (evaluateCheck(roster, contestant, "normal", "coreSurvival")) {
    if (giveContestantTrait(roster, contestant, 3)) {
      text +=
        "@subject1 easily moves the rubble out of the way, finding a forgotten fishing net. ";
      text +=
        "@name1's Survival goes from " +
        (roster[contestant].coreSurvival - 1) +
        " to " +
        roster[contestant].coreSurvival;
    } else {
      text +=
        "@subject1 easily moves the rubble out of the way, grumbling about the lack of loot.";
    }
  } else if (evaluateCheck(roster, contestant, "easy", "coreSurvival")) {
    text +=
      "@subject1 manages to escape by the skin of @poss1 teeth, having to forgo any found loot.";
  } else {
    killContestant(roster, contestant, "suffocated in a cave");
    text += "@subject1 is unable to escape, and will eventually suffocate!";
  }
  return format(text, roster[contestant]);
}

// event with multiple characters, kill event
function dayEvent5(roster, contestant) {
  if (countRemainingPending(roster) < 1) {
    return "";
  }

  let contestant_2 = pullRandomContestantIndex(roster);
  roster[contestant_2].hasActed = true;
  let text = "@name1 kills @name2 ";
  let weapons = findTraitsByPropertyFamily(roster, contestant, "weapon");
  if (weapons.length >= 1) {
    if (weapons.some(row => row.includes("weapon-gun-laser"))) {
      text += "by disintegrating @object2 with a laser gun!";
      killContestant(
        roster,
        contestant_2,
        "was disintegrated by " + roster[contestant].name
      );
    } else if (weapons.some(row => row.includes("weapon-spear"))) {
      text += "by tossing a spear through @poss2 sternum!";
      killContestant(
        roster,
        contestant_2,
        "was speared through the sternum by " + roster[contestant].name
      );
    }
  } else {
    text += "with @poss1 bare hands!";
    killContestant(
      roster,
      contestant_2,
      "was beaten down by " + roster[contestant].name
    );
  }
  roster[contestant].killCount++;
  return format(text, [roster[contestant], roster[contestant_2]]);
}

function dayEvent6(roster, contestant) {
  let text = "@name1 happens across a roving band of ancient tribal people. ";
  if (evaluateCheck(roster, contestant, "normal", "coreSocial")) {
    if (giveContestantTrait(roster, contestant, 1)) {
      text +=
        "@subject1 flags them down, and, thanks to @poss1 charm, receives a spear. ";
      text +=
        "@name1's Power goes from " +
        (roster[contestant].corePower - 1) +
        " to " +
        roster[contestant].corePower +
        ".";
    } else {
      text +=
        "The roving band recognizes @object1, and @name1 goes @poss1 own way.";
    }
  } else if (evaluateCheck(roster, contestant, "easy", "coreSocial")) {
    text +=
      "@subject1 waves at them, but they posture aggressively. @name1 opts to leave them alone.";
  } else {
    killContestant(roster, contestant, "insulted a hostile tribe");
    text +=
      "@subject1 accidentally insults them, and is speared in the noggin!";
  }
  return format(text, roster[contestant]);
}
