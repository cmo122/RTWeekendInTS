import Vector from './vector'

export default class Ray{
    private orig: Vector;
    private dir: Vector;

    constructor(origin: Vector = new Vector(), direction: Vector = new Vector()) {
        this.orig = origin;
        this.dir = direction;
    }

    public origin(): Vector {
        return this.orig;
    }

    public direction(): Vector {
        return this.dir;
    }

    public at(t:number):Vector{
        return this.orig.add(this.dir.multiply(t))
    }
}