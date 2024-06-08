(function (exports) {
    'use strict';

    class _vec3 {
        constructor(x, y, z) {
            this.x = 0, this.y = 0, this.z = 0;
            if (typeof x == 'object')
            {
                this.x = x[0] || x.x, this.y = x[1] || x.y, this.z = x[2] || x.z;
            }
            else if (y == undefined && z == undefined)
                this.x = x, this.y = x, this.z = x;
            else
                this.x = x, this.y = y, this.z = z;        
        }    
        len() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
        len2() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }
        dot(v) {
            if (typeof v == 'number' || typeof v == 'string')
                return this.x * Number(v) + this.y * Number(v) + this.z * Number(v);
            else if (typeof v == 'object')
                return this.x * v.x + this.y * v.y + this.z * v.z;
            return 0;
        }
        add(v) {
            if (typeof v == 'number' || typeof v == 'string' )
                return vec3(this.x + Number(v), this.y + Number(v), this.z + Number(v));
            else if (typeof v == 'object')
                return vec3(this.x + v.x, this.y + v.y, this.z + v.z);
            return vec3(this.x, this.y, this.z);

        }
        normalize() {
            let len = this.len();
            if (len == 1 || len == 0)
                return len;
            return vec3(this.x, this.y, this.z).div(len);
        }
        cross(v) {
            if (typeof v == 'object')
                return vec3(this.y * v.z - this.z * v.y, v.x * this.z - v.z * this.x, this.z * v.y - this.y * v.x);
            else if (typeof v == 'number' || typeof v == 'string')
                return vec3(Number(v) * (this.y - this.z), Number(v) * (this.z - this.x), Number(v) * (this.z - this.y));
            return vec3(this.x, this.y, this.z).transform(mat4().rotate(90, vec3(1, 1, 1)));
        }
        sub(v) {
            if (typeof v == 'number' || typeof v == 'string' )
                return vec3(this.x - v, this.y - v, this.z - v);
            else if (typeof v == 'object')
                return vec3(this.x - (v.x || v[0]), this.y - (v.y || v[1]), this.z - (v.z || v[2]));
            return vec3(this.x, this.y, this.z);        
        }
        mul(n) {
            if (typeof n == 'number' || typeof n == 'string')
                return vec3(this.x * Number(n), this.y * Number(n), this.z * Number(n));
            else if (typeof n == 'object')
                {
                    let w = this.x * m[0][3] + this.y * m[1][3] + this.z * m[2][3] + m[3][3];
                    return vec3((this.x * m[0][0] + this.y * m[1][0] + this.z * m[2][0] + m[3][0]) / w,
                            (this.x * m[0][1] + this.y * m[1][1] + this.z * m[2][1] + m[3][1]) / w,
                            (this.x * m[0][2] + this.y * m[1][2] + this.z * m[2][2] + m[3][2]) / w);
                }
            return vec3(this.x, this.y, this.z);
        }
        div(n) {
            if (typeof n == 'number' || typeof n == 'string')
                return vec3(this.x / n, this.y / n, this.z / n)        
            return vec3(this.x, this.y, this.z);
        }
        pointTransform(m) {
            return vec3(this.x * m[0][0] + this.y * m[1][0] + this.z * m[2][0] + m[3][0],
                    this.x * m[0][1] + this.y * m[1][1] + this.z * m[2][1] + m[3][1], 
                    this.x * m[0][2] + this.y * m[1][2] + this.z * m[2][2] + m[3][2]); 
        }
        transform(m) {
            return vec3(this.x * m[0][0] + this.y * m[1][0] + this.z * m[2][0],
                    this.x * m[0][1] + this.y * m[1][1] + this.z * m[2][1],
                    this.x * m[0][2] + this.y * m[1][2] + this.z * m[2][2]);
        }
    }

    function vec3( ...args ) {
        return new _vec3(...args);
    } //End of 'vec3' function

    class _mat4 {
        //Matrix class construction.
        constructor( a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33 ) {
            this[0] = [1, 0, 0, 0], this[1] = [0, 1, 0, 0], this[2] = [0, 0, 1, 0], this[3] = [0, 0, 0, 1];
            if (typeof a00 == 'object')
            {
                if (a00.lenght == 16)
                    this[0][0] = a00[0], this[0][1] = a00[1], this[0][2] = a00[2], this[0][3] = a00[3], 
                    this[1][0] = a00[4], this[1][1] = a00[5], this[1][2] = a00[6], this[1][3] = a00[7], 
                    this[2][0] = a00[8], this[2][1] = a00[9], this[2][2] = a00[10], this[2][3] = a00[11], 
                    this[3][0] = a00[12], this[3][1] = a00[13], this[3][2] = a00[14], this[3][3] = a00[15];
                else if (a0.lenght == 4 && a00[0].lenght == 4)
                    this[0][0] = a00[0][0], this[0][1] = a00[0][1], this[0][2] = a00[0][2], this[0][3] = a00[0][3], 
                    this[1][0] = a00[1][0], this[1][1] = a00[1][1], this[1][2] = a00[1][2], this[1][3] = a00[1][3], 
                    this[2][0] = a00[2][0], this[2][1] = a00[2][1], this[2][2] = a00[2][2], this[2][3] = a00[2][3], 
                    this[3][0] = a00[3][0], this[3][1] = a00[3][1], this[3][2] = a00[3][2], this[3][3] = a00[3][3];
            }
            else if (a00 != undefined && a01 == undefined)
                this[0][0] = a00, this[0][1] = a00, this[0][2] = a00, this[0][3] = a00, 
                this[1][0] = a00, this[1][1] = a00, this[1][2] = a00, this[1][3] = a00, 
                this[2][0] = a00, this[2][1] = a00, this[2][2] = a00, this[2][3] = a00, 
                this[3][0] = a00, this[3][1] = a00, this[3][2] = a00, this[3][3] = a00;            
            else if (a33 != undefined)
                this[0][0] = a00, this[0][1] = a01, this[0][2] = a02, this[0][3] = a03, 
                this[1][0] = a10, this[1][1] = a11, this[1][2] = a12, this[1][3] = a13, 
                this[2][0] = a20, this[2][1] = a21, this[2][2] = a22, this[2][3] = a23, 
                this[3][0] = a30, this[3][1] = a31, this[3][2] = a32, this[3][3] = a33;            
        }// End of matrix constructor
        // Matrixes multiple function.
        mul(m) {
            if (typeof m == 'object')
                return mat4(this[0][0] * m[0][0] + this[0][1] * m[1][0] + this[0][2] * m[2][0] + this[0][3] * m[3][0],
                            this[0][0] * m[0][1] + this[0][1] * m[1][1] + this[0][2] * m[2][1] + this[0][3] * m[3][1],
                            this[0][0] * m[0][2] + this[0][1] * m[1][2] + this[0][2] * m[2][2] + this[0][3] * m[3][2],
                            this[0][0] * m[0][3] + this[0][1] * m[1][3] + this[0][2] * m[2][3] + this[0][3] * m[3][3],
                            this[1][0] * m[0][0] + this[1][1] * m[1][0] + this[1][2] * m[2][0] + this[1][3] * m[3][0],
                            this[1][0] * m[0][1] + this[1][1] * m[1][1] + this[1][2] * m[2][1] + this[1][3] * m[3][1],
                            this[1][0] * m[0][2] + this[1][1] * m[1][2] + this[1][2] * m[2][2] + this[1][3] * m[3][2],
                            this[1][0] * m[0][3] + this[1][1] * m[1][3] + this[1][2] * m[2][3] + this[1][3] * m[3][3],
                            this[2][0] * m[0][0] + this[2][1] * m[1][0] + this[2][2] * m[2][0] + this[2][3] * m[3][0],
                            this[2][0] * m[0][1] + this[2][1] * m[1][1] + this[2][2] * m[2][1] + this[2][3] * m[3][1],
                            this[2][0] * m[0][2] + this[2][1] * m[1][2] + this[2][2] * m[2][2] + this[2][3] * m[3][2],
                            this[2][0] * m[0][3] + this[2][1] * m[1][3] + this[2][2] * m[2][3] + this[2][3] * m[3][3],
                            this[3][0] * m[0][0] + this[3][1] * m[1][0] + this[3][2] * m[2][0] + this[3][3] * m[3][0],
                            this[3][0] * m[0][1] + this[3][1] * m[1][1] + this[3][2] * m[2][1] + this[3][3] * m[3][1],
                            this[3][0] * m[0][2] + this[3][1] * m[1][2] + this[3][2] * m[2][2] + this[3][3] * m[3][2],
                            this[3][0] * m[0][3] + this[3][1] * m[1][3] + this[3][2] * m[2][3] + this[3][3] * m[3][3]);
            else if (typeof m == 'number' || typeof m == 'string')
            {
                return mat4(this[0][0] * m + this[0][1] * m + this[0][2] * m + this[0][3] * m,
                            this[0][0] * m + this[0][1] * m + this[0][2] * m + this[0][3] * m,
                            this[0][0] * m + this[0][1] * m + this[0][2] * m + this[0][3] * m,
                            this[0][0] * m + this[0][1] * m + this[0][2] * m + this[0][3] * m,
                            this[1][0] * m + this[1][1] * m + this[1][2] * m + this[1][3] * m,
                            this[1][0] * m + this[1][1] * m + this[1][2] * m + this[1][3] * m,
                            this[1][0] * m + this[1][1] * m + this[1][2] * m + this[1][3] * m,
                            this[1][0] * m + this[1][1] * m + this[1][2] * m + this[1][3] * m,
                            this[2][0] * m + this[2][1] * m + this[2][2] * m + this[2][3] * m,
                            this[2][0] * m + this[2][1] * m + this[2][2] * m + this[2][3] * m,
                            this[2][0] * m + this[2][1] * m + this[2][2] * m + this[2][3] * m,
                            this[2][0] * m + this[2][1] * m + this[2][2] * m + this[2][3] * m,
                            this[3][0] * m + this[3][1] * m + this[3][2] * m + this[3][3] * m,
                            this[3][0] * m + this[3][1] * m + this[3][2] * m + this[3][3] * m,
                            this[3][0] * m + this[3][1] * m + this[3][2] * m + this[3][3] * m,
                            this[3][0] * m + this[3][1] * m + this[3][2] * m + this[3][3] * m);
            }
            return mat4(this[0][0], this[0][1], this[0][2], this[0][3],
                        this[1][0], this[1][1], this[1][2], this[1][3],
                        this[2][0], this[2][1], this[2][2], this[2][3],
                        this[3][0], this[3][1], this[3][2], this[3][3]);
        }//End of 'mul' function
        //Translating matrix function
        translate(v) {
            if (typeof v == 'object' && v.x != undefined)
            {
                let m = mat4(1, 0, 0, 0,
                             0, 1, 0, 0,
                             0, 0, 1, 0,
                             v.x, v.y, v.z, 1);
                return this.mul(m);
                }
            else if (typeof v == 'object' && v.lenght == 3)
            {            
                let m = mat4(1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    Number(v[0]), Number(v[1]), Number(v[2]), 1);
                return this.mul(m);
            }
            else if ((typeof v == 'number' || typeof v == 'string') && v != undefined && v != NaN)
            {            
                let m = mat4(1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    Number(v), Number(v), Number(v), 1);
                return this.mul(m);
            }    
            return mat4(this[0][0], this[0][1], this[0][2], this[0][3],
                        this[1][0], this[1][1], this[1][2], this[1][3],
                        this[2][0], this[2][1], this[2][2], this[2][3],
                        this[3][0], this[3][1], this[3][2], this[3][3]);
            }//End of 'translate' function.
            //Matrix scaling function.
            scale(v) {
                if (typeof v == 'object' && v.x != undefined)
                {
                    let m = mat4(v.x, 0, 0, 0,
                                 0, v.y, 0, 0,
                                 0, 0, v.z, 0,
                                 0, 0, 0, 1);
                    return this.mul(m);
                    }
                else if (typeof v == 'object' && v.lenght == 3)
                {            
                    let m = mat4(Number(v[0]), 0, 0, 0,
                                0, Number(v[1]), 0, 0,
                                0, 0, Number(v[2]), 0,
                                0, 0, 0, 1);
                    return this.mul(m);
                }
                else if ((typeof v == 'number' || typeof v == 'string') && v != undefined && v != NaN)
                {            
                    let m = mat4(Number(v), 0, 0, 0,
                                 0, Number(v), 0, 0,
                                 0, 0, Number(v), 0,
                                 0, 0, 0, 1);
                    return this.mul(m);
                }    
                return mat4(this[0][0], this[0][1], this[0][2], this[0][3],
                            this[1][0], this[1][1], this[1][2], this[1][3],
                            this[2][0], this[2][1], this[2][2], this[2][3],
                            this[3][0], this[3][1], this[3][2], this[3][3]);
            }//End of 'scale' function
            //Rotation matrix around axisX function.
            rotateX(angle) {
                if (angle != undefined && angle != NaN && (typeof angle == 'number' || typeof angle == 'string'))
                    {
                        let si = Math.sin(Number(angle)), co = Math.cos(Number(angle));
                        let m = mat4(1, 0, 0, 0,
                                     0, co, si, 0,
                                     0, -si, co, 0,
                                     0, 0, 0, 1);
                        return this.mul(m);
                    }
                else if (typeof angle == 'object' && angle.lenght != 0)
                    {
                        for (let a of angle)
                            {
                                let si = Math.sin(Number(a)), co = Math.cos(Number(a));
                                let m = mat4(1, 0, 0, 0,
                                            0, co, si, 0,
                                            0, -si, co, 0,
                                            0, 0, 0, 1);
                                return this.mul(m);
                            }
                    }
                    return mat4(this[0][0], this[0][1], this[0][2], this[0][3],
                                this[1][0], this[1][1], this[1][2], this[1][3],
                                this[2][0], this[2][1], this[2][2], this[2][3],
                                this[3][0], this[3][1], this[3][2], this[3][3]);
                }//End of 'rotateX' function
            //Rotation matrix around axisY function.
            rotateY(angle) {
                if (angle != undefined && angle != NaN && (typeof angle == 'number' || typeof angle == 'string'))
                    {
                        let si = Math.sin(Number(angle)), co = Math.cos(Number(angle));
                        let m = mat4(co, 0, -si, 0,
                                    0, 1, 0, 0,
                                    si, 0, co, 0,
                                    0, 0, 0, 1);
                        return this.mul(m);
                    }
                else if (typeof angle == 'object' && angle.lenght != 0)
                    {
                        for (let a of angle)
                            {
                                let si = Math.sin(Number(a)), co = Math.cos(Number(a));
                                let m = mat4(co, 0, -si, 0,
                                             0, 1, 0, 0,
                                             si, 0, co, 0,
                                             0, 0, 0, 1);
                                return this.mul(m);
                            }
                    }
                    return mat4(this[0][0], this[0][1], this[0][2], this[0][3],
                                this[1][0], this[1][1], this[1][2], this[1][3],
                                this[2][0], this[2][1], this[2][2], this[2][3],
                                this[3][0], this[3][1], this[3][2], this[3][3]);
                    }//End of 'rotateY' function
            //Rotation matrix around axisZ function.
            rotatez(angle) {
                if (angle != undefined && angle != NaN && (typeof angle == 'number' || typeof angle == 'string'))
                    {
                        let si = Math.sin(Number(angle)), co = Math.cos(Number(angle));
                        let m = mat4(co, 0, -si, 0,
                                     0, 1, 0, 0,
                                     si, 0, co, 0,
                                     0, 0, 0, 1);
                        return this.mul(m);
                    }
                else if (typeof angle == 'object' && angle.lenght != 0)
                    {
                        for (let a of angle)
                            {
                                let si = Math.sin(Number(a)), co = Math.cos(Number(a));
                                let m = mat4(co, 0, -si, 0,
                                             0, 1, 0, 0,
                                             si, 0, co, 0,
                                             0, 0, 0, 1);
                                return this.mul(m);
                            }
                    }
                    return mat4(this[0][0], this[0][1], this[0][2], this[0][3],
                                this[1][0], this[1][1], this[1][2], this[1][3],
                                this[2][0], this[2][1], this[2][2], this[2][3],
                                this[3][0], this[3][1], this[3][2], this[3][3]);
                    }//End of 'rotateZ' function
            //Rotation matrix around axis function.
            rotate(angle, v) {
            if (angle != undefined && angle != NaN && (typeof angle == 'number' || typeof angle == 'string'))
                {
                    let si = Math.sin(Number(angle)), co = Math.cos(Number(angle));
                    v = vec3(v).normalize;

                    return mat4(co + v.x * v.x * (1 - co), v.x * v.y * (1 - co) + v.z * si, v.x * v.z * (1 - co) - v.y * si, 0,
                                v.y * v.x * (1 - co) - v.y * si, co + v.y * v.y * (1 - co), v.y * v.z * (1 - co) + v.x * si, 0,
                                v.z * v.x * (1 - co) + v.y * si, v.z * v.y * (1 - co) - v.x * si, co + v.z * v.z * (1 - co), 0,
                                0, 0, 0, 1);

                }
            else if (typeof angle == 'object' && angle.lenght != 0)
                {
                    for (let a of angle)
                        {
                            let si = Math.sin(Number(a)), co = Math.cos(Number(a));
                            v = vec3(v).normalize;

                            return mat4(co + v.x * v.x * (1 - co), v.x * v.y * (1 - co) + v.z * si, v.x * v.z * (1 - co) - v.y * si, 0,
                                v.y * v.x * (1 - co) - v.y * si, co + v.y * v.y * (1 - co), v.y * v.z * (1 - co) + v.x * si, 0,
                                v.z * v.x * (1 - co) + v.y * si, v.z * v.y * (1 - co) - v.x * si, co + v.z * v.z * (1 - co), 0,
                                0, 0, 0, 1);
                        }
                }
                return mat4(this[0][0], this[0][1], this[0][2], this[0][3],
                            this[1][0], this[1][1], this[1][2], this[1][3],
                            this[2][0], this[2][1], this[2][2], this[2][3],
                            this[3][0], this[3][1], this[3][2], this[3][3]);
                }//End of 'rotate' function
            //Transposing matrix function.
            transpose() {
                return mat4(this[0][0], this[1][0], this[2][0], this[3][0],
                            this[0][1], this[1][1], this[2][1], this[3][1],
                            this[0][2], this[1][2], this[2][2], this[3][2],
                            this[0][3], this[1][3], this[2][3], this[3][3]);
            }//End of 'transpose' function.
            //Inversing matrix function.
            inverse() {
                let det = determ(this);
                let m = mat4();

                if (det == 0)
                    return mat4(this[0][0], this[0][1], this[0][2], this[0][3],
                                this[1][0], this[1][1], this[1][2], this[1][3],
                                this[2][0], this[2][1], this[2][2], this[2][3],
                                this[3][0], this[3][1], this[3][2], this[3][3]);
                /* build adjoint matrix */
                m[0][0] =
                +determ3x3(this[1][1], this[1][2], this[1][3],
                                this[2][1], this[2][2], this[2][3],
                                this[3][1], this[3][2], this[3][3]) / det;

                m[1][0] =
                -determ3x3(this[1][0], this[1][2], this[1][3],
                                this[2][0], this[2][2], this[2][3],
                                this[3][0], this[3][2], this[3][3]) / det;

                m[2][0] =
                +determ3x3(this[1][0], this[1][1], this[1][3],
                                this[2][0], this[2][1], this[2][3],
                                this[3][0], this[3][1], this[3][3]) / det;

                m[3][0] =
                -determ3x3(this[1][0], this[1][1], this[1][2],
                                this[2][0], this[2][1], this[2][2],
                                this[3][0], this[3][1], this[3][2]) / det;

                m[0][1] =
                -determ3x3(this[0][1], this[0][2], this[0][3],
                                this[2][1], this[2][2], this[2][3],
                                this[3][1], this[3][2], this[3][3]) / det;

                m[1][1] =
                +determ3x3(this[0][0], this[0][2], this[0][3],
                                this[2][0], this[2][2], this[2][3],
                                this[3][0], this[3][2], this[3][3]) / det;

                m[2][1] =
                -determ3x3(this[0][0], this[0][1], this[0][3],
                                this[2][0], this[2][1], this[2][3],
                                this[3][0], this[3][1], this[3][3]) / det;

                m[3][1] =
                +determ3x3(this[0][0], this[0][1], this[0][2],
                                this[2][0], this[2][1], this[2][2],
                                this[3][0], this[3][1], this[3][2]) / det;


                m[0][2] =
                +determ3x3(this[0][1], this[0][2], this[0][3],
                                this[1][1], this[1][2], this[1][3],
                                this[3][1], this[3][2], this[3][3]) / det;

                m[1][2] =
                -determ3x3(this[0][0], this[0][2], this[0][3],
                                this[1][0], this[1][2], this[1][3],
                                this[3][0], this[3][2], this[3][3]) / det;

                m[2][2] =
                +determ3x3(this[0][0], this[0][1], this[0][3],
                                this[1][0], this[1][1], this[1][3],
                                this[3][0], this[3][1], this[3][3]) / det;

                m[3][2] =
                -determ3x3(this[0][0], this[0][1], this[0][2],
                                this[1][0], this[1][1], this[1][2],
                                this[3][0], this[3][1], this[3][2]) / det;


                m[0][3] =
                -determ3x3(this[0][1], this[0][2], this[0][3],
                                this[1][1], this[1][2], this[1][3],
                                this[2][1], this[2][2], this[2][3]) / det;

                m[1][3] =
                +determ3x3(this[0][0], this[0][2], this[0][3],
                                this[1][0], this[1][2], this[1][3],
                                this[2][0], this[2][2], this[2][3]) / det;

                m[2][3] =
                -determ3x3(this[0][0], this[0][1], this[0][3],
                                this[1][0], this[1][1], this[1][3],
                                this[2][0], this[2][1], this[2][3]) / det;

                m[3][3] =
                +determ3x3(this[0][0], this[0][1], this[0][2],
                                this[1][0], this[1][1], this[1][2],
                                this[2][0], this[2][1], this[2][2]) / det;

                return m;
            }//End of 'reverse' function.
            //Building view matrix function.
            view(loc, at, up1) {
                let dir = vec3(at).sub(vec3(loc)).normalize();
                let right = vec3(dir).cross(vec3(up1)).normalize();
                let up = vec3(right).cross(dir).normalize();

                return mat4(right.x, up.x, -dir.x, 0,
                            right.y, up.y, -dir.y, 0,
                            right.z, up.z, -dir.z, 0,
                            -loc.dot(right), -loc.dot(right), -loc.dot(dir), 1);
            }//End of 'view. function.
            //Building ortho matrix function.
            ortho(left, right, bottom, top, near, far) {
                if (far != undefined && far != NaN)
                    return mat4(2 / (right - left), 0, 0, 0,
                                0, 2 / (top - bottom), 0, 0,
                                0, 0, 2 / (near - far), 0,
                                (right + left) / (left - right), (top + bottom) / (bottom - top), (far + near) / (near - far), 1);
                else if (typeof left == 'object' && left.lenght == 6 && Array.isArray(left))
                    return mat4(2 / (left[1] - left[0]), 0, 0, 0,
                                0, 2 / (left[3] - left[2]), 0, 0,
                                0, 0, 2 / (left[4] - left[5]), 0,
                                (left[1] + left[0]) / (left[0] - right[1]), (left[3] + left[2]) / (left[2] - left[3]), (left[5] + left[4]) / (left[4] - left[5]), 1);
                return mat4();
            }//End of 'ortho' function.
            //Building frustum matrix function.
            frustum(left, right, bottom, top, near, far) {
                if (far != undefined && far != NaN)
                    return mat4(2 * near / (right - left), 0, 0, 0,
                                0, 2 * near / (top - bottom), 0, 0,
                                (right + left) / (right - left), (top + bottom) / (top - bottom), (far + near) / (near - far), -1,
                                0, 0, 2 * near * far / (near - far), 0);
                else if (typeof left == 'object' && left.lenght == 6 && Array.isArray(left))
                    return mat4(2 * left[4] / (left[1] - left[0]), 0, 0, 0,
                                0, 2 * left[4] / (left[3] - left[2]), 0, 0,
                                (left[1] + left[0]) / (left[1] - left[0]), (left[3] + left[2]) / (left[3] - left[2]), (left[5] + left[4]) / (left[4] - left[5]), -1,
                                0, 0, 2 * near * far / (near - far), 0);
            }//End of 'frustum' function.
            //Building array from matrix function.
            toArray() {
                return [this[0][0], this[0][1], this[0][2], this[0][3],
                        this[1][0], this[1][1], this[1][2], this[1][3],
                        this[2][0], this[2][1], this[2][2], this[2][3],
                        this[3][0], this[3][1], this[3][2], this[3][3]];
            }//End of 'toArray' function.
            }

    function determ( m ) {
        return m[0][0] * determ3x3(m[1][1], m[1][2], m[1][3],
               m[2][1], m[2][2], m[2][3],
               m[3][1], m[3][2], m[3][3]) +
        -m[0][1] * determ3x3(m[1][0], m[1][2], m[1][3],
               m[2][0], m[2][2], m[2][3],
               m[3][0], m[3][2], m[3][3]) +
        +m[0][2] * determ3x3(m[1][0], m[1][1], m[1][3],
               m[2][0], m[2][1], m[2][3],
               m[3][0], m[3][1], m[3][3]) +
        -m[0][3] * determ3x3(m[1][0], m[1][1], m[1][2],
               m[2][0], m[2][1], m[2][2],
               m[3][0], m[3][1], m[3][2]);
    }

    function determ3x3( a11, a12, a13, a21, a22, a23, a31, a32, a33 ) {
        return a11 * a22 * a33 + a12 * a23 * a31 + a13 * a21 * a32 -
            a11 * a23 * a32 - a12 * a21 * a33 - a13 * a22 * a31;
    }

    function mat4(...args) {
        return new _mat4(...args);
    }//End of 'mat4' function

    function camSet(loc, at, up) {
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

    let
      canvas,
      gl,
      timeLoc,
      wLoc, WVPloc;
      let indexBuffer;

    // OpenGL initialization function  
    function initGL() {
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
      WVPloc = gl.getUniformLocation(prg, "WVP");

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

    // Main render frame function
    function render() {
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

    exports.initGL = initGL;
    exports.render = render;

    return exports;

})({});
