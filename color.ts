import Vector from './vector'

export default class Color extends Vector {
    static linearToGamma(linearComponent: number): number {
        return Math.sqrt(linearComponent);
    }

    static writeColor(pixelColor: Color): string {
        return `${Math.floor(255.999 * pixelColor.x())} ${Math.floor(255.999 * pixelColor.y())} ${Math.floor(255.999 * pixelColor.z())}\n`;

    }
}
