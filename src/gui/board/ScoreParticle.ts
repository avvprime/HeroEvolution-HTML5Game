import { BitmapText } from "pixi.js";
import { ActiveRef } from "../../ActiveList";
import { easeOutSine, lerp } from "../../util";


export default class ScoreParticle extends BitmapText {

    private _riseAnim: any = {
        from: { x: 0, y: 0 },
        to: { x: 0, y: 0 },
        duration: 1000,
        elapsedTime: 0,
        playing: false,
    }

    private _fadeOutAnim: any = {
        from: 1,
        to: 0,
        duration: 100,
        elapsedTime: 0,
        playing: false
    }

    private _parent: any;
    private _activeRef: ActiveRef;

    private _totalActiveAnims: number = 0;

    constructor(parent: any) {
        super({
            text: 'score',
            style: {
                fontFamily: 'Slackey',
                fontSize: 50,
                fill: 0xffffff
            },
            anchor: { x: 0.5, y: 0.5 }
        });
        
        this._parent = parent;
        this._activeRef = new ActiveRef(this.update.bind(this));
    }

    public play(text: string, x: number, y: number): void {
        this.text = text;
        this.position.set(x, y);
        this.scale.set(1);
        this.alpha = 1;
        this.visible = true;
        this._riseAnim.from.x = x;
        this._riseAnim.from.y = y;
        this._riseAnim.to.x = x;
        this._riseAnim.to.y = y - 100;
        this._riseAnim.elapsedTime = 0;
        this._riseAnim.playing = true;
        this._parent.activeList.add(this._activeRef);
        
    }

    private update(deltaMS: number): void {
        if (this._riseAnim.playing) {
            const a = this._riseAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            const easedT = easeOutSine(t);
            const x = lerp(a.from.x, a.to.x, easedT) + Math.sin(t) * 40;
            const y = lerp(a.from.y, a.to.y, easedT) - Math.sin(t * 3.3) * 30;
            this.position.set(x, y);
            this.rotation = Math.sin(t) * 0.5;
            
            if (t > 0.8 && !this._fadeOutAnim.playing) {
                //this.scale.set(Math.sin(t * 3));
                this._fadeOutAnim.playing = true;
                this._fadeOutAnim.elapsedTime = 0;
                this.onAnimAdded();
            }
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onAnimEnded();
            }
        }

        if (this._fadeOutAnim.playing) {
            const a = this._fadeOutAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            this.alpha = lerp(a.from, a.to, t);
            if (t >= 1) {
                this._fadeOutAnim.elapsedTime = 0;
                this._fadeOutAnim.playing = false;
                this.onAnimEnded();
            }

        }
        
    }

    private onAnimAdded(): void {
        if (this._totalActiveAnims === 0) this._parent.activeList.add(this._activeRef);
        this._totalActiveAnims++;
    }

    private onAnimEnded(): void {
        this._totalActiveAnims--;
        if (this._totalActiveAnims === 0) {
            this._parent.activeList.remove(this._activeRef);
            this.visible = false;
        }
    }

}