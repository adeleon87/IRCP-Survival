import { Gender, Contestant } from "../beans/contestant";

let possessive = "";
let personal_subject = "";
let personal_object = "";

function formatOneByOne(text, contestant: Contestant, number) {
  if (contestant.gender === Gender.M) {
    possessive = "his";
    personal_subject = "he";
    personal_object = "him";
  } else if (contestant.gender === Gender.F) {
    possessive = "her";
    personal_subject = "she";
    personal_object = "her";
  } else if (contestant.gender === Gender.U) {
    possessive = "its";
    personal_subject = "it";
    personal_object = "it";
  } else {
    possessive = "xir";
    personal_subject = "xe";
    personal_object = "xem";
  }

  text = text.split("@name" + number).join(contestant.name);
  text = text
    .split(". @poss" + number)
    .join(". " + possessive.charAt(0).toUpperCase() + possessive.slice(1));
  text = text
    .split(". @subject" + number)
    .join(
      ". " +
        personal_subject.charAt(0).toUpperCase() +
        personal_subject.slice(1)
    );
  text = text.split("@poss" + number).join(possessive);
  text = text.split("@subject" + number).join(personal_subject);
  text = text.split("@object" + number).join(personal_object);

  return text;
}

export function format(text, contestants: Array<Contestant> | Contestant) {
  let count = 1;
  if (contestants.length > 1) {
    for (let contestant of contestants) {
      text = formatOneByOne(text, contestant, count);
      count++;
    }
  } else {
    text = formatOneByOne(text, contestants, 1);
  }
  return text;
}
