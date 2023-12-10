import Ray from './ray';
import Color from './color';
import Point from './vector'
import { Hittable, HitRecord } from './hittable';
import Interval from './interval';
import Vector from './vector';
import * as fs from 'fs';
import { degreesToRadians } from './rtweekend';
import { GPU } from 'gpu.js';
import { useEffect, useRef } from 'react'

interface ScatterResult {
    attenuation: Color;
    scattered: Ray;
}

const gpu = new GPU();

export default class Camera {
    /* Public Camera Parameters Here */
    aspectRatio: number = 1.0;
    imageWidth: number = 100;
    samples_per_pixel: number = 100;
    imageHeight!: number;
    center: Vector = new Vector(0, 0, 0);
    pixel00Loc!: Vector;
    pixelDeltaU!: Vector;
    pixelDeltaV!: Vector;
    maxDepth: number = 10;
    vfov: number = 90;
    lookFrom: Point = new Point(0, 0, -1)
    lookAt: Point = new Point(0, 0, 0)
    vup: Point = new Vector(0, 1, 0)
    defocusAngle: number = 0;
    focusDistance: number = 10;
    u!: Vector
    v!: Vector
    w!: Vector
    defocusDiskU!: Vector;
    defocusDiskV!: Vector;


    render(world: Hittable): void {
        this.initialize();

        console.log(`P3\n${this.imageWidth} ${this.imageHeight}\n255\n`);
        let ppmContent: string = `P3\n${this.imageWidth} ${this.imageHeight}\n255\n`;
        for (let j = 0; j < this.imageHeight; ++j) {
            console.log(`\rScanlines remaining: ${this.imageHeight - j} `);
            for (let i = 0; i < this.imageWidth; ++i) {
                let pixelColor: Color = new Color(0, 0, 0)
                for (let sample = 0; sample < this.samples_per_pixel; ++sample) {
                    const r: Ray = this.getRay(i, j);
                    pixelColor = pixelColor.add(this.rayColor(r, this.maxDepth, world))
                }
                const outputColor = Color.writeColor(pixelColor, this.samples_per_pixel);
                ppmContent += outputColor;
            }
        }
        fs.writeFileSync('output.ppm', ppmContent, 'utf-8');
        console.log("\rDone.                 \n");
    }

    private initialize(): void {
        this.imageHeight = Math.max(1, Math.floor(this.imageWidth / this.aspectRatio));

        this.center = this.lookFrom

        // Constants for viewport and focal length
        const theta = degreesToRadians(this.vfov)
        const h = Math.tan(theta / 2)
        const viewportHeight = 2 * h * this.focusDistance;
        const viewportWidth = viewportHeight * (this.imageWidth / this.imageHeight);

        // Calculate the u,v,w unit basis vectors for the camera coordinate frame.
        this.w = Vector.unitVector(this.lookFrom.subtract(this.lookAt));
        this.u = Vector.unitVector(Vector.cross(this.vup, this.w));
        this.v = Vector.cross(this.w, this.u);

        // Calculate the vectors across the horizontal and down the vertical viewport edges.
        const viewportU: Vector = this.u.multiply(viewportWidth)
        const negativeV = this.v.negative()
        const viewportV: Vector = negativeV.multiply(viewportHeight)

        // Calculate delta vectors
        this.pixelDeltaU = viewportU.divide(this.imageWidth);
        this.pixelDeltaV = viewportV.divide(this.imageHeight);

        // Calculate pixel00 location
        const viewportUpperLeft = this.center
            .subtract(this.w.multiply(this.focusDistance))
            .subtract(viewportU.divide(2))
            .subtract(viewportV.divide(2));

        this.pixel00Loc = viewportUpperLeft.add(this.pixelDeltaU.multiply(0.5).add(this.pixelDeltaV.multiply(0.5)));

        // Calculate the camera defocus disk basis vectors.
        const defocusRadius: number = this.focusDistance * Math.tan(degreesToRadians(this.defocusAngle / 2))
        this.defocusDiskU = this.u.multiply(defocusRadius)
        this.defocusDiskV = this.v.multiply(defocusRadius)
    }

    pixelSampleSquare(): Vector {
        const px: number = -0.5 + Math.random();
        const py: number = -0.5 + Math.random();
        const deltaUScaled = this.pixelDeltaU.multiply(px)
        const deltaVScaled = this.pixelDeltaV.multiply(py)
        return (deltaUScaled).add(deltaVScaled);
    }

    getRay(i: number, j: number): Ray {
        // Get a randomly-sampled camera ray for the pixel at location i,j, originating from
        // the camera defocus disk.

        const pixel_center: Vector = this.pixel00Loc
            .add(this.pixelDeltaU.multiply(i))
            .add(this.pixelDeltaV.multiply(j));
        const pixel_sample: Vector = pixel_center.add(this.pixelSampleSquare());

        const ray_origin: Vector = (this.defocusAngle <= 0) ? this.center : this.defocusDiskSample()
        const ray_direction: Vector = pixel_sample.subtract(ray_origin);

        return new Ray(ray_origin, ray_direction);
    }

    rayColor(r: Ray, depth: number, world: Hittable): Color {
        const rec: HitRecord = new HitRecord();

        if (depth <= 0) {
            return new Color(0, 0, 0)
        }

        if (world.hit(r, new Interval(0.001, Infinity), rec)) {
            let scattered: Ray = new Ray();
            let attenuation: Color = new Color();
            const scatterResult: ScatterResult | null = rec.mat.scatter(r, rec, attenuation, scattered)
            if (scatterResult !== null) {
                if (Vector.dot(scatterResult.scattered.direction(), rec.normal)) {
                    const colorFromScatteredRay = this.rayColor(scatterResult.scattered, depth - 1, world);
                    const result: Color = Vector.multiply(scatterResult.attenuation, colorFromScatteredRay)
                    return result
                }

            }

            return new Color(0, 0, 0);
        }

        const unitDirection = Vector.unitVector(r.direction());
        const a = 0.5 * (unitDirection.y() + 1.0);

        const color1 = new Color(1.0, 1.0, 1.0);
        const color2 = new Color(0.5, 0.7, 1.0);

        return color1.multiply(1.0 - a).add(color2.multiply(a));
    }

    defocusDiskSample(): Point {
        // Returns a random point in the camera defocus disk.
        const p = Point.randomInUnitDisk()
        const uScaled = this.defocusDiskU.multiply(p.get(0))
        const vScaled = this.defocusDiskV.multiply(p.get(1))
        return this.center.add(uScaled).add(vScaled)
    }
}