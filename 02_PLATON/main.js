import { camSet } from "./drawing.js";
import { mat4, vec3 } from "./mth/mat4.js";
import {glInit, setVertexFormat} from "./render.js"

let
  canvas,
  gl,
  timeLoc,
  wLoc, WVPloc, camLoc;
  let indexBuffer;

// OpenGL initialization function  
export function initGL() {
  window.frameW = 1900;
  window.frameH = 1000;
  window.projSize = 0.1;
  window.projDist = 0.1;
  window.projFarClip = 300;

  gl = glInit(document.getElementById("myCan"), 1900, 1000, [0.30, 0.47, 0.8, 1.0]);
  
  // Shader creation
  let sh = new Array(2);
  sh[0] = 
  `#version 300 es
  precision highp float;
  in vec3 InPosition;
  in vec4 InColor;

  out vec3 DrawPos;
  out vec4 DrawColor;

  uniform float Time;
  uniform mat4 W;
  uniform mat4 WVP;

  void main( void )
  {
    gl_Position = WVP * vec4(InPosition, 1.0);
    DrawPos = vec3(W * vec4(InPosition, 1.0));
    DrawColor = InColor;
  }
  `;
  sh[1] =
  `#version 300 es
  precision highp float;
  out vec4 OutColor;
  
  in vec3 DrawPos;
  in vec4 DrawColor;
  uniform vec3 CamLoc;
  uniform float Time;

  void main( void )
  {
    vec3 L = vec3(-10.0 * sin(Time), -10.0 * cos(Time) * sin(Time), -10.0 * cos(Time)), LC = vec3(1.0), color = vec3(DrawColor);
    vec3 V = normalize(DrawPos - CamLoc);
    float d = length(DrawPos - CamLoc), att = max(0.1, 1.0 / (0.3 * d));
    OutColor = vec4(color * att, 1.0);
  }
  `;
  gl.loadShaders([gl.gl.VERTEX_SHADER, gl.gl.FRAGMENT_SHADER], sh);
  
  // Vertex buffer creation
  const size = 1.0;
  let vertexes = {};
  vertexes.pos = [-size, size, -size, -size, -size, -size, size, size, -size, size, -size, -size, 
    size, size, size, size, -size, size, -size, size, size, -size, -size, size,
    -size, size, -size, -size, -size, -size, size, size, -size, size, -size, -size, 
    size, size, size, size, -size, size, -size, size, size, -size, -size, size,
    -size, size, -size, -size, -size, -size, size, size, -size, size, -size, -size, 
    size, size, size, size, -size, size, -size, size, size, -size, -size, size,];
   vertexes.col = [1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 
    1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 
    1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0];
  const indexes = [0, 1, 2, 1, 2, 3, 4, 5, 6, 5, 6, 7, 8, 9, 14, 9, 14, 15, 10, 11, 12, 11, 12, 13, 16, 18, 22, 18, 22, 20, 17, 19, 23, 19, 23, 21];
  gl.createPrim(vertexes, indexes, setVertexFormat(2, ["InPosition", "InColor"], [0, 12]), gl.gl.TRIANGLES, 28);

}  // End of 'initGL' function               

// Main render frame function
export function render() {                                               
  if (timeLoc != -1) {
    const date = new Date();
    let t = date.getMinutes() * 60 +
            date.getSeconds() +
            date.getMilliseconds() / 1000;
    let m = mat4().rotate(Math.sin(t) * Math.cos(t / 3.0) * 2, vec3(Math.sin(t), Math.cos(t), Math.sin(t) * Math.cos(t)));
    let camloc = vec3(5.0, 3.0, 5.0);
    gl.subUniformData("Time", 0, t, "1f");
    gl.subUniformData("CamLoc", 3, camloc.toArray(), "3fv");
    gl.subUniformData("W", 16, m.toArray(), "m4fv");
    gl.subUniformData("WVP", 16, m.mul(camSet(vec3(5.0, 3.0, 5.0), vec3(0.0, -1.0, 0.0), vec3(0.0, 1.0, 0.0))).toArray(), "m4fv");
  }
  gl.draw();
} // End of 'render' function.