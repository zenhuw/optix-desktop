import { Injectable } from "@angular/core";
import { Observable, interval } from "rxjs";
import { map } from "rxjs/operators";
import { HardwareDataService } from "../hardware-data/hardware-data.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { UtilityService } from "../utility/utility.service";

@Injectable({
  providedIn: "root"
})
export class HardwareSyncService {
  constructor(
    private hardwareData: HardwareDataService,
    private afs: AngularFirestore,
    private utility: UtilityService
  ) {}

  public startSync(freq: number, id: string): Observable<Promise<void[]>> {
    return interval(freq).pipe(
      map(async () => {
        // console.log(this.hardwareData.getCpuFan());
        // this.hardwareData.getCpu().then(res => console.log(res));
        // this.hardwareData.getDisk().then(res => console.log(res));
        const gpuData = this.utility.dropNullUndefined(this.gpuSync());
        const cpuData = this.utility.dropNullUndefined(this.cpuSync());
        let ramData = await this.ramSync();
        ramData = this.utility.dropNullUndefined(ramData);
        let diskData = await this.diskSync();
        diskData = this.utility.dropNullUndefined(diskData);
        return Promise.all([
          this.afs
            .doc(`device/${id}/gpu/current`)
            .set(gpuData, { merge: true }),
          this.afs
            .doc(`device/${id}/cpu/current`)
            .set(cpuData, { merge: true }),
          this.afs
            .doc(`device/${id}/ram/current`)
            .set(ramData, { merge: true }),
          this.afs
            .doc(`device/${id}/disk/current`)
            .set(diskData, { merge: true })
        ]);
      })
    );
  }

  private gpuSync() {
    let data = this.hardwareData.getGPU();
    if (!data || data.Status === "Error") {
      return {};
    }
    data = {
      name: data[0],
      baseClock: data[1],
      currentClock: data[2],
      cooler: data[3],
      temperature: data[4],
      usage: data[5]
    };
    return data;
  }

  private cpuSync() {
    let data = this.hardwareData.getCpuFan();
    data = {
      name: data[0][0].Name,
      currentClock: data[0][0].CoreClocks,
      temperature: data[0][0].CoreTemperatures,
      load: data[0][0].CoreLoads,
      fan: data[1].Lpcio
    };
    return data;
  }

  private async ramSync() {
    const data = await this.hardwareData.getRam();

    return data;
  }

  private async diskSync() {
    const data = await this.hardwareData.getDisk();

    return data;
  }
}
