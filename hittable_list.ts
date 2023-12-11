import { Hittable, HitRecord } from './hittable'
import Ray from './ray';
import Interval from './interval'
import AABB from './aabb';

export default class HittableList implements Hittable {
    public objects: Hittable[];
    private bbox: AABB;

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
        const tempRec: HitRecord = new HitRecord();
        let hitAnything: boolean = false;
        let closestSoFar: number = ray_t.max;

        for (const object of this.objects) {
            const objectHit = object.hit(r, new Interval(ray_t.min, closestSoFar), tempRec);
            if (objectHit) {
                hitAnything = true;
                closestSoFar = tempRec.t;
                Object.assign(rec, tempRec); 
            }
        }

        return hitAnything;
    }

    boundingBox(outputBox: AABB): boolean {
        outputBox.copy(this.bbox);
        return true;
    }
}