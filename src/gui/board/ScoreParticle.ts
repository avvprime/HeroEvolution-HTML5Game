import { BitmapText } from "pixi.js";
import { ActiveRef } from "../../ActiveList";
import { easeOutSine, lerp } from "../../util";


export default class ScoreParticle extends BitmapText {

    private _riseAnim: any = {
        from: { x: 0, y: 0 },
        to: { x: 0, y: 0 },
        duration: 200,
        elapsedTime: 0,
        playing: false,
    }

    private _parent: any;
    private _activeRef: ActiveRef;

    constructor(parent: any) {
        super({
            text: 'score',
            style: {
                fontFamily: 'SlackeyBitmap',
                fontSize: 16,
                fill: 0x212121
            }
        });
        
        this._parent = parent;
        this._activeRef = new ActiveRef(this.update.bind(this));
    }

    public play(x: number, y: number, dist: number): void {
        this._riseAnim.from.x = x;
        this._riseAnim.from.y = y;
        this._riseAnim.to.x = x;
        this._riseAnim.to.y = y - dist;
        this._riseAnim.elapsedTime = 0;
        this._riseAnim.playig = true;
        this._parent.activeList.add(this._activeRef);
    }

    private update(deltaMS: number): void {
        if (this._riseAnim.playing) {
            const a = this._riseAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            const easedT = easeOutSine(t);
            this.alpha = lerp(0, 1, easedT);
            const x = lerp(a.from.x, a.to.x, easedT);
            const y = lerp(a.from.y, a.to.y, easedT);
            this.position.set(x, y);
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.alpha = 0;
                this.visible = false;
                this._parent.activeList.remove(this._activeRef);
            }
        }
    }

}