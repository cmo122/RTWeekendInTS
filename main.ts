
import Vector from './vector';
import Color from './color'
import HittableList from './hittable_list'
import Sphere from './sphere'
import Camera from './camera'
import { Lambertian, Metal, Dielectric, Material } from './material';
import BVHNode from './bvh'

class Point extends Vector { }

export const main = (): void => {
    const world: HittableList = new HittableList();
    const spheres1: HittableList = new HittableList();

    // Assuming the definitions of lambertian, dielectric, and metal materials
    const material_ground: Lambertian = new Lambertian(new Color(0.5, 0.5, 0.5));
    // const material_center: Lambertian = new Lambertian(new Color(0.1, 0.2, 0.5));
    // const material_left: Dielectric = new Dielectric(1.5); // Dielectric material with refractive index 1.5
    // const material_right: Metal = new Metal(new Color(0.8, 0.6, 0.2), 0.0); // Metal with specific color and fuzziness

    spheres1.add(new Sphere(new Point(0.0, -1000, 0.0), 1000.0, material_ground));
    // spheres1.add(new Sphere(new Point(-1.0, 0.0, -1.0), 0.5, material_left));
    // spheres1.add(new Sphere(new Point(-1.0, 0.0, -1.0), -0.4, material_left));
    // spheres1.add(new Sphere(new Point(1.0, 0.0, -1.0), 0.5, material_right));
    // spheres1.add(new Sphere(new Point(0.0, 0.0, -1.0), 0.5, material_center));

    for (let a = -11; a < 11; a++) {
        for (let b = -11; b < 11; b++) {
            let chooseMat = Math.random();
            let center = new Vector(a + 0.9 * Math.random(), 0.2, b + 0.9 * Math.random());

            if (center.subtract(new Vector(4, 0.2, 0)).length() > 0.9) {
                let sphereMaterial: Material;

                if (chooseMat < 0.8) {
                    // Diffuse
                    let albedo = Vector.multiply(Color.random(), Color.random());
                    sphereMaterial = new Lambertian(albedo);
                    spheres1.add(new Sphere(center, 0.2, sphereMaterial));
                } else if (chooseMat < 0.95) {
                    // Metal
                    let albedo = Color.random(0.5, 1);
                    let fuzz = Math.random() * 0.5;
                    sphereMaterial = new Metal(albedo, fuzz);
                    spheres1.add(new Sphere(center, 0.2, sphereMaterial));
                } else {
                    // Glass
                    sphereMaterial = new Dielectric(1.5);
                    spheres1.add(new Sphere(center, 0.2, sphereMaterial));
                }
            }
        }
    }

    let material1 = new Dielectric(1.5);
    spheres1.add(new Sphere(new Vector(0, 1, 0), 1.0, material1));

    let material2 = new Lambertian(new Color(0.4, 0.2, 0.1));
    spheres1.add(new Sphere(new Vector(-4, 1, 0), 1.0, material2));

    let material3 = new Metal(new Color(0.7, 0.6, 0.5), 0.0);
    spheres1.add(new Sphere(new Vector(4, 1, 0), 1.0, material3));

    world.add(new BVHNode(spheres1, 0, spheres1.getLength()))
    console.log(world.get())

    const cam: Camera = new Camera();

    cam.aspectRatio = 16.0 / 9.0;
    cam.imageWidth = 400;
    cam.samples_per_pixel = 100;
    cam.maxDepth = 50;
    cam.vfov = 20;
    cam.lookFrom = new Point(13, 2, 3);
    cam.lookAt = new Point(0, 0, 0);
    cam.vup = new Vector(0, 1, 0);

    cam.defocusAngle = 0;
    cam.focusDistance = 10;

    cam.render(world);
};