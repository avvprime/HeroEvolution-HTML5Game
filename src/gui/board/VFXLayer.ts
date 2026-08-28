import { Assets, BitmapText, Container, ParticleContainer, Point, Texture } from "pixi.js";
import { Event, Events } from "../../managers/EventManager";
import { Emitter, type ColorBehaviorConfig, type MovementBehaviorConfig, type ScaleBehaviorConfig, type SpawnBehaviorConfig, type TextureBehaviorConfig } from "pixi-particle-system";
import { ActiveRef } from "../../ActiveList";
import type Board from "./Board";


type Particle = {
    container: ParticleContainer,
    emitter: Emitter
}

export default class VFXLayer extends Container {

    private _relWidth: number = 0.4;

    private _boundEventListeners: Record<Event, ((...args: any[]) => void)> = {}
    private _particlePool: Particle[] = [];
    private _scorePool: BitmapText[] = [];

    private _activeRef: ActiveRef;
    private _parent: Board;
    constructor(parent: Board, parentWidth: number, parentHeight: number) {
        super();
        this._parent = parent;
        this._activeRef = new ActiveRef(this.update.bind(this));
        this.addEventListeners();
        this.resize(parentWidth, parentHeight);
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        const size = newParentWidth * this._relWidth / 2;
        this.x = newParentWidth / 2 - size;
        this.y = newParentHeight / 2 - size;
    }

    public free(): void {
        this.removeEventListeners();
        this._parent.activeList.remove(this._activeRef);
    }

    private update(deltaMS: number): void {

    }

    private addEventListeners(): void {
        this._boundEventListeners[Event.GUI_TILE_MERGED] = this.onTileMerge.bind(this);

        for (const key of Object.keys(this._boundEventListeners)) {
            const parsedKey = parseInt(key);
            Events.on(parsedKey, this._boundEventListeners[parsedKey])
        }
    }

    private removeEventListeners(): void {
        for (const key of Object.keys(this._boundEventListeners)) {
            const parsedKey = parseInt(key);
            Events.off(parsedKey, this._boundEventListeners[parsedKey])
        }
        this._boundEventListeners = {};
    }

    private setupNewParticleEmitter(): Particle {
        const particleTexture = Assets.get('circle');
        const particleTextures: Texture[] = [particleTexture];

        const container = new ParticleContainer();
        this.addChild(container);

        const emitter = new Emitter(container, {
            emitterVersion: "0",
            minParticleLifetime: 0.1,
            maxParticleLifetime: 0.5,
            maxParticles: 2,
            particlesPerWave: 1,
            spawnChance: 1,
            spawnInterval: 0.01,
            ease: 'sine.inout',
        });
        
        emitter.scaleBehavior.applyConfig({
            xListData: {
                list: [
                    { time: 0.0, value: 0 },
                    { time: 0.5, value: 1 },
                    { time: 1.0, value: 0 }
                ]
            },
            yListData: {
                list: [
                    { time: 0.0, value: 0 },
                    { time: 0.5, value: 1 },
                    { time: 1.0, value: 0 }
                ]
            },
            mode: "random"
        } as ScaleBehaviorConfig);
        
        const speed = 50;
        emitter.movementBehavior.applyConfig({
            minMoveSpeed: new Point(-speed, -speed),
            maxMoveSpeed: new Point(speed, speed),
            space: 'global',
            /*
            xListData: {
                list: [
                    { time: 0.0, value: 0 },
                    { time: 1.0, value: 100 }
                ]
            },
            yListData: {
                list: [
                    { time: 0.0, value: 0 },
                    { time: 1.0, value: 100 }
                ]
            },*/
            mode: 'linear'
        } as MovementBehaviorConfig);

        emitter.textureBehavior.applyConfig({
            textureConfigs: [{ textures: particleTextures }],
            mode: "static"
        } as TextureBehaviorConfig);

        emitter.colorBehavior.applyConfig({
            value: "#ffffff",
            mode: "static",
        } as ColorBehaviorConfig);

        emitter.spawnBehavior.applyConfig({
            shape: "circle",
            innerRadius: 0,
            outerRadius: 50,
            direction: { x: 0, y: 0 }
        } as SpawnBehaviorConfig);

        return {
            container, emitter
        }
    }

    private setupNewScoreLabel(): BitmapText {
        const label = new BitmapText({
            text: 'score',
            style: {
                fontFamily: 'SlackeyBitmap',
                fontSize: 18,
                fill: 0x212121
            }
        });
        return label;
    }

    private onTileMerge(x: number, y: number, value: number): void {
        const particle = this._particlePool.length > 0 ? this._particlePool.pop()! : this.setupNewParticleEmitter();
        particle.container.position.set(x, y);
        //particle.emitter.colorBehavior.applyConfig({ value: HeroColor[value], mode: 'static'} )
        particle.emitter.play();
        setTimeout(() => {
            particle.emitter.stop();
            setTimeout(() => {
                this._particlePool.push(particle);    
            }, 2000);
        }, 700);

        const label = this._scorePool.length > 0 ? this._scorePool.pop()! : this.setupNewScoreLabel();
        label.text = value;

    }

}