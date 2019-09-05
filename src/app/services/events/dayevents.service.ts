import { format } from "../../services/formatter.service";
import { killContestant } from "../../services/simulator.service";
import {
  giveContestantTrait,
  findTraitsByPropertyFamily
} from "../traithandler.service";
import {
  evaluateCheck,
  evaluateCombat,
  evaluateSocial
} from "./eventmaster.service";

export let functions = [
  { function: dayEvent1, preconditions: [] },
  { function: dayEvent2, preconditions: [] },
  { function: dayEvent3, preconditions: [] },
  { function: dayEvent4, preconditions: [] },
  {
    function: dayEvent5,
    preconditions: ["num-contestants: 2", "check-social-combat"]
  },
  { function: dayEvent6, preconditions: [] },
  { function: dayEvent7, preconditions: ["num-contestants: 2"] }
];

// basic event
function dayEvent1(roster, contestant_list) {
  let contestant = contestant_list[0];
  return format("@name1 picks flowers.", roster[contestant]);
}

// kill event
function dayEvent2(roster, contestant_list) {
  let contestant = contestant_list[0];
  killContestant(roster, contestant, "fell in a trap");
  return format(
    "@name1 steps in a spike trap and bleeds out!",
    roster[contestant]
  );
}

// basic event
function dayEvent3(roster, contestant_list) {
  let contestant = contestant_list[0];
  return format("@name1 wanders around.", roster[contestant]);
}

// basic event with core stat conditionals, kill potential
function dayEvent4(roster, contestant_list) {
  let contestant = contestant_list[0];
  let text = "@name1 gets trapped in a random cave-in while looking for loot. ";
  if (evaluateCheck(roster, contestant, "normal", "corePower")) {
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
  } else if (evaluateCheck(roster, contestant, "easy", "corePower")) {
    text +=
      "@subject1 manages to escape by the skin of @poss1 teeth, having to forgo any found loot.";
  } else {
    killContestant(roster, contestant, "suffocated in a cave");
    text += "@subject1 is unable to escape, and will eventually suffocate!";
  }
  return format(text, roster[contestant]);
}

// event with multiple characters, kill event
function dayEvent5(roster, contestant_list) {
  let killer = evaluateCombat(roster, [contestant_list[0], contestant_list[1]]);
  let killed =
    killer === contestant_list[0] ? contestant_list[1] : contestant_list[0];

  let text =
    "@name1 and @name2 meet each other in a clearing. @name1 then kills @name2 ";
  let weapons = findTraitsByPropertyFamily(roster, killer, "weapon");
  if (weapons.length >= 1) {
    if (weapons.some(row => row.includes("weapon-gun-laser"))) {
      text += "by disintegrating @object2 with a laser gun!";
      killContestant(
        roster,
        killed,
        "was disintegrated by " + roster[killer].name
      );
    } else if (weapons.some(row => row.includes("weapon-spear"))) {
      text += "by tossing a spear through @poss2 sternum!";
      killContestant(
        roster,
        killed,
        "was speared through the sternum by " + roster[killer].name
      );
    }
  } else {
    text += "with @poss1 bare hands!";
    killContestant(roster, killed, "was beaten down by " + roster[killer].name);
  }
  roster[killer].killCount++;
  return format(text, [roster[killer], roster[killed]]);
}

function dayEvent6(roster, contestant_list) {
  let contestant = contestant_list[0];
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

function dayEvent7(roster, contestant_list) {
  let contestant = contestant_list[0];
  let contestant_2 = contestant_list[1];

  let text = "@name1 gets in trouble with some of the local wildlife. ";
  if (evaluateSocial(roster, [contestant, contestant_2], false) === 1) {
    text +=
      "@name2 arrives and helps @object1 with fending them off. The two of them part amicably, their Relationship increasing by 2.";
    roster[contestant].modifyRelationship(contestant_2, +2);
    roster[contestant_2].modifyRelationship(contestant, +2);
  } else {
    text +=
      "@name2, seeing @object1 struggling, leaves @object1 to handle it themselves.";
  }
  return format(text, [roster[contestant], roster[contestant_2]]);
}
