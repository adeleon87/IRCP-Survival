import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { MainComponent } from "./components/main/main.component";
import { RouterModule } from "@angular/router";
import { appRoutes } from "./app.routes";

@NgModule({
  declarations: [AppComponent, MainComponent],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes, { useHash: true })],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
