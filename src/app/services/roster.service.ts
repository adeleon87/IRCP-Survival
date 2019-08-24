import { Contestant } from "../beans/contestant";
import * as src_json from "../../assets/roster.json";

function parseJSON(json) {
  let roster = [];
  for (let contestant of json) {
    let to_add = new Contestant(contestant);
    roster.push(to_add);
  }
  return roster;
}

export function getRoster() {
  let json = src_json;
  let roster = parseJSON(json);
  roster.forEach(contestant => {
    contestant.isAlive = true;
    contestant.traits = [];
  });
  return roster;
}
