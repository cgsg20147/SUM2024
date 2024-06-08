import { camSet } from "./drawing.js";
import { mat4, vec3 } from "./mth/mat4.js";

let
  canvas,
  gl,
  timeLoc,
  wLoc, WVPloc;
  let indexBuffer;

// OpenGL initialization function  
export function initGL() {
  window.frameW = 1900;
  window.frameH = 1000;
  window.projSize = 0.1;
  window.projDist = 0.1;
  window.projFarClip = 300;

  canvas = document.getElementById("myCan");
  gl = canvas.getContext("webgl2");
  gl.clearColor(0.30, 0.47, 0.8, 1);
  
  // Shader creation
  let vs_txt =
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
    gl_Position = WVP * vec4(InPosition, 1);
    DrawPos = vec3(W * vec4(InPosition, 1));
    DrawColor = InColor;
  }
  `;
  let fs_txt =
  `#version 300 es
  precision highp float;
  out vec4 OutColor;
  
  in vec3 DrawPos;
  in vec4 DrawColor;
  uniform float Time;

  void main( void )
  {
    OutColor = DrawColor;
  }
  `;
  let
    vs = loadShader(gl.VERTEX_SHADER, vs_txt),
    fs = loadShader(gl.FRAGMENT_SHADER, fs_txt),
    prg = gl.createProgram();
  gl.attachShader(prg, vs);
  gl.attachShader(prg, fs);
  gl.linkProgram(prg);
  if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    let buf = gl.getProgramInfoLog(prg);
    console.log('Shader program link fail: ' + buf);
  }                                            

  // Vertex buffer creation
  const size = 1.0;
  const vertexes = [0.0, size, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, size, size, 0.0, 1.0, 0.0, 0.0, 1.0, size, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, size, size, size, 1.0, 0.0, 0.0, 1.0, size, 0.0, size, 1.0, 0.0, 0.0, 1.0, 0.0, size, size, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, size, 1.0, 0.0, 0.0, 1.0];
  const posLoc = gl.getAttribLocation(prg, "InPosition");
  const colLoc = gl.getAttribLocation(prg, "InColor");
  const indexes = [0, 1, 2, 1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6, 5, 6, 7, 6, 7, 0, 7, 0, 1, 0, 2, 4, 2, 4, 6, 1, 3, 5, 3, 5, 7];
  let vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);
  indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indexes), gl.STATIC_DRAW);
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);
  if (posLoc != -1) {
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 28, 0);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, 28, 12);
    gl.enableVertexAttribArray(colLoc);
  }

  // Uniform data
  timeLoc = gl.getUniformLocation(prg, "Time");
  wLoc = gl.getUniformLocation(prg, "W");
  WVPloc = gl.getUniformLocation(prg, "WVP")

  gl.useProgram(prg);
}  // End of 'initGL' function               

// Load and compile shader function
function loadShader(shaderType, shaderSource) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    let buf = gl.getShaderInfoLog(shader);
    console.log('Shader compile fail: ' + buf);
  }                          

  return shader;
} // End of 'loadShader' function
  
let x = 1;                    

// Main render frame function
export function render() {
  // console.log(`Frame ${x++}`);
  gl.clear(gl.COLOR_BUFFER_BIT);
                                               
  if (timeLoc != -1) {
    const date = new Date();
    let t = date.getMinutes() * 60 +
            date.getSeconds() +
            date.getMilliseconds() / 1000;
    let m = mat4().rotateY(t);
    gl.uniform1f(timeLoc, t);
    gl.uniformMatrix4fv(wLoc, false, new Float32Array(m.toArray()), 0, 16);
    gl.uniformMatrix4fv(WVPloc, false, new Float32Array(camSet(vec3(5.0, 5.0, 5.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0)).mul(m).toArray()), 0, 16);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 0);
} // End of 'render' function.