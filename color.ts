import Vector from './vector'
import Interval from './interval';

export default class Color extends Vector {
    static linearToGamma(linearComponent: number): number {
        return Math.sqrt(linearComponent);
    }

    static writeColor(pixelColor: Color, samples_per_pixel: number): string {
        let r: number = pixelColor.x();
        let g: number = pixelColor.y();
        let b: number = pixelColor.z();

        const scale: number = 1.0 / samples_per_pixel;
        r = r * scale;
        g = g * scale;
        b = b * scale;

        const intensity: Interval = new Interval(0.000, 0.999)

        r=this.linearToGamma(r)
        g = this.linearToGamma(g)
        b = this.linearToGamma(b)

        r = intensity.clamp(r);
        g = intensity.clamp(g);
        b = intensity.clamp(b);

        return `${Math.floor(256 * r)} ${Math.floor(256 * g)} ${Math.floor(256 * b) }\n`;

    }
}
