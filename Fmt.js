'use strict';

export default class Fmt {

  static dateDiff(pTime) {
    if (!pTime) return '';

    let d_minutes, d_hours, d_days, d;
    let timeNow = parseInt(new Date().getTime() / 1000);
    let pTime_new = new Date(pTime).getTime() / 1000;
    d = timeNow - pTime_new;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    if (d_days > 0 && d_days < 4) {
      return d_days + "天前";
    } else if (d_days <= 0 && d_hours > 0) {
      return d_hours + "小时前";
    } else if (d_hours <= 0 && d_minutes > 0) {
      return d_minutes + "分钟前";
    } else {
      return pTime.substring(0, 10);
    }
  }

  static fixFaceUrl(url) {
    if (url.indexOf('//') == 0) {
      return 'https:' + url;
    }
    return url;
  }
}