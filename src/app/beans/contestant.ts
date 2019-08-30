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
  traits: Array<Trait>;
  relationships: Array<Object>;
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
    this.traits = json["traits"] || [];
    this.relationships = json["relationships"] || [];
    this.isAlive = true;
    this.bio = json["bio"] || "";
    this.hasActed = false;
    this.location = "";
    this.party = -1;
    this.killCount = 0;
    this.meansOfDeath = "";
  }

  kill(means: string) {
    this.isAlive = false;
    this.meansOfDeath = means;
  }
}
