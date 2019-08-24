import { Component, OnInit } from "@angular/core";
import { simulation } from "../../services/simulator.service";
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
  day_num;
  is_day;

  ngOnInit() {
    console.log("init");
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
    if (this.output.length === 2) {
      this.running = false;
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
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }
}
