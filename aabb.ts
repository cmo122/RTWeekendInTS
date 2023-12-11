import Point from './vector';
import Ray from './ray'

export default class AABB {
    minimum: Point;
    maximum: Point;

    constructor(a: Point = new Point(), b: Point = new Point()) {
        this.minimum = a;
        this.maximum = b;
    }

    min(): Point {
        return this.minimum;
    }

    max(): Point {
        return this.maximum;
    }

    copy(other: AABB): void {
        if (!other) return
        this.minimum = other.minimum
        this.maximum = other.maximum
    }

    hit(r: Ray, t_min: number, t_max: number): boolean {
        for (let a = 0; a < 3; a++) {
            const invD = 1.0 / r.direction().get(a);
            let t0 = (this.minimum.get(a) - r.origin().get(a)) * invD;
            let t1 = (this.maximum.get(a) - r.origin().get(a)) * invD;

            if (invD < 0.0) {
                [t0, t1] = [t1, t0];
            }

            t_min = t0 > t_min ? t0 : t_min;
            t_max = t1 < t_max ? t1 : t_max;

            if (t_max <= t_min) {
                return false;
            }
        }
        return true;
    }

    static surroundingBox(box0: AABB, box1: AABB): AABB {

        if (!box0 || !box1) {
            console.log(box0, box1)
            throw new Error("Invalid AABB input or null encountered.");
        }

        const small = new Point(
            Math.min(box0.min().x(), box1.min().x()),
            Math.min(box0.min().y(), box1.min().y()),
            Math.min(box0.min().z(), box1.min().z())
        );

        const big = new Point(
            Math.max(box0.max().x(), box1.max().x()),
            Math.max(box0.max().y(), box1.max().y()),
            Math.max(box0.max().z(), box1.max().z())
        );

        return new AABB(small, big)
    }

}