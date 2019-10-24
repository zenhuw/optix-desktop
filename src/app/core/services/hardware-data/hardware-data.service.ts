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
          using System;
          using System.Threading.Tasks;
          using NvAPIWrapper;
          using NvAPIWrapper.Display;
          using NvAPIWrapper.GPU;
          public class Startup
          {
              public async Task<object> Invoke(object input)
              {
                  try{
                    var a = PhysicalGPU.GetPhysicalGPUs();
                    object[] anArray = new object[] {a[0].FullName,
                    a[0].BaseClockFrequencies,a[0].CurrentClockFrequencies,a[0].CoolerInformation.Coolers,
                    a[0].ThermalInformation.ThermalSensors };
                    return anArray;
                  }
                  catch(Exception e)
                  {
                    return null;
                  }
              }
          }*/
      },
      references: [`src/assets/NvAPIWrapper.dll`]
    });
    return gpu(null, true);
  }

  getCpuFan() {
    const fan = this.electronService.edge.func({
      source: function() {
        /*
          using System;
          using System.Threading.Tasks;
          using HardwareProviders;
          using HardwareProviders.Board;
          using HardwareProviders.CPU;
          using System.Threading.Tasks;
          public class Startup
          {
              public async Task<object> Invoke(object input)
              {
                  try{
                    var cpu = Cpu.Discover();
                    return cpu;
                  }
                  catch(Exception e)
                  {
                    return null;
                  }
              }
          }*/
      },
      references: [
        `src/assets/HardwareProviders.dll`,
        `src/assets/HardwareProviders.CPU.dll`,
        `src/assets/HardwareProviders.Board.dll`
      ]
    });
    return fan(null, true);
  }

  async getCpu() {
    const cpuInfo = await this.electronService.si.cpu();
    const cpuSpeed = await this.electronService.si.cpuCurrentspeed();
    const cpuTemp = await this.electronService.si.cpuTemperature();
    const cpuLoad = await this.electronService.si.currentLoad();

    return {
      cpuSpeed: cpuSpeed,
      cpuTemp: cpuTemp,
      cpuInfo: cpuInfo,
      cpuLoad: cpuLoad
    };
  }
}
