import * as fs from 'fs';
import Ray from './ray'
import Vector from './vector';
import Color from './color'
import { Hittable, HitRecord } from './hittable'
import HittableList from './hittable_list'
import Sphere from './sphere'
import Interval from './interval';
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

const ray_color = (r: Ray, world: Hittable): Color => {
    const rec: HitRecord = new HitRecord();
    if (world.hit(r, new Interval(0, common.infinity), rec)) {
        return (rec.normal.add(new Color(1, 1, 1))).multiply(0.5)
    }

    const unitDirection: Vector = Vector.unitVector(r.direction());
    const a: number = 0.5 * (unitDirection.y() + 1.0);
    const color1: Color = new Color(1.0, 1.0, 1.0);
    const color2: Color = new Color(0.5, 0.7, 1.0);

    return (color1.multiply(1.0 - a)).add(color2.multiply(a));
}

const main = (): any => {
    // Image

    const aspect_ratio = 16.0 / 9.0;
    const image_width = 400;

    // Calculate the image height, and ensure that it's at least 1.
    let image_height = image_width / aspect_ratio;
    image_height = (image_height < 1) ? 1 : image_height;

    // World
    const world: HittableList = new HittableList();
    world.add(new Sphere(new Point(0, 0, -1), 0.5));
    world.add(new Sphere(new Point(0, -100.5, -1), 100));

    // Camera

    const focal_length = 1.0;
    const viewport_height = 2.0;
    const viewport_width = viewport_height * (image_width / image_height);
    const camera_center = new Point(0, 0, 0);

    // Calculate the vectors across the horizontal and down the vertical viewport edges.
    const viewport_u = new Vector(viewport_width, 0, 0);
    const viewport_v = new Vector(0, -viewport_height, 0);

    // Calculate the horizontal and vertical delta vectors from pixel to pixel.
    const pixel_delta_u = viewport_u.divide(image_width);
    const pixel_delta_v = viewport_v.divide(image_height);

    // Calculate the location of the upper left pixel.
    const viewport_upper_left = camera_center
        .subtract(new Vector(0, 0, focal_length))
        .subtract(viewport_u.divide(2))
        .subtract(viewport_v.divide(2));

    const pixel00_loc = viewport_upper_left.add(pixel_delta_u.add(pixel_delta_v).multiply(0.5));


    //Render

    let ppmContent = `P3\n${image_width} ${image_height}\n255\n`;

    let tempPPMContent = '';

    for (let j = 0; j < image_height; ++j) {
        for (let i = 0; i < image_width; ++i) {
            const pixelCenter = pixel00_loc
                .add(pixel_delta_u.multiply(i))
                .add(pixel_delta_v.multiply(j));

            const rayDirection = pixelCenter.subtract(camera_center);
            const ray = new Ray(camera_center, rayDirection);

            const pixelColor = ray_color(ray, world);
            tempPPMContent += Color.writeColor(pixelColor);
        }
    }

    // Save PPM content to a file
    ppmContent += tempPPMContent;
    fs.writeFileSync('output.ppm', ppmContent, 'utf8');
}

main()