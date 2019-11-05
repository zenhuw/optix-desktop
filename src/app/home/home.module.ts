import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";

import { HomeComponent } from "./home.component";
import { SharedModule } from "../shared/shared.module";
import { ElectronService } from "../core/services";
import {
  MatCardModule,
  MatGridListModule,
  MatInputModule,
  MatButtonModule,
  MatSpinner,
  MatProgressSpinnerModule
} from "@angular/material";
import { UtilityService } from "../core/services/utility/utility.service";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  providers: [ElectronService, UtilityService]
})
export class HomeModule {}
