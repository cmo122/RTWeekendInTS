import { Hittable, HitRecord } from './hittable'
import Vector from './vector'
import Ray from './ray';
import Interval from './interval';

export default class Sphere implements Hittable {
    private center: Vector;
    private radius: number;

    constructor(_center: Vector, _radius: number) {
        this.center = _center;
        this.radius = _radius;
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

        return true;
    }
}