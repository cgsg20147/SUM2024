import {mat4} from "./mth/mat4.js";
import {vec3} from "./mth/vec3.js";


export function camSet(loc, at, up) {
    let view = mat4().view(loc, at, up);

    return view.mul(projSet());
}
function projSet() {
    let rx = window.projSize, ry = window.projSize;

    if (window.frameW > window.frameH)
        rx *= window.frameW / window.frameH;
    else
        ry *= window.frameH / window.frameW;
    return mat4().frustum(-rx / 2, rx / 2, -ry / 2, ry / 2, window.projDist, window.projFarClip);
}