import { HitRecord } from './hittable';
import Color from './color';
import Ray from './ray';
import Vector from './vector';

export interface Material {
    scatter(rIn: Ray, rec: HitRecord, attenuation: Color, scattered: Ray): { attenuation: Color, scattered: Ray };
}

export class Lambertian implements Material {
    private albedo: Color;

    constructor(a: Color) {
        this.albedo = a;
    }

    scatter(rIn: Ray, rec: HitRecord, attenuation: Color, scattered: Ray): { attenuation: Color, scattered: Ray } {
        let scatterDirection = rec.normal.add(Vector.randomUnitVector());

        // Catch degenerate scatter direction
        const finalScatterDirection = scatterDirection.nearZero() ? rec.normal : scatterDirection;

        if (scatterDirection.nearZero()) {
            scatterDirection = rec.normal;
        }

        scattered = new Ray(rec.p, scatterDirection);
        attenuation = this.albedo;
        return { scattered, attenuation }
    }
}

export class Metal implements Material {
    public albedo: Color;
    public fuzz: number

    constructor(a: Color, f: number) {
        this.albedo = a;
        this.fuzz = f < 1 ? f : 1;
    }

    scatter(rIn: Ray, rec: HitRecord, attenuation: Color, scattered: Ray): { attenuation: Color, scattered: Ray } {
        let reflected = Vector.reflect(Vector.unitVector(rIn.direction()), rec.normal)

        // Catch degenerate scatter direction

        scattered = new Ray(rec.p, reflected.add(Vector.randomUnitVector().multiply(this.fuzz)));
        attenuation = this.albedo;
        return { scattered, attenuation }
    }
}

export class Dielectric implements Material {
    public ir: number;

    constructor(indexOfRefraction: number) {
        this.ir = indexOfRefraction
    }

    scatter(rIn: Ray, rec: HitRecord, attenuation: Color, scattered: Ray): { attenuation: Color, scattered: Ray } {
        attenuation = new Color(1.0, 1.0, 1.0)
        const refractionRatio: number = rec.frontFace ? (1.0 / this.ir) : this.ir;

        const unitDirection: Vector = Vector.unitVector(rIn.direction())

        const cos_theta: number = Math.min(Vector.dot(unitDirection.negative(), rec.normal), 1.0);
        const sin_theta: number = Math.sqrt(1.0 - cos_theta * cos_theta)

        const noRefract: boolean = refractionRatio * sin_theta > 1.0;
        let direction: Vector;

        if (noRefract || this.reflectance(cos_theta, refractionRatio) > Math.random()) {
            direction = Vector.reflect(unitDirection, rec.normal)
        }
        else {
            direction = Vector.refract(unitDirection, rec.normal, refractionRatio)
        }

        scattered = new Ray(rec.p, direction)

        return { scattered, attenuation }
    }

    reflectance(cosine: number, refIndex: number): number {
        // Shlicks approximation
        let r0: number = (1 - refIndex) / (1 + refIndex);
        r0 = r0 * r0;
        return r0 + (1 - r0) * Math.pow((1 - cosine), 5)
    }
}