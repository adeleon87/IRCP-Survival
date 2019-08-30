import { format } from "../../services/formatter.service";
import { giveContestantTrait } from "../traithandler.service";
import { killContestant } from "../simulator.service";
import { evaluateCheck } from "./eventmaster.service";
//
//
export let functions = [nightEvent1, nightEvent3, nightEvent4, nightEvent5];

// basic event
function nightEvent1(roster, contestant) {
  return format("@name1 sleeps soundly.", roster[contestant]);
}

// kill event
function nightEvent2(roster, contestant) {
  killContestant(roster, contestant, "got mauled by lions");
  return format("@name1 is mauled by lions!", roster[contestant]);
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
