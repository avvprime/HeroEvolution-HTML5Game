import { Assets, Container, ParticleContainer, Point, Texture } from "pixi.js";
import { Event, Events } from "../../managers/EventManager";
import { Emitter, type ColorBehaviorConfig, type MovementBehaviorConfig, type ScaleBehaviorConfig, type SpawnBehaviorConfig, type TextureBehaviorConfig } from "pixi-particle-system";
import { HeroColor } from "../../common";

type Particle = {
    container: ParticleContainer,
    emitter: Emitter
}

export default class VFXLayer extends Container {

    private _boundEventListeners: Record<Event, ((...args: any[]) => void)> = {}
    private _particles: Particle[] = [];
    private _particlePool: Particle[] = [];

    constructor() {
        super();
        this.addEventListeners();
    }

    public free(): void {
        this.removeEventListeners();
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
            maxParticleLifetime: 1,
            maxParticles: 8,
            particlesPerWave: 8,
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

        emitter.movementBehavior.applyConfig({
            minMoveSpeed: new Point(-100, -100),
            maxMoveSpeed: new Point(100, 100),
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
            mode: "acceleration"
        } as MovementBehaviorConfig);

        emitter.textureBehavior.applyConfig({
            textureConfigs: [{ textures: particleTextures }],
            mode: "static"
        } as TextureBehaviorConfig);

        emitter.colorBehavior.applyConfig({
            value: "#ff00ff",
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

    private onTileMerge(x: number, y: number, value: number): void {
        const particle = this._particlePool.length > 0 ? this._particlePool.pop()! : this.setupNewParticleEmitter();
        particle.container.position.set(x, y);
        //particle.emitter.colorBehavior.staticValue = HeroColor[value];
        particle.emitter.play();
        setTimeout(() => {
            particle.emitter.stop();
            this._particlePool.push(particle);
        }, 1000);
    }

}