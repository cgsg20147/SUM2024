import {vec3} from "./math/vec3.js"
class _buffer {
    constructor(type, size) {
      this.type = type;    // Buffer type (gl.***_BUFFER)
      this.size = size;    // Buffer size in bytes
      this.id = null;
      if (size == 0 || type == undefined)
        return;
      this.id = gl.createBuffer();
      gl.bindBuffer(type, this.id);
      gl.bufferData(type, size, gl.STATIC_DRAW);
    }
    update(data) {
    }
  }
  export function buffer(...args) {
    return new _buffer(...args);
  } // End of 'buffer' function
  
  
  class _ubo_buffer extends _buffer {
    constructor(name, size, bindPoint) {
      super(gl.UNIFORM_BUFFER, size);
      this.name = name;
      this.bindPoint = bindPoint; // Buffer GPU binding point
    }
    apply (shd) {
      if (shd == undefined || shd.id == undefined || shd.uniformBlocks[this.name] == undefined)
        return;
      gl.uniformBlockBinding(shd.id, shd.uniformBlocks[this.name].index, this.bindPoint);
      gl.bindBufferBase(gl.UNIFORM_BUFFER, this.bindPoint, this.id);
    }                        
  }
  export function ubo_buffer(...args) {
    return new _ubo_buffer(...args);
  } // End of 'ubo_buffer' function
  
  class _vertex_buffer {
    constructor(prg, vArray) {
        let vertexArray = gl.createVertexArray();
        gl.bindVertexArray(vertexArray);        
        this.vBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vArray), gl.STATIC_DRAW);
        let posLoc = gl.getAttribLocation(prg, "InPosition");
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
        let colLoc = gl.getAttribLocation(prg, "InColor");
        gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, 0, 12);
        gl.enableVertexAttribArray(posLoc);
        gl.enableVertexAttribArray(colLoc);
    }
  }
  export function vertex_buffer(...args) {
    return new _vertex_buffer(...args);
  } // End of 'vertex_buffer' function
          
  class _index_buffer extends _buffer {
    constructor(iArray) {
      const n = iArray.length;
      super(gl.ELEMENT_ARRAY_BUFFER, n * 4);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
      gl.bufferSubData(this.type, 0, new Uint32Array(iArray), 0);
    }
  }
  export function index_buffer(...args) {
    return new _index_buffer(...args);
  } // End of 'ubo_buffer' function

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

  function autoNormals(v, ind) {
    let norm = new Array(ind.length);
    for (let i in norm) {
      i = 0;
    }
    for (let i = 0; i < ind.length; i += 3) {
      let n0 = ind[i], n1 = ind[i + 1], n2 = n2 = ind[i + 2];
      let p0 = vec3(v[n0].pos), p1 = vec3(v[n0].pos), p2 = vec3(v[n0].pos);
      let n = p1.sub(p0).cross(p2.sub(p0)).normalize();
      v[n0].norm = v[n0].norm.add(n);
      v[n1].norm = v[n1].norm.add(n);
      v[n2].norm = v[n2].norm.add(n);
   }
   for (let i of v) {
    i.norm.normalize();
   }
  }
  export function setVertexArray(vFormat, args, noofV) {
    let vArray = new Array();

    for (let i = 0; i < noofV; i++) {
      for (let j = 0, offset = 0; j < vFormat.length; j++) {
        for (let k = 0; k < vFormat[j].offset / 4; k++) {
          vArray[i * vFormat.length + offset + k] = vFormat[j].paramName == "InPosition" ? args[i].pos.toArray()[k] : vFormat[j].paramName == "InColor" ? args[i].col.toArray()[k] :
            vFormat[j].paramName == "InNormal" ? args[i].norm.toArray()[k] : vFormat[j].paramName == "InTexCoord" ? args[i].tex.toArray()[k] : 0.0;
        }          
        offset += vFormat[j].offset / 4;
      }
    }
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