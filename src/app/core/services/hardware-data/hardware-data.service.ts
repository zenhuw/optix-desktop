import { Injectable } from "@angular/core";
import { ElectronService } from "../electron/electron.service";

@Injectable({
  providedIn: "root"
})
export class HardwareDataService {
  constructor(private electronService: ElectronService) {}

  getGPU() {
    const gpu = this.electronService.edge.func({
      source: function() {
        /*
          using System.Threading.Tasks;
          using NvAPIWrapper;
          using NvAPIWrapper.Display;
          using NvAPIWrapper.GPU;
          public class Startup
          {
              public async Task<object> Invoke(object input)
              {
                  var a = PhysicalGPU.GetPhysicalGPUs();
                  object[] anArray = new object[] {a[0].FullName,
                    a[0].BaseClockFrequencies,a[0].CurrentClockFrequencies,a[0].CoolerInformation.Coolers,
                    a[0].ThermalInformation.ThermalSensors };
                  return anArray;
              }
          }*/
      },
      references: [`src/assets/NvAPIWrapper.dll`]
    });
    return gpu(null, true);
  }
}
