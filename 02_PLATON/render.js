import {vec3} from "./mth/vec3.js"
import { inputResponse, camSet  } from "./drawing.js";

  class _vFormat {
    constructor (numOfParams) {
      this.paramName = new Array(numOfParams);
      this.offset = new Array(numOfParams);
    }
  }
  export function setVertexFormat(numOfParams, paramNames, offsets) {
    let i, format;
    try {
    format = new _vFormat(numOfParams);    
    for (i = 0; i < offsets.length; i++) {
      format.paramName[i] = paramNames[i];
      format.offset[i] = offsets[i];
    }
    } catch {
      console.log("uncorrect format value on %i iteration\n", i);
    } finally {
      return format;
    }    
  }
  class _vertex {
    constructor(pos, col, norm, tex) {
      this.pos = pos;
      this.col = col;
      this.norm = norm;
      this.tex = tex;
    }
    toArray() {
      if (typeof this.pos != 'object')
        return null;
      let i = this.pos.length, iscol = false, isnorm = false, istex = false;
      this.stride = 12;
      if (typeof this.col == 'object') {
        iscol = true;
        i += this.col.length;
        this.stride += 16;
      }
      if (typeof this.norm == 'object') {
        isnorm = true;
        i += this.norm.length;
        this.stride += 12;
      }
      if (typeof this.tex == 'object') {
        istex = true;
        i += this.tex.length;
        this.stride += 8;
      }
      this.vArray = new Array(i);
      for (let j = 0, k = 0; j + 1 < i;) {
        this.vArray[j++] = this.pos[k * 3];
        this.vArray[j++] = this.pos[k * 3 + 1];
        this.vArray[j++] = this.pos[k * 3 + 2];
        if (iscol) {
          this.vArray[j++] = this.col[k * 4];
          this.vArray[j++] = this.col[k * 4 + 1];
          this.vArray[j++] = this.col[k * 4 + 2];
          this.vArray[j++] = this.col[k * 4 + 3];
        }
        if (isnorm) {
          this.vArray[j++] = this.norm[k * 3];
          this.vArray[j++] = this.norm[k * 3 + 1];
          this.vArray[j++] = this.norm[k * 3 + 2];
        }
        if (istex) {
          this.vArray[j++] = this.tex[k * 2];
          this.vArray[j++] = this.tex[k * 2 + 1];
        }
        k++;
      }
      return this.vArray;
    }
  }
  export function setVertex(...args) {
    return new _vertex(...args);
  }
  export function autoNormals(pos, ind) {
    let norm = new Array(pos.length);
    for (let i = 0; i < pos.length; i++) {
      norm[i] = 0.0;
    }
    for (let i = 0; i < ind.length; i += 3) {
      let n0 = ind[i], n1 = ind[i + 1], n2 = ind[i + 2];
      let p0 = vec3(pos[n0 * 3], pos[n0 * 3 + 1], pos[n0 * 3 + 2]), p1 = vec3(pos[n1 * 3], pos[n1 * 3 + 1], pos[n1 * 3 + 2]), p2 = vec3(pos[n2 * 3], pos[n2 * 3 + 1], pos[n2 * 3 + 2]);
      let n = p1.sub(p0).cross(p2.sub(p0)).normalize();
      let a0 = vec3(norm[n0 * 3], norm[n0 * 3 + 1], norm[n0 * 3 + 2]).add(n).toArray(), a1 = vec3(norm[n1 * 3], norm[n1 * 3 + 1], norm[n1 * 3 + 2]).add(n).toArray(), 
      a2 = vec3(norm[n2 * 3], norm[n2 * 3 + 1], norm[n2 * 3 + 2]).add(n).toArray();
      norm[n0 * 3] = a0[0];
      norm[n0 * 3 + 1] = a0[1];
      norm[n0 * 3 + 2] = a0[2];
      norm[n1 * 3] = a1[0];
      norm[n1 * 3 + 1] = a1[1];
      norm[n1 * 3 + 2] = a1[2];
      norm[n2 * 3] = a2[0];
      norm[n2 * 3 + 1] = a2[1];
      norm[n2 * 3 + 2] = a2[2];
   }
   for (let i = 0; i < norm.length / 3; i++) {
    let n = vec3(norm[i * 3], norm[i * 3 + 1], norm[i * 3 + 2]).normalize().toArray();
    norm[i * 3] = n[0];
    norm[i * 3 + 1] = n[1];
    norm[i * 3 + 2] = n[2];
   }
   return norm;
  }
  class _prim {
    constructor(iBuf, noofI, drawType) {
      this.buf = iBuf;
      this.num = noofI;
      this.type = drawType;
    }
  }
  class _gl {
    constructor(canvas, w, h, clearColor) {
      this.gl = canvas.getContext("webgl2");
      this.w = w, this.h = h;
      this.gl.enable(this.gl.DEPTH_TEST);
      if (typeof clearColor == 'object')
        this.gl.clearColor(clearColor.r || clearColor.x || clearColor[0], clearColor.g || clearColor.y || clearColor[1], clearColor.b || clearColor.z || clearColor[2], 1.0);
      else
        this.gl.clearColor(0.30, 0.47, 0.8, 1.0);      
      this.prims = new Array();
      this.uniforms = new Array();
      this.cam = camSet(vec3(5, 5, 5), vec3(0, 0, 0), vec3(0, 1, 0), w, h, 0.1, 0.1, 300);
    }
    loadShaders(shaderTypes, shaderSources) {
      this.prg = this.gl.createProgram();
      
      for (let i = 0, sh; i < shaderTypes.length; i++) {
        if (this.gl == undefined)
          return false;
        sh = loadShader(this.gl, shaderTypes[i], shaderSources[i]);
        this.gl.attachShader(this.prg, sh);
        this.gl.linkProgram(this.prg);
      }      
      if (!this.gl.getProgramParameter(this.prg, this.gl.LINK_STATUS)) {
        let buf = this.gl.getProgramInfoLog(this.prg);
        console.log('Shader program link fail: ' + buf);
        return false;
      }
      this.gl.useProgram(this.prg);
      return true;
    }
    //Creating primitive function. vFormat: (string)paramName, (number)offset.
    createPrim(vArray, iArray, vFormat, drawFormat, stride) {
      if (typeof vArray != 'object' || vArray.length == 0 || typeof iArray != 'object' || drawFormat == undefined || stride == undefined || stride == 0)
        return false;

      let vertexes = this.gl.createVertexArray();
      this.gl.bindVertexArray(vertexes);
      let buf = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vArray), this.gl.STATIC_DRAW);

      for (let i = 0; i < vFormat.offset.length; i++) {
        let loc = this.gl.getAttribLocation(this.prg, vFormat.paramName[i]);
        if (loc == -1)
          continue;
        let size = (i == vFormat.offset.length - 1 ? (stride - vFormat.offset[i]) : (vFormat.offset[i + 1] - vFormat.offset[i])) / 4;
        this.gl.vertexAttribPointer(loc, size, this.gl.FLOAT, false, stride, vFormat.offset[i]);
        this.gl.enableVertexAttribArray(loc);
      }

      buf = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buf);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(iArray), this.gl.STATIC_DRAW);
      this.prims[this.prims.length] = new _prim(buf, iArray.length, drawFormat);
    }
    draw() {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      for (let i = 0; i < this.prims.length; i++) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.prims[i].buf);
        this.gl.drawElements(this.prims[i].type, this.prims[i].num, this.gl.UNSIGNED_INT, 0);
      }
    }
    subUniformData(name, size, data, format) {      
      let loc = findUniform(this, name);
      if (loc == -1)
        return;
      switch(format) {
        case "1f":
          this.gl.uniform1f(loc, data);
          break;
        case "3fv":
          this.gl.uniform3fv(loc, new Float32Array(data), 0, 3);
          break;
        case "m4fv":
          this.gl.uniformMatrix4fv(loc, false, new Float32Array(data), 0, 16);
          break;
        default:
          return;
      }
    }
  }
  export function glInit(canvas, w, h, clearColor) {
    return new _gl(canvas, w, h, clearColor);
  }
  function findUniform(gl, uname) {
    if (gl.uniforms)
    for (let i of gl.uniforms) {
      if (i != undefined)
        return i.loc;
      else
        return -1;
    }
    let loc = gl.gl.getUniformLocation(gl.prg, uname);
    if (loc == -1)
      return -1;
    gl.uniforms[uname] = loc;
    return loc;
  }
  function loadShader(gl, shaderType, shaderSource) {
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let buf = gl.getShaderInfoLog(shader);
      console.log('Shader compile fail: ' + buf);
      return null;
    }
    return shader;
  }