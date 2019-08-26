import { Trait } from "../beans/trait";
import * as json from "../../assets/traitlibrary.json";
import { Contestant } from "../beans/contestant";

export function findTraitByID(id: number) {
  for (let trait in json) {
    if (json[trait]["id"] === id) {
      return new Trait(json[trait]);
    }
  }
  return undefined;
}

export function findTraitsByProperty(
  roster: Array<Contestant>,
  contestant: number,
  property: string
) {
  let traits = [];
  let trait_list = roster[contestant].traits;
  for (let trait in trait_list) {
    if (trait_list[trait]["properties"].includes(property)) {
      traits.push(trait_list[trait]);
    }
  }
  return traits;
}

export function findTraitsByPropertyFamily(
  roster: Array<Contestant>,
  contestant: number,
  propertyFamily: string
) {
  let traits = [];
  let trait_list = roster[contestant].traits;
  for (let trait in trait_list) {
    for (let property in trait_list[trait]["properties"]) {
      if (
        trait_list[trait]["properties"][property].startsWith(propertyFamily)
      ) {
        traits.push(trait_list[trait]["properties"][property]);
      }
    }
  }
  return traits;
}

export function giveContestantTrait(
  roster: Array<Contestant>,
  contestant: number,
  id: number
) {
  let trait_to_add = findTraitByID(id);

  for (let trait in roster[contestant].traits) {
    if (trait_to_add["id"] === roster[contestant].traits[trait]["id"]) {
      return false;
    }
  }
  roster[contestant].traits.push(trait_to_add);
  evaluateTrait(roster, contestant, trait_to_add, false);
  return true;
}

export function removeContestantTrait(
  roster: Array<Contestant>,
  contestant: number,
  id: number
) {
  let trait_to_remove = findTraitByID(id);
  if (roster[contestant].traits.includes(trait_to_remove)) {
    roster[contestant].traits.filter(function(value, _index, _arr) {
      return value === trait_to_remove;
    });
    evaluateTrait(roster, contestant, trait_to_remove, true);
    return true;
  } else {
    return false;
  }
}

function evaluateTrait(
  roster: Array<Contestant>,
  contestant: number,
  trait: Trait,
  remove: boolean
) {
  for (let property in trait.properties) {
    if (trait.properties[property].startsWith("core-power")) {
      let diff = Number(trait.properties[property].slice(10));
      if (remove) diff *= -1;
      roster[contestant].corePower += diff;
    } else if (trait.properties[property].startsWith("core-survival")) {
      let diff = Number(trait.properties[property].slice(13));
      if (remove) diff *= -1;
      roster[contestant].coreSurvival += diff;
    } else if (trait.properties[property].startsWith("core-social")) {
      let diff = Number(trait.properties[property].slice(11));
      if (remove) diff *= -1;
      roster[contestant].coreSocial += diff;
    }
  }
}
