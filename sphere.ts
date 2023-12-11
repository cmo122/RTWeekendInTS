import { Hittable, HitRecord } from './hittable'
import Vector from './vector'
import Ray from './ray';
import Interval from './interval';
import { Material } from './material'
import AABB from './aabb';

export default class Sphere implements Hittable {
    private center: Vector;
    private radius: number;
    private mat!: Material;
    private bbox: AABB;


    constructor(_center: Vector, _radius: number, _material: Material) {
        this.center = _center;
        this.radius = _radius;
        this.mat = _material
    }

    hit(r: Ray, ray_t: Interval, rec: HitRecord): boolean {
        const oc: Vector = r.origin().subtract(this.center);
        const a: number = r.direction().lengthSquared();
        const half_b: number = Vector.dot(oc, r.direction());
        const c: number = oc.lengthSquared() - this.radius * this.radius;

        const discriminant: number = half_b * half_b - a * c;
        if (discriminant < 0) return false;

        const sqrtd: number = Math.sqrt(discriminant);

        let root: number = (-half_b - sqrtd) / a;
        if (!ray_t.surrounds(root)) {
            root = (-half_b + sqrtd) / a;
            if (!ray_t.surrounds(root)) return false;
        }

        rec.t = root;
        rec.p = r.at(rec.t);
        const outwardNormal: Vector = ((rec.p).subtract(this.center)).divide(this.radius)
        rec.setFaceNormal(r, outwardNormal)
        rec.mat = this.mat;

        return true;
    }

    boundingBox(outputBox: AABB): boolean {
        const radiusVec = new Vector(this.radius, this.radius, this.radius);
        const min = this.center.subtract(radiusVec);
        const max = this.center.add(radiusVec);

        outputBox.copy(new AABB(min, max));

        return true;
    }
}