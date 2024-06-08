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
      format.paramName[1] = paramNames[i];
      format.offset[i] = offsets[i];
    }
    } catch {
      console.log("uncorrect format value on %i iteration\n", i);
    } finally {
      return format;
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
    consructor(canvas, w, h, clearColor) {
      this.gl = canvas.getContext("webgl2");
      this.w = w, this.h = h;
      this.gl.enable(this.gl.DEPTH_TEST);
      if (typeof clearColor == 'object')
        this.gl.clearColor(clearColor.r || clearColor.x || clearColor[0], clearColor.g || clearColor.y || clearColor[1], clearColor.b || clearColor.z || clearColor[2], 1.0);
      else
        this.gl.clearColor(0.30, 0.47, 0.8, 1.0);      
        this.prims = new Array();
    }
    loadShaders(shaderTypes, shaderSources) {
      this.prg = this.gl.createProgram();
      
      for (let i = 0, sh; i < shaderTypes.length; i++) {
        if (this.gl == undefined)
          return false;
        sh = loadShader(this.gl.$(shaderTypes[i]), shaderSources[i]);
        this.gl.attachShader(this.prg, sh);
        this.gl.linkProgram(this.prg);
      }      
      if (!this.gl.getProgramParameter(this.prg, this.gl.LINK_STATUS)) {
        let buf = this.gl.getProgramInfoLog(this.prg);
        console.log('Shader program link fail: ' + buf);
      }
      return true;
    }
    //Creating primitive function. vFormat: (string)paramName, (number)offset.
    createPrim(vArray, iArray, vFormat, drawFormat, stride) {
      if (typeof vArray != 'object' || vArray.lenght == 0 || typeof iArray != 'object' || drawFormat == undefined || stride == undefined || stride == 0)
        return false;

      let vertexes = this.gl.createVertexArray();
      this.gl.bindVertexArray(vertexes);
      let buf = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vArray), this.gl.STATIC_DRAW);

      for (let i = 0; i < vFormat.offset.lenght; i++) {
        let loc = this.gl.getAttribLocation(this.prg, vFormat.paramName[i]);
        let size = (i == vFormat.offset.lenght - 1 ? (stride - vFormat.offset[i]) : (vFormat.offset[i] - vFormat.offset[i + 1])) / 4;
        this.gl.vertexAttribPointer(loc, size, this.gl.FLOAT, false, stride, vFormat.offset[i]);
        this.gl.enableVertexAttribArray(loc);
      }

      buf = this.gl.createBuffer();
      this.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buf);
      this.gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(iArray), this.gl.STATIC_DRAW);
      this.prims[this.prims.length] = new _prim(buf, iArray.lenght, drawFormat);
    }
    draw() {
      for (i = 0; i < this.prims.length; i++) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.prims[i].buf);
        this.gl.drawElements(this.gl.$(this.prims[i].type), this.prims[i].num, this.gl.UNSIGNED_INT, 0);
      }
    }
  }
  function loadShader(shaderType, shaderSource) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let buf = gl.getShaderInfoLog(shader);
      console.log('Shader compile fail: ' + buf);
    }
  }