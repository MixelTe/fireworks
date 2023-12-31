import { Firewok } from "./firewok.js";
import * as Lib from "./littleLib.js";
export class Mode {
    fireworks;
    constructor(fireworks) {
        this.fireworks = fireworks;
    }
    frame(dt, w, h) {
        return false;
    }
}
export class ModeSimple extends Mode {
    length = Lib.randomInt(15, 30);
    fired = 0;
    lastFirework = 0;
    frame(dt, w, h) {
        this.lastFirework += dt;
        if (this.lastFirework > 500) {
            this.lastFirework = 0;
            this.fired++;
            this.fireworks.push(new Firewok().start({ x: Lib.randomInt(0, w), y: h }, { x: Lib.randomInt(0, w), y: Lib.randomInt(0, h * 3 / 4) }));
        }
        return this.fired >= this.length;
    }
}
export class ModeBigExplosion extends Mode {
    timePassed = 0;
    frame(dt, w, h) {
        this.timePassed += dt;
        if (this.timePassed < 2500)
            return false;
        const color = Lib.randomInt(360);
        const dx = w / 4;
        const dy = h / 4;
        const cx = Lib.randomInt(dx, w - dx);
        const cy = Lib.randomInt(dy, h * 3 / 4 - dy);
        for (let i = 0; i < Lib.randomInt(9, 12); i++) {
            this.fireworks.push(new Firewok(color + Lib.randomInt(-20, 20)).start({ x: Lib.randomInt(0, w), y: h }, { x: cx + Lib.randomInt(-dx, dx), y: cy + Lib.randomInt(-dy, dy) }));
        }
        return true;
    }
}
