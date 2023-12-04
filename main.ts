
import Ray from './ray'
import Vector from './vector';
import Color from './color'
import { Hittable, HitRecord } from './hittable'
import HittableList from './hittable_list'
import Sphere from './sphere'
import Interval from './interval';
import Camera from './camera'
import { Lambertian, Metal, Material, Dielectric } from './material';
import * as common from "./rtweekend"

class Point extends Vector { }

function hitSphere(center: Point, radius: number, r: Ray): number {
    const oc: Vector = (r.origin()).subtract(center);
    const a: number = r.direction().lengthSquared();
    const half_b: number = Vector.dot(oc, r.direction());
    const c: number = oc.lengthSquared() - radius * radius;
    const discriminant: number = half_b * half_b - a * c;
    if (discriminant < 0) {
        return -1.0;
    } else {
        return (-half_b - Math.sqrt(discriminant)) / (a);
    }
}

const main = (): void => {
    const world: HittableList = new HittableList();

    // Assuming the definitions of lambertian, dielectric, and metal materials
    const material_ground: Lambertian = new Lambertian(new Color(0.8, 0.8, 0.0));
    const material_center: Lambertian = new Lambertian(new Color(0.1, 0.2, 0.5));
    const material_left: Dielectric = new Dielectric(1.5); // Dielectric material with refractive index 1.5
    const material_right: Metal = new Metal(new Color(0.8, 0.6, 0.2), 0.0); // Metal with specific color and fuzziness

    world.add(new Sphere(new Vector(0.0, -100.5, -1.0), 100.0, material_ground)); // Large ground sphere
    world.add(new Sphere(new Vector(0.0, 0.0, -1.0), 0.5, material_center)); // Small center sphere
    world.add(new Sphere(new Vector(-1.0, 0.0, -1.0), 0.5, material_left)); // Left sphere (Dielectric)
    world.add(new Sphere(new Vector(-1.0, 0.0, -1.0), -0.4, material_left)); // Inner sphere (Dielectric)
    world.add(new Sphere(new Vector(1.0, 0.0, -1.0), 0.5, material_right)); // Right sphere (Metal)



    const cam: Camera = new Camera();

    cam.aspectRatio = 16.0 / 9.0;
    cam.imageWidth = 400;
    cam.samples_per_pixel = 100;
    cam.maxDepth = 50;
    cam.vfov = 20;
    cam.lookFrom = new Point(-2, 2, 1)
    cam.lookAt = new Point(0, 0, -1)
    cam.vup = new Vector(0, 1, 0)

    cam.defocusAngle = 10.0;
    cam.focusDistance = 3.4;

    cam.render(world);
};

// Invoke the main function
main();