import { Trait } from "./trait";

//var core_stat_allowance = 18;

enum Orientation {
  ACE = "Asexual",
  HET = "Heterosexual",
  BI = "Bisexual",
  HOMO = "Homosexual",
  ARO = "Aromantic"
}

export enum Gender {
  M = "Male",
  F = "Female",
  U = "Ungendered",
  N = "Non-binary"
}

const archetype_library = {
  Juggernaut: ["P", "P", "P"],
  Naturalist: ["Su", "Su", "Su"],
  Icon: ["So", "So", "So"],
  Scholar: ["W", "W", "W"],
  Hunter: ["P", "P", "Su"],
  Warlord: ["P", "P", "So"],
  Monk: ["P", "P", "W"],
  Guard: ["P", "Su", "Su"],
  Hero: ["P", "So", "So"],
  Tactician: ["P", "W", "W"],
  Guide: ["Su", "Su", "So"],
  Trailblazer: ["Su", "Su", "W"],
  Rogue: ["Su", "So", "So"],
  Engineer: ["Su", "W", "W"],
  Captain: ["So", "So", "W"],
  Teacher: ["So", "W", "W"],
  Streetwise: ["P", "Su", "So"],
  Hermit: ["P", "Su", "W"],
  Privileged: ["P", "So", "W"],
  Pacifist: ["Su", "So", "W"],
  Shoemaker: [],
  Champion: ["P", "P", "P", "Su", "Su", "Su", "So", "So", "So", "W", "W", "W"]
};

export class Contestant {
  //identifying information
  name: string;
  gender: string;
  isChild: boolean;
  orientation: string;
  bio: string;

  //game information
  corePower: number;
  coreSurvival: number;
  coreSocial: number;
  coreWits: number;
  archetype: string;
  traits: Array<Trait>;
  relationships: Array<number>;
  isAlive: boolean;
  hasActed: boolean;
  location: string;
  party: number;
  killCount: number;
  meansOfDeath: string;

  constructor(json?: string) {
    this.name = json["name"] || "";
    this.gender = Gender[json["gender"]] || Gender.U;
    this.isChild = json["isChild"] || false;
    this.orientation = Orientation[json["orientation"]] || Orientation.ARO;
    this.corePower = json["corePower"] || 0;
    this.coreSurvival = json["coreSurvival"] || 0;
    this.coreSocial = json["coreSocial"] || 0;
    this.coreWits = json["coreWits"] || 0;
    this.archetype = json["archetype"] || "";
    this.traits = json["traits"] || [];
    this.relationships = json["relationships"] || [];
    this.isAlive = true;
    this.bio = json["bio"] || "";
    this.hasActed = false;
    this.location = "";
    this.party = -"P";
    this.killCount = 0;
    this.meansOfDeath = "";

    this.applyArchetype();
  }

  kill(means: string) {
    this.isAlive = false;
    this.meansOfDeath = means;
  }

  modifyRelationship(target: string, amount: number) {
    if (this.relationships[target] + amount >= 5) {
      this.relationships[target] = 5;
    } else if (this.relationships[target] + amount <= -5) {
      this.relationships[target] = -5;
    } else {
      this.relationships[target] += amount;
    }
  }

  applyArchetype() {
    if (this.archetype === "" || this.archetype === "Shoemaker") {
      return;
    }

    archetype_library[this.archetype].forEach(element => {
      if (element === "P") {
        this.corePower++;
      } else if (element === "Su") {
        this.coreSurvival++;
      } else if (element === "So") {
        this.coreSocial++;
      } else if (element === "W") {
        this.coreWits++;
      }
    });
  }
}
