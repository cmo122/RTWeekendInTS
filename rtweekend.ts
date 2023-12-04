

export const infinity: number = Number.POSITIVE_INFINITY;
export const pi: number = Math.PI;

export function degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180.0;
}

export function randomInRange(min: number, max: number): number {
    // Returns a random real in [min, max).
    return min + (max - min) * Math.random();
}
