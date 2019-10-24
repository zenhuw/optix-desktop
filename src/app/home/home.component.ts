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
  sourceGpuSubscription: Subscription;
  sourceCpuSubscription: Subscription;
  gpuData: any;
  cpuData: any;
  constructor(public hardwareData: HardwareDataService) {}

  ngOnInit() {
    // gpu
    console.log(this.hardwareData.getCpuFan());
    const sourceGpu = interval(5000).pipe(
      map(() => {
        const data = this.hardwareData.getGPU();
        if (!data) {
          return null;
        }
        data[1] = JSON.stringify(data[1], null, " ");
        data[2] = JSON.stringify(data[2], null, " ");
        data[3] = JSON.stringify(data[3], null, " ");
        data[4] = JSON.stringify(data[4], null, " ");
        return data;
      })
    );
    this.sourceGpuSubscription = sourceGpu.subscribe(res => {
      if (!res) {
        return;
      }
      this.gpuData = res;
    });

    const sourceCpu = interval(5000).pipe(
      map(async () => {
        const data = await this.hardwareData.getCpu();
        return data;
      })
    );

    this.sourceCpuSubscription = sourceCpu.subscribe(res => {
      res.then(obj => {
        console.log(obj);
        this.cpuData = obj;
      });
    });
  }

  ngOnDestroy() {
    this.sourceGpuSubscription.unsubscribe();
    this.sourceCpuSubscription.unsubscribe();
  }
}
