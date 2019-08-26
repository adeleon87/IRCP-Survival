import { format } from "../../services/formatter.service";
import { giveContestantTrait } from "../traithandler.service";
import { killContestant } from "../simulator.service";
//
//
//
export let functions = [nightEvent1, nightEvent2, nightEvent3, nightEvent5];

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
/*function nightEvent4(roster) {
  return "";
  roster[contestants[0]].hasActed = true;
  let text = "@name1 is about to be killed by God. ";
  if (roster[contestants[0]].traits.indexOf(0) > -1) {
    text +=
      "God cannot kill @object1 because @subject1 has the trait 'I Always Win.'";
  } else {
    roster[contestants[0]].isAlive = false;
    text += "@subject1, with no way to handle this, is smote!";
  }
  return format(text, roster[contestants[0]]);
}*/

function nightEvent5(roster, contestant) {
  let text = "@name1 is putting down @poss1 sleeping bag. ";
  if (roster[contestant].coreSurvival >= 7) {
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
  } else if (roster[contestant].coreSurvival >= 4) {
    text += "@subject1 manages to find somewhere safe to sleep. For tonight.";
  } else {
    killContestant(roster, contestant, "tresspassed in a bear den");
    text +=
      "@subject1 accidentally enters a bear den, and is eviserated by an angry mother bear!";
  }
  return format(text, roster[contestant]);
}
