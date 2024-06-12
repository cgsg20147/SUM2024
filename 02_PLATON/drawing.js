import {mat4} from "./mth/mat4.js";
import {vec3} from "./mth/vec3.js";

class _cam {
    constructor(loc, at, up, w, h, projSize, projDist, projFarClip) {
        this.projDist = projDist;
        this.projSize = projSize;
        this.projFarClip = projFarClip;
        this.w = w;
        this.h = h;
        this.set(loc, at, up);
    }
    set(loc, at, up) {
        this.view = mat4().view(loc, at, up);
        this.loc = vec3(loc);
        this.at = vec3(at);
        this.up = vec3(this.view[0][0], this.view[1][0], this.view[2][0]);
        this.right = vec3(this.view[0][1], this.view[1][1], this.view[2][1]);
        this.dir = vec3(-this.view[0][2], -this.view[1][2], -this.view[2][2]);
        this.vp = this.view.mul(projSet(this.w, this.h));
    }
  }
export function camSet(...args) {
    return new _cam(...args);
}

let oldpt = [0, 0];
export function inputResponse(event, cam) {
  let i, dist = cam.at.sub(cam.loc).len, cosT = (cam.loc.y - cam.at.y) / dist, sinT = Math.sqrt(1 - cosT * cosT), plen = dist * sinT,
    cosP = (cam.loc.z - cam.at.z) / plen, sinP = (cam.loc.x - cam.at.x) / plen, azimuth = Math.atan2(sinP, cosP) * 180 / Math.PI, 
    elevator = Math.atan2(sinT, cosT) * 180 / Math.PI, pt = [event.clientX, event.clientY];

    dist = 0.002;
    azimuth += pt[0] - oldpt[0];
    elevator += pt[1] - oldpt[1];
    oldpt[0] = pt[0];
    oldpt[1] = pt[1];
    if (elevator < 0.08)
        elevator = 0.08;
      else if (elevator > 178)
        elevator = 178;
      if (dist < 0.002)
        dist = 0.002
    azimuth = azimuth * Math.PI / 180;
}
function projSet(w, h) {
    let rx = window.projSize, ry = window.projSize;

    if (w > h)
        rx *= w / h;
    else
        ry *= h / w;
    return mat4().frustum(-rx / 2, rx / 2, -ry / 2, ry / 2, window.projDist, window.projFarClip);
}