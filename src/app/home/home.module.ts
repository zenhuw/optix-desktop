import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";

import { HomeComponent } from "./home.component";
import { SharedModule } from "../shared/shared.module";
import { ElectronService } from "../core/services";
import { MatCardModule } from "@angular/material";

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule, MatCardModule],
  providers: [ElectronService]
})
export class HomeModule {}
