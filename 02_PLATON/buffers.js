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