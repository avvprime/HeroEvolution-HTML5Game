import { Assets, Sprite } from "pixi.js";


export default class Tile extends Sprite {

    private _value: number = 0;

    constructor(value: number) {
        super();

        this.value = value;
    }

    public get value(): number { return this._value }
    public set value(val: number) {
        this._value = val;
        this.texture = Assets.get('hero' + this._value);
    }

    public resize(tileSize: number): void {
        this.width = tileSize;
        this.height = tileSize;
    }


}