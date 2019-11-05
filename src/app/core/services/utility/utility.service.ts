import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UtilityService {
  constructor() {}

  public formatBytes(bytes, decimals?) {
    if (bytes == 0) return "0 Bytes";
    const k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  public isObject(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
  }

  public dropNullUndefined(d) {
    return Object.entries(d).reduce(
      (acc, [k, v]) =>
        v == null
          ? acc
          : { ...acc, [k]: this.isObject(v) ? this.dropNullUndefined(v) : v },
      {}
    );
  }
}
