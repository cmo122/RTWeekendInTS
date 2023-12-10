
import Vector from './vector';
import Color from './color'
import { Hittable } from './hittable'
import HittableList from './hittable_list'
import Sphere from './sphere'
import Camera from './camera'
import { Lambertian, Metal, Dielectric } from './material';
import BVHNode from './bvh'

class Point extends Vector { }

export const main = (): void => {
    const world: HittableList = new HittableList();
    const spheres1: HittableList = new HittableList();

    // Assuming the definitions of lambertian, dielectric, and metal materials
    const material_ground: Lambertian = new Lambertian(new Color(0.8, 0.8, 0.0));
    const material_center: Lambertian = new Lambertian(new Color(0.1, 0.2, 0.5));
    const material_left: Dielectric = new Dielectric(1.5); // Dielectric material with refractive index 1.5
    const material_right: Metal = new Metal(new Color(0.8, 0.6, 0.2), 0.0); // Metal with specific color and fuzziness

    world.add(new Sphere(new Point(0.0, -100.5, -1.0), 100.0, material_ground)); // Large ground sphere

    spheres1.add(new Sphere(new Point(0, 1, 0), 1, material_right));
    spheres1.add(new Sphere(new Point(4, 1, 0), 1, material_right));
    spheres1.add(new Sphere(new Point(-4, 1, 0), 1, material_right));

    world.add(new BVHNode(spheres1, 0, 1))

    const cam: Camera = new Camera();

    cam.aspectRatio = 16.0 / 9.0;
    cam.imageWidth = 400;
    cam.samples_per_pixel = 200;
    cam.maxDepth = 50;
    cam.vfov = 90;
    cam.lookFrom = new Point(-2, 2, 1)
    cam.lookAt = new Point(0, 0, -1)
    cam.vup = new Vector(0, 1, 0)

    cam.defocusAngle = 0;
    cam.focusDistance = 10;

    cam.render(world);
};

// Invoke the main function
main();