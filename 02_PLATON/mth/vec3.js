import {mat4} from "./mat4.js"

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

export function vec3( ...args ) {
    return new _vec3(...args);
} //End of 'vec3' function