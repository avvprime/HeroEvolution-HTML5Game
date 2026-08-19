import { Assets, Sprite } from "pixi.js";


export default class Tile extends Sprite {

    private _value: number = 0;

    constructor(x: number, y: number, size: number, value: number,) {
        super();

        this.value = value;
        this.position.set(x, y);
        this.width = size;
        this.height = size;
    }

    public get value(): number { return this._value }
    public set value(val: number) {
        this._value = val;
        this.texture = Assets.get('hero' + this._value);
    }

    public resize(x: number, y: number, tileSize: number): void {
        this.x = x;
        this.y = y;
        this.width = tileSize;
        this.height = tileSize;
    }


}