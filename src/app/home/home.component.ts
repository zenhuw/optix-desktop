import { Component, OnInit, OnDestroy } from "@angular/core";
import { HardwareDataService } from "../core/services";
import { interval, Subscription } from "rxjs";
import { switchMap, map } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, OnDestroy {
  sourceSubscription: Subscription;
  gpuData: any;
  constructor(public hardwareData: HardwareDataService) {}

  ngOnInit() {
    // gpu
    const source = interval(5000).pipe(
      map(() => {
        const data = this.hardwareData.getGPU();
        data[1] = JSON.stringify(data[1], null, " ");
        data[2] = JSON.stringify(data[2], null, " ");
        data[3] = JSON.stringify(data[3], null, " ");
        data[4] = JSON.stringify(data[4], null, " ");
        return data;
      })
    );
    this.sourceSubscription = source.subscribe(res => {
      this.gpuData = res;
    });
  }

  ngOnDestroy() {
    this.sourceSubscription.unsubscribe();
  }
}
