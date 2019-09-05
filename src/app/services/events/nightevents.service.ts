import { format } from "../../services/formatter.service";
import {
  giveContestantTrait,
  findTraitsByPropertyFamily
} from "../traithandler.service";
import {
  killContestant,
  pullRandomContestantIndex
} from "../simulator.service";
import {
  evaluateCheck,
  evaluateCombat,
  evaluateSocial
} from "./eventmaster.service";
//
//
export let functions = [
  { function: nightEvent1, preconditions: [] },
  { function: nightEvent2, preconditions: ["num-contestants: 2"] },
  { function: nightEvent3, preconditions: [] },
  { function: nightEvent4, preconditions: [] },
  { function: nightEvent5, preconditions: [] },
  { function: nightEvent6, preconditions: ["num-contestants: 2"] }
];

// basic event
function nightEvent1(roster, contestant) {
  return format("@name1 sleeps soundly.", roster[contestant]);
}

// kill event
function nightEvent2(roster, contestant) {
  let contestant_2 = pullRandomContestantIndex(roster);
  roster[contestant_2].hasActed = true;
  let killer = evaluateCombat(roster, [contestant, contestant_2]);
  let killed = killer === contestant ? contestant_2 : contestant;
  let text =
    "@name1 and @name2 cross paths while wandering in the night. @name1 suddenly ";
  let weapons = findTraitsByPropertyFamily(roster, killer, "weapon");
  if (weapons.length >= 1) {
    if (weapons.some(row => row.includes("weapon-gun-laser"))) {
      text += "unholsters their laser pistol and turns @name2 to dust!";
      killContestant(roster, killed, "was evaporated " + roster[killer].name);
    } else if (weapons.some(row => row.includes("weapon-spear"))) {
      text += "grabs @poss1 spear and chucks it into @name2's neck!";
      killContestant(
        roster,
        killed,
        "was speared in the neck by " + roster[killer].name
      );
    }
  } else {
    text += "charges at @name2, beating @object2 into the ground!";
    killContestant(roster, killed, "was beaten down by " + roster[killer].name);
  }
  roster[killer].killCount++;
  return format(text, [roster[killer], roster[killed]]);
}

// basic event
function nightEvent3(roster, contestant) {
  return format("@name1 is unable to sleep.", roster[contestant]);
}

// event with trait conditionals, kill potential
function nightEvent4(roster, contestant) {
  let text =
    "@name1, while searching for a safe place to sleep, finds an abandoned mech. ";
  if (evaluateCheck(roster, contestant, "normal", "coreWits")) {
    if (giveContestantTrait(roster, contestant, 4)) {
      text +=
        "@subject1 realizes the mech is beyond repair, but finds a laser pistol in a secret compartment. ";
      text +=
        "@name1's Power goes from " +
        (roster[contestant].corePower - 2) +
        " to " +
        roster[contestant].corePower;
    } else {
      text +=
        "@subject1 knows this is the same mech which @subject1 couldn't repair, and sleeps the night away in the cockpit.";
    }
  } else if (evaluateCheck(roster, contestant, "easy", "coreWits")) {
    text +=
      "@subject1 can't figure out the controls, but at least avoids the security system long enough to have a safe place to sleep.";
  } else {
    killContestant(
      roster,
      contestant,
      "obliterated by a once-dormant security system"
    );
    text +=
      "@subject1 unknowingly triggers the alarm, and is disintegrated by a sentry gun!";
  }
  return format(text, roster[contestant]);
}

function nightEvent5(roster, contestant) {
  let text = "@name1 searches for a place to put @poss1 sleeping bag down. ";
  if (evaluateCheck(roster, contestant, "normal", "coreSurvival")) {
    if (giveContestantTrait(roster, contestant, 2)) {
      text +=
        "@subject1 finds a quiet cave, along with a magical crown, and gets some restful sleep. ";
      text +=
        "@name1's Social goes from " +
        (roster[contestant].coreSocial - 1) +
        " to " +
        roster[contestant].coreSocial;
    } else {
      text +=
        "@subject1 finds a place @subject1'd slept in before, and rekindles the campfire.";
    }
  } else if (evaluateCheck(roster, contestant, "easy", "coreSurvival")) {
    text += "@subject1 manages to find somewhere safe to sleep. For tonight.";
  } else {
    killContestant(roster, contestant, "tresspassed in a bear den");
    text +=
      "@subject1 accidentally enters a bear den, and is eviserated by an angry mother bear!";
  }
  return format(text, roster[contestant]);
}

function nightEvent6(roster, contestant) {
  let contestant_2 = pullRandomContestantIndex(roster);
  roster[contestant_2].hasActed = true;

  let text =
    "@name1 and @name2, both exhausted, wander into the same abandoned home. ";
  let social_result = evaluateSocial(roster, [contestant, contestant_2], false);

  if (social_result === -1) {
    text +=
      "The two get into a heated argument over who gets to stay, and end up attracting some hostile wildlife. They flee the home. Their Relationship is decreased by 1.";
    roster[contestant].modifyRelationship(contestant_2, -1);
    roster[contestant_2].modifyRelationship(contestant, -1);
  } else if (social_result === 0) {
    text +=
      "The two, wary of each other, agree to sleep in the same building, but neither can trust the other enough to get any restful sleep.";
  } else if (social_result === 1) {
    text +=
      "The two agree to share the shelter, and get restful sleep. Their Relationship is increased by 1.";
    roster[contestant].modifyRelationship(contestant_2, 1);
    roster[contestant_2].modifyRelationship(contestant, 1);
  }
  return format(text, [roster[contestant], roster[contestant_2]]);
}
