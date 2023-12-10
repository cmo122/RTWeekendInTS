import { Hittable, HitRecord } from './hittable'
import Ray from './ray';
import Interval from './interval'
import AABB from './aabb';

export default class HittableList implements Hittable {
    public objects: Hittable[];

    constructor() {
        this.objects = [];
    }

    get(): Hittable[] {
        return this.objects
    }

    clear(): void {
        this.objects = [];
    }

    add(object: Hittable): void {
        this.objects.push(object);
    }

    hit(r: Ray, ray_t: Interval, rec: HitRecord): boolean {
        const tempRec: HitRecord = new HitRecord(); // Assuming HitRecord has appropriate constructor
        let hitAnything: boolean = false;
        let closestSoFar: number = ray_t.max;

        for (const object of this.objects) {
            const objectHit = object.hit(r, new Interval(ray_t.min, closestSoFar), tempRec);
            if (objectHit) {
                hitAnything = true;
                closestSoFar = tempRec.t;
                Object.assign(rec, tempRec); // Assigning properties from tempRec to rec
            }
        }

        return hitAnything;
    }

    boundingBox(outputBox: AABB): boolean {
        if (this.objects.length === 0) return false;

        const tempBox: AABB = new AABB();
        let firstBox: boolean = true;

        for (const object of this.objects) {
            if (!object.boundingBox(tempBox)) return false;
            outputBox = firstBox ? tempBox : AABB.surroundingBox(outputBox, tempBox)
            firstBox = true;
        }
        return true;

    }
}
