export default class Vector {
    e: number[];

    constructor(e0: number = 0, e1: number = 0, e2: number = 0) {
        this.e = [e0, e1, e2];
    }

    x(): number { return this.e[0]; }
    y(): number { return this.e[1]; }
    z(): number { return this.e[2]; }

    negative(): Vector {
        return new Vector(-this.e[0], -this.e[1], -this.e[2]);
    }

    get(i: number): number {
        return this.e[i];
    }

    set(i: number, val: number): void {
        this.e[i] = val;
    }

    add(v: Vector): Vector {
        return new Vector(this.e[0] + v.e[0], this.e[1] + v.e[1], this.e[2] + v.e[2]);
    }

    subtract(v: Vector): Vector {
        return new Vector(this.e[0] - v.e[0], this.e[1] - v.e[1], this.e[2] - v.e[2]);
    }

    multiply(t: number): Vector {
        return new Vector(this.e[0] * t, this.e[1] * t, this.e[2] * t);
    }

    static multiply(u: Vector, v: Vector): Vector {
        return new Vector(u.e[0] * v.e[0], u.e[1] * v.e[1], u.e[2] * v.e[2]);
    }

    divide(v: Vector | number): Vector {
        if (v instanceof Vector) {
            return new Vector(this.e[0] / v.e[0], this.e[1] / v.e[1], this.e[2] / v.e[2]);
        } else {
            return new Vector(this.e[0] / v, this.e[1] / v, this.e[2] / v);
        }
    }

    lengthSquared(): number {
        return this.e[0] * this.e[0] + this.e[1] * this.e[1] + this.e[2] * this.e[2];
    }

    length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    static random(min: number = 0, max: number = 1): Vector {
        return new Vector(Math.random() * (max - min) + min, Math.random() * (max - min) + min, Math.random() * (max - min) + min);
    }

    static unitVector(v: Vector): Vector {
        const length = v.length();
        return new Vector(v.e[0] / length, v.e[1] / length, v.e[2] / length);
    }

    static dot(u: Vector, v: Vector): number {
        return u.e[0] * v.e[0] + u.e[1] * v.e[1] + u.e[2] * v.e[2];
    }

    random(): Vector {
        return new Vector(Math.random(), Math.random(), Math.random());
    }

    randomMinMax(min: number, max: number): Vector {
        return new Vector(
            Math.random() * (max - min) + min,
            Math.random() * (max - min) + min,
            Math.random() * (max - min) + min
        );
    }

    static randomInUnitSphere(): Vector {
        while (true) {
            const p = Vector.random(-1, 1);
            if (p.lengthSquared() < 1) return p;
        }
    }

    static randomUnitVector(): Vector {
        return Vector.unitVector(Vector.randomInUnitSphere());
    }

    randomOnHemisphere(normal: Vector): Vector {
        const onUnitSphere = Vector.randomUnitVector();
        if (Vector.dot(onUnitSphere, normal) > 0) {
            return onUnitSphere;
        } else {
            return new Vector(-onUnitSphere.e[0], -onUnitSphere.e[1], -onUnitSphere.e[2]);
        }
    }

    nearZero(): boolean {
        const s = 1e-8;
        return Math.abs(this.e[0]) < s && Math.abs(this.e[1]) < s && Math.abs(this.e[2]) < s;
    }

    static reflect(v: Vector, n: Vector): Vector {
        return (v).subtract(((n).multiply(Vector.dot(v, n))).multiply(2));
    }

    static refract(uv: Vector, n: Vector, etai_over_etat: number): Vector {
        const cos_theta = Math.min(this.dot(uv.negative(), n), 1.0);
        const r_out_perp = uv.add(n.multiply(cos_theta)).multiply(etai_over_etat);
        const r_out_parallel = n.multiply(-Math.sqrt(Math.abs(1.0 - r_out_perp.lengthSquared())))
        return r_out_perp.add(r_out_parallel);
    }

    static cross(u: Vector, v: Vector): Vector {
        return new Vector(
            u.e[1] * v.e[2] - u.e[2] * v.e[1],
            u.e[2] * v.e[0] - u.e[0] * v.e[2],
            u.e[0] * v.e[1] - u.e[1] * v.e[0]
        );
    }

    static randomInUnitDisk(): Vector {
        while (true) {
            const p = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1, 0);
            if (p.lengthSquared() < 1) return p;
        }
    }
}