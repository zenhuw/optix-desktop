import { Component, OnInit, OnDestroy, ɵConsole } from "@angular/core";
import { HardwareDataService } from "../core/services";
import { interval, Subscription, of, Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { HardwareSyncService } from "../core/services";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, OnDestroy {
  sourceGpuSubscription: Subscription;
  sourceCpuSubscription: Subscription;
  sourceRamSubscription: Subscription;
  sourceDiskSubscription: Subscription;
  syncSubscription: Subscription;
  gpuData: any;
  cpuData: any;
  cpuMainBoard: any;
  ramData: any;
  diskData: any;
  checkoutForm: FormGroup;
  loading = false;
  constructor(
    public hardwareData: HardwareDataService,
    private formBuilder: FormBuilder,
    public auth: AngularFireAuth,
    public hardwareSync: HardwareSyncService
  ) {
    this.checkoutForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.auth.auth.signOut().then(res => {});
    // gpu
    // console.log(this.hardwareData.getCpuFan());
    const sourceGpu = interval(5000).pipe(
      map(() => {
        // console.log(this.hardwareData.getCpuFan());
        // this.hardwareData.getCpu().then(res => console.log(res));
        // this.hardwareData.getDisk().then(res => console.log(res));

        const data = this.hardwareData.getGPU();
        // console.log(data);
        if (!data || data.status === "Error") {
          return null;
        }
        data[1] = JSON.stringify(data[1], null, " ");
        data[2] = JSON.stringify(data[2], null, " ");
        data[3] = JSON.stringify(data[3], null, " ");
        data[4] = JSON.stringify(data[4], null, " ");
        data[5] = JSON.stringify(data[5], null, " ");
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
        const data = this.hardwareData.getCpuFan();
        return data;
      })
    );

    this.sourceCpuSubscription = sourceCpu.subscribe(res => {
      // console.log(res)
      res.then(obj => {
        // console.log(obj);
        this.cpuData = obj[0][0];
        this.cpuMainBoard = obj[1];
        // console.log(this.cpuMainBoard);
      });
    });
    const sourceRam = interval(5000).pipe(
      map(async () => {
        const data = await this.hardwareData.getRam();
        return data;
      })
    );

    this.sourceRamSubscription = sourceRam.subscribe(res => {
      // console.log(res)
      res.then(obj => {
        // console.log(obj);
        this.ramData = obj;
        // console.log(this.cpuData);
      });
    });

    const sourceDisk = interval(5000).pipe(
      map(async () => {
        const data = await this.hardwareData.getDisk();
        return data;
      })
    );

    this.sourceDiskSubscription = sourceDisk.subscribe(res => {
      // console.log(res)
      res.then(obj => {
        // console.log(obj);
        this.diskData = obj;
        // console.log(this.cpuData);
      });
    });
  }

  onSubmit(data) {
    this.loading = true;
    this.doLogin(data).then(
      res => {
        // console.log(res);
        this.loading = false;
        console.log("Logged In!");
        this.syncSubscription = this.auth.user
          .pipe(
            switchMap(user => {
              // console.log(user);
              if (!user) {
                return new Observable(observer => {
                  observer.next(null);
                });
              }
              return this.hardwareSync.startSync(5000, user.email);
            })
          )
          .subscribe(obj => {
            if (!obj) {
              return;
            }
          });
      },
      err => {
        // console.log(err);
        this.loading = false;
        this.checkoutForm.reset();
        this.checkoutForm.setErrors(Validators.required);
      }
    );
  }

  doLogin(data) {
    if (this.checkoutForm.invalid) {
      this.loading = false;
      return;
    }
    return this.auth.auth
      .signInWithEmailAndPassword(data.email, data.password)
      .catch(res => {
        if (res) {
          // console.log(res);
          this.loading = false;
          this.checkoutForm.reset();
          this.checkoutForm.setErrors(Validators.required);
        }
      });
  }

  signOut() {
    this.auth.auth.signOut().then(res => {});
    this.syncSubscription.unsubscribe();
  }

  ngOnDestroy() {
    this.sourceGpuSubscription.unsubscribe();
    this.sourceCpuSubscription.unsubscribe();
    this.sourceRamSubscription.unsubscribe();
    this.sourceDiskSubscription.unsubscribe();
  }
}
