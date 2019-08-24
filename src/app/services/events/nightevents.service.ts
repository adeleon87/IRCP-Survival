import { format } from "../../services/formatter.service";
import { giveContestantTrait } from "../traithandler.service";
//
//
//
//
let numFunctions = 5;
let contestants = [];
let valid = false;

export function nightSelector(roster) {
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
        text = nightEvent1(roster);
        break;
      case 1:
        valid = true;
        text = nightEvent2(roster);
        break;
      case 2:
        valid = true;
        text = nightEvent3(roster);
        break;
      case 3:
        valid = true;
        text = nightEvent4(roster);
        break;
      case 4:
        valid = true;
        text = nightEvent5(roster);
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
function nightEvent1(roster) {
  roster[contestants[0]].hasActed = true;
  return format("@name1 sleeps soundly.", roster[contestants[0]]);
}

// kill event
function nightEvent2(roster) {
  roster[contestants[0]].hasActed = true;
  roster[contestants[0]].isAlive = false;
  return format("@name1 is mauled by lions!", roster[contestants[0]]);
}

// basic event
function nightEvent3(roster) {
  roster[contestants[0]].hasActed = true;
  return format("@name1 is unable to sleep.", roster[contestants[0]]);
}

// event with trait conditionals, kill potential
function nightEvent4(roster) {
  valid = false;
  return "";
  /*roster[contestants[0]].hasActed = true;
  let text = "@name1 is about to be killed by God. ";
  if (roster[contestants[0]].traits.indexOf(0) > -1) {
    text +=
      "God cannot kill @object1 because @subject1 has the trait 'I Always Win.'";
  } else {
    roster[contestants[0]].isAlive = false;
    text += "@subject1, with no way to handle this, is smote!";
  }
  return format(text, roster[contestants[0]]);*/
}

function nightEvent5(roster) {
  roster[contestants[0]].hasActed = true;
  let text = "@name1 is putting down @poss1 sleeping bag. ";
  if (roster[contestants[0]].coreSurvival >= 7) {
    if (giveContestantTrait(roster, contestants[0], 2)) {
      text +=
        "@subject1 finds a quiet cave, along with a magical crown, and gets some restful sleep. ";
      text +=
        "@name1's Social goes from " +
        (roster[contestants[0]].coreSocial - 1) +
        " to " +
        roster[contestants[0]].coreSocial;
    } else {
      text +=
        "@subject1 finds a place @subject1'd slept in before, and rekindles the campfire.";
    }
  } else if (roster[contestants[0]].coreSurvival >= 4) {
    text += "@subject1 manages to find somewhere safe to sleep. For tonight.";
  } else {
    roster[contestants[0]].isAlive = false;
    text +=
      "@subject1 accidentally enters a bear den, and is eviserated by an angry mother bear!";
  }
  return format(text, roster[contestants[0]]);
}
