import { Injectable } from "@angular/core";
import { ElectronService } from "../electron/electron.service";
import { UtilityService } from "../utility/utility.service";

@Injectable({
  providedIn: "root"
})
export class HardwareDataService {
  constructor(
    private electronService: ElectronService,
    private utility: UtilityService
  ) {}

  getGPU(): any {
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
                    a[0].ThermalInformation.ThermalSensors,a[0].UsageInformation.UtilizationDomainsStatus };
                    return anArray;
                  }
                  catch (Exception e)
                  {
                    return e;
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
          public class Startup
          {
              public async Task<object> Invoke(object input)
              {
                  try{
                    var cpu = Cpu.Discover();
                    var mainboard = new Mainboard();
                    object[] anArray = new object[] {cpu, mainboard};
                    return anArray;
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

  async getRam() {
    const memInfo = await this.electronService.si.mem();
    const memLayout = await this.electronService.si.memLayout();
    const memConverted = {
      total: this.utility.formatBytes(memInfo.total),
      used: this.utility.formatBytes(memInfo.used),
      free: this.utility.formatBytes(memInfo.free)
    };
    return {
      memInfo: memConverted,
      memLayout: memLayout
    };
  }

  async getDisk() {
    const diskFsSize = await this.electronService.si.fsSize();
    const diskSize = [];
    diskFsSize.forEach((res, ind) => {
      diskSize[ind] = res;
      diskSize[ind].size = this.utility.formatBytes(res.size);
      diskSize[ind].used = this.utility.formatBytes(res.used);
    });
    return {
      diskSize: diskSize
    };
  }
}
