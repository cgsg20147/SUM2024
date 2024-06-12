import {vec3} from "./vec3.js"
export {vec3};

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
            let n = Number(m);
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

export function mat4(...args) {
    return new _mat4(...args);
}//End of 'mat4' function