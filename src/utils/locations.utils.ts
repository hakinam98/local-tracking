import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationsUtils {
  public constructCachePath(dataObj: any) {
    let cachePath = '';
    for (let [key, value] of Object.entries(dataObj)) {
      cachePath += `${value.toString().trim()}:`;
    }

    return `${cachePath}cached`.replace(/\s+/g, '');
  }
}
