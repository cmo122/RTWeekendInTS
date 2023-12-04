export default class Interval {
    min: number;
    max: number;

    constructor(_min: number = Number.POSITIVE_INFINITY, _max: number = Number.NEGATIVE_INFINITY) {
        this.min = _min;
        this.max = _max;
    }

    contains(x: number): boolean {
        return this.min <= x && x <= this.max;
    }

    surrounds(x: number): boolean {
        return this.min < x && x < this.max;
    }

    clamp(x: number): number {
        if (x < this.min) return this.min;
        if (x > this.max) return this.max;
        return x;
    }

    static empty = new Interval();
    static universe = new Interval(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
}
