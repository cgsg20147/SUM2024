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
                return vec3(this.x, this.y, this.z);
            return vec3(this.x, this.y, this.z).div(len);
        }
        cross(v) {
            if (typeof v == 'object')
                return vec3(this.y * v.z - this.z * v.y, v.x * this.z - v.z * this.x, this.x * v.y - this.y * v.x);
            else if (typeof v == 'number' || typeof v == 'string')
                return vec3(Number(v) * (this.y - this.z), Number(v) * (this.z - this.x), Number(v) * (this.x - this.y));
            return vec3(this.x, this.y, this.z).transform(mat4().rotate(90, vec3(1, 1, 1)));
        }
        sub(v) {
            if (typeof v == 'number' || typeof v == 'string' )
                return vec3(this.x - v, this.y - v, this.z - v);
            else if (typeof v == 'object')
                return vec3(this.x - v.x, this.y - v.y, this.z - v.z);
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
        toArray() {
            return [this.x, this.y, this.z];
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
                    v = vec3(v).normalize();

                    return mat4(co + v.x * v.x * (1 - co), v.x * v.y * (1 - co) + v.z * si, v.x * v.z * (1 - co) - v.y * si, 0,
                                v.y * v.x * (1 - co) - v.z * si, co + v.y * v.y * (1 - co), v.y * v.z * (1 - co) + v.x * si, 0,
                                v.z * v.x * (1 - co) + v.y * si, v.z * v.y * (1 - co) - v.x * si, co + v.z * v.z * (1 - co), 0,
                                0, 0, 0, 1);

                }
            else if (typeof angle == 'object' && angle.lenght != 0)
                {
                    for (let a of angle)
                        {
                            let si = Math.sin(Number(a)), co = Math.cos(Number(a));
                            v = vec3(v).normalize();

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
                            -loc.dot(right), -loc.dot(up), loc.dot(dir), 1);
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
    function camSet(...args) {
        return new _cam(...args);
    }
    function projSet(w, h) {
        let rx = window.projSize, ry = window.projSize;

        if (w > h)
            rx *= w / h;
        else
            ry *= h / w;
        return mat4().frustum(-rx / 2, rx / 2, -ry / 2, ry / 2, window.projDist, window.projFarClip);
    }

    class _vFormat {
        constructor (numOfParams) {
          this.paramName = new Array(numOfParams);
          this.offset = new Array(numOfParams);
        }
      }
      function setVertexFormat(numOfParams, paramNames, offsets) {
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
      function setVertex(...args) {
        return new _vertex(...args);
      }
      function autoNormals(pos, ind) {
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
      function glInit(canvas, w, h, clearColor) {
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

    let gl;

    // OpenGL initialization function  
    function initGL() {
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
    function render() {                                               
      {
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

    exports.initGL = initGL;
    exports.render = render;

    return exports;

})({});
