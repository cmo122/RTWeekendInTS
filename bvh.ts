import { Hittable, HitRecord } from './hittable'
import HittableList from './hittable_list'
import AABB from './aabb';
import Ray from './ray';
import Interval from './interval';

export default class BVHNode implements Hittable {
    left: BVHNode | null | Hittable;
    right: BVHNode | null | Hittable;
    bbox: AABB;

    constructor(
        srcObjects: Hittable[] | HittableList,
        start: number,
        end: number,
    ) {
        let objects: any[] | HittableList

        if (srcObjects instanceof HittableList) {
            objects = srcObjects.get()
        }
        else {
            objects = srcObjects
        }

        const axis = Math.floor(Math.random() * 3);
        const comparator = (axis === 0) ? BVHNode.boxXCompare :
            (axis === 1) ? BVHNode.boxYCompare :
                BVHNode.boxZCompare;

        const objectSpan = end - start;

        if (objectSpan === 1) {
            this.left = objects[start];
            this.right = objects[start];
        } else if (objectSpan === 2) {
            if (comparator(objects[start], objects[start + 1])) {
                this.left = objects[start];
                this.right = objects[start + 1];
            } else {
                this.left = objects[start + 1];
                this.right = objects[start];
            }
        } else {
            objects.sort((a, b) => {
                if (comparator(a, b)) {
                    return -1;
                } else {
                    return 1;
                }
            });

            const mid = start + Math.floor(objectSpan / 2);
            this.left = new BVHNode(objects, start, mid);
            this.right = new BVHNode(objects, mid, end);
        }

        let boxLeft: AABB = new AABB();
        let boxRight: AABB = new AABB();

        if (this.left && this.right) {
            if (!this.left!.boundingBox(boxLeft) || !this.right!.boundingBox(boxRight)) {
                console.error("No bounding box in BVHNode constructor.");
            }
        }

        this.bbox = AABB.surroundingBox(boxLeft, boxRight);
    }

    boundingBox(outputBox: AABB): boolean {
        outputBox.copy(this.bbox);
        return true;
    }

    hit(r: Ray, rayT: Interval, rec: HitRecord): boolean {
        if (!this.bbox.hit(r, rayT.min, rayT.max)) return false;

        const hitLeft: boolean = this.left?.hit(r, rayT, rec) || false;

        const newInterval: Interval = hitLeft
            ? new Interval(rayT.min, rec.t)
            : new Interval(rayT.min, rayT.max);

        const hitRight: boolean = this.right?.hit(r, newInterval, rec) || false;

        return hitLeft || hitRight;
    }

    static boxXCompare(a: Hittable, b: Hittable): boolean {
        return BVHNode.boxCompare(a, b, 0);
    }

    static boxYCompare(a: Hittable, b: Hittable): boolean {
        return BVHNode.boxCompare(a, b, 1);
    }

    static boxZCompare(a: Hittable, b: Hittable): boolean {
        return BVHNode.boxCompare(a, b, 2);
    }

    static boxCompare(a: Hittable, b: Hittable, axisIndex: number): boolean {
        if (!a || !b) return false;

        const boxA = new AABB();
        const boxB = new AABB();

        if (!a.boundingBox(boxA) || !b.boundingBox(boxB)) {
            console.error("No bounding box in bvh_node constructor.");
            return false;
        }

        return boxA.min().e[axisIndex] < boxB.min().e[axisIndex];
    }
}