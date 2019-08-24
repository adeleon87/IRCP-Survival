export class Trait {
  id: number;
  name: string;
  type: string;
  properties: Array<string>;
  short_text: string;
  long_text: string;

  constructor(json?: string) {
    this.id = json["id"] || "";
    this.name = json["name"] || "";
    this.type = json["type"] || "";
    this.properties = json["properties"] || [];
    this.short_text = json["short_text"] || "";
    this.long_text = json["long_text"] || "";
  }
}
