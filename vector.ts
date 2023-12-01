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
}

function random(): Vector {
    return new Vector(Math.random(), Math.random(), Math.random());
  }

  function randomMinMax(min: number, max: number): Vector {
    return new Vector(
      Math.random() * (max - min) + min,
      Math.random() * (max - min) + min,
      Math.random() * (max - min) + min
    );
  }

  

  function cross(u: Vector, v: Vector): Vector {
    return new Vector(
      u.e[1] * v.e[2] - u.e[2] * v.e[1],
      u.e[2] * v.e[0] - u.e[0] * v.e[2],
      u.e[0] * v.e[1] - u.e[1] * v.e[0]
    );
  }

//   function unitVector(v: Vector): Vector {
//     const length = v.length();
//     return new Vector(v.e[0] / length, v.e[1] / length, v.e[2] / length);
//   }

//   function randomInUnitDisk(): Vector {
//     while (true) {
//       const p = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1, 0);
//       if (p.lengthSquared() < 1) return p;
//     }
//   }

//   function randomInUnitSphere(): Vector {
//     while (true) {
//       const p = Vector.random(-1, 1);
//       if (p.lengthSquared() < 1) return p;
//     }
//   }

//   function randomUnitVector(): Vector {
//       return this.unitVector(this.randomInUnitSphere());
//     }
    

//   function randomOnHemisphere(normal: Vector): Vector {
//     const onUnitSphere = this.randomUnitVector();
//     if (this.dot(onUnitSphere, normal) > 0) {
//       return onUnitSphere;
//   } else {
//       return new Vector(-onUnitSphere.e[0], -onUnitSphere.e[1], -onUnitSphere.e[2]);
//   }
//   }

//   function reflect(v: Vector, n: Vector): Vector {
//     return (( n).multiply(2 * this.dot(v, n),)).subtract(v);
//   }

// //   function refract(uv: Vector, n: Vector, etai_over_etat: number): Vector {
// //     const cos_theta = Math.min(this.dot(uv.negative(), n), 1.0);
// //     const r_out_perp = Vector.multiply(etai_over_etat, Vector.add(uv, Vector.multiply(cos_theta, n)));
// //     const r_out_parallel = Vector.multiply(
// //       -Math.sqrt(Math.abs(1.0 - r_out_perp.lengthSquared())),
// //       n
// //     );
// //     return Vector.add(r_out_perp, r_out_parallel);
// //   }

//   function lengthSquared(v: Vector): number {
//     return v.e[0] * v.e[0] + v.e[1] * v.e[1] + v.e[2] * v.e[2];
//   }

//   function negate(v: Vector): Vector {
//     return new Vector(-v.e[0], -v.e[1], -v.e[2]);
//   }

//   function add(u: Vector, v: Vector): Vector {
//     return new Vector(u.e[0] + v.e[0], u.e[1] + v.e[1], u.e[2] + v.e[2]);
//   }

//   function subtract(u: Vector, v: Vector): Vector {
//     return new Vector(u.e[0] - v.e[0], u.e[1] - v.e[1], u.e[2] - v.e[2]);
//   }

//   function multiply(v: Vector, t: number): Vector {
//     return new Vector(t * v.e[0], t * v.e[1], t * v.e[2]);
//   }

//   function divide(v: Vector, t: number): Vector {
//     return v.multiply(t);
//   }

//   toString(): string {
//     return `${this.e[0]} ${this.e[1]} ${this.e[2]}`;
//   }