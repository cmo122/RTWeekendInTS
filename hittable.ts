import Ray from './ray'
import Vector from './vector'
import Interval from './interval';
import { Material } from './material';
import AABB from './aabb'

export class HitRecord {
    public p: Vector;
    public normal: Vector;
    public t: number;
    public frontFace: boolean;
    public mat!: Material;

    constructor(p: Vector = new Vector, normal: Vector = new Vector, t: number = 0, frontFace: boolean = false) {
        this.p = p;
        this.normal = normal;
        this.t = t;
        this.frontFace = frontFace;
    }

    setFaceNormal(r: Ray, outwardNormal: Vector): void {
        this.frontFace = Vector.dot(r.direction(), outwardNormal) < 0;
        this.normal = this.frontFace ? outwardNormal : outwardNormal.negative();
    }
}

export interface Hittable {
    hit(r: Ray, ray_t: Interval, rec: HitRecord): boolean;
    boundingBox(outputBox: AABB): boolean;
}
