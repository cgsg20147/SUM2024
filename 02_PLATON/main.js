import { camSet } from "./drawing.js";
import { mat4, vec3 } from "./mth/mat4.js";
import {glInit, setVertexFormat, setVertex, autoNormals} from "./render.js"

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
  in vec3 InNormal;
  out vec3 DrawPos;
  out vec4 DrawColor;
  out vec3 DrawNormal;
  uniform float Time;
  uniform mat4 W;
  uniform mat4 WVP;


  void main( void )
  {
    gl_Position = WVP * vec4(InPosition, 1.0);
    DrawPos = vec3(W * vec4(InPosition, 1.0));
    DrawNormal = mat3(transpose(inverse(W))) * InNormal;
    DrawColor = InColor;
  }
  `;
  sh[1] =
  `#version 300 es
  precision highp float;
  out vec4 OutColor;
  
  in vec3 DrawPos;
  in vec4 DrawColor;
  in vec3 DrawNormal;
  uniform vec3 CamLoc;
  uniform float Time;

  void main( void )
  {
    vec3 L = vec3(-10.0 * sin(Time), -10.0 * cos(Time) * sin(Time), -10.0 * cos(Time)), LC = vec3(cos(sin(Time * 0.017) * Time * 0.07), cos(Time * 0.13) * sin(Time * 0.18), sin(cos(Time * 0.014) * Time * 0.11)), color = vec3(DrawColor);
    vec3 V = normalize(DrawPos - CamLoc);
    float d = length(DrawPos - CamLoc), att = max(0.1, 1.0 / (0.3 * d));
    vec3 N = faceforward(DrawNormal, V, DrawNormal);
    color += max(0.0, dot(N, L)) * 0.147 * LC;
    vec3 R = reflect(V, N);
    color += pow(max(0.0, dot(R, L)), 0.47) * 0.247 * LC;
    OutColor = vec4(color * att, 1.0);
    }
  `;
  gl.loadShaders([gl.gl.VERTEX_SHADER, gl.gl.FRAGMENT_SHADER], sh);
  
  // Vertex buffer creation
  const size = 1.0;
  let pos = [-size, size, -size, -size, -size, -size, size, size, -size, size, -size, -size, 
    size, size, size, size, -size, size, -size, size, size, -size, -size, size,
    -size, size, -size, -size, -size, -size, size, size, -size, size, -size, -size, 
    size, size, size, size, -size, size, -size, size, size, -size, -size, size,
    -size, size, -size, -size, -size, -size, size, size, -size, size, -size, -size, 
    size, size, size, size, -size, size, -size, size, size, -size, -size, size,];
  let col = [1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 
    1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 
    1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0];
  let ind = [0, 1, 2, 3, 2, 1, 4, 5, 6, 7, 6, 5, 8, 9, 14, 15, 14, 9, 10, 11, 12, 13, 12, 11, 16, 18, 22, 20, 22, 18, 17, 19, 23, 21, 23, 19];
  let norm = autoNormals(pos, ind);
  let vertexes = setVertex(pos, col, norm).toArray();
  let format = setVertexFormat(3, ["InPosition", "InColor", "InNormal"], [0, 12, 28]);
  gl.createPrim(vertexes, ind, format, gl.gl.TRIANGLES, 40);
  pos = [0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, -1.0, 0.0,
          0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, -1.0, 0.0,
          0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, -1.0, 0.0,
          0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, -1.0, 0.0];
  ind = [0, 1, 2, 3, 4, 5, 6, 8, 9, 11, 7, 10, 12, 16, 15, 13, 14, 17, 18, 22, 19, 20, 21, 23];
  norm = autoNormals(pos, ind);
  vertexes = setVertex(pos, col, norm).toArray();
  gl.createPrim(vertexes, ind, format, gl.gl.TRIANGLES, 40);
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
    gl.subUniformData("WVP", 16, m.mul(gl.cam.vp).toArray(), "m4fv");
  }
  gl.draw();
} // End of 'render' function.