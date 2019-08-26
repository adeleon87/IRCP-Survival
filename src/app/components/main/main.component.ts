import { Component, OnInit } from "@angular/core";
import { simulation, death_tracker } from "../../services/simulator.service";
import { getRoster } from "../../services/roster.service";

@Component({
  selector: "main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  output = [];
  roster = [];
  running = false;
  day_num = 0;
  is_day = false;
  show_result = false;

  ngOnInit() {
    console.log("init");
  }

  endRecap() {
    this.output = [];
    this.output.push({ img: "", text: "== Game Recap: ==" });
    for (let i = 0; i < this.roster.length; i++) {
      this.output.push({
        img: [this.roster[death_tracker[i]]["name"]],
        text:
          this.roster.length -
          i +
          ": " +
          this.roster[death_tracker[i]]["name"] +
          " killed " +
          this.roster[death_tracker[i]]["killCount"] +
          " contestant(s) and " +
          this.roster[death_tracker[i]]["meansOfDeath"]
      });
    }
  }

  run() {
    this.roster = getRoster();
    this.output = [];
    this.day_num = 0;
    this.is_day = false;
    this.running = true;
    this.output = simulation(this.roster, this.day_num, this.is_day);
  }

  advance() {
    if (this.show_result && this.output.length === 2) {
      this.endRecap();
      return;
    } else if (this.show_result) {
      // end recap already shown, reset to beginning
      this.running = false;
      this.show_result = false;
      return;
    }

    if (!this.is_day) {
      this.day_num++;
      this.is_day = true;
    } else {
      this.is_day = false;
    }
    this.output = simulation(this.roster, this.day_num, this.is_day);

    (function smoothscroll() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 1.5);
      }
    })();

    if (this.output.length === 2) {
      this.show_result = true;
    }
  }
}
