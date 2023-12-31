import * as Lib from "./littleLib.js";
import { Particle, createParticle, drawParticle, calcParticle } from "./particles.js";

export class Firewok
{
	private pos: Lib.IPoint = { x: 0, y: 0 };
	private particles: Particle[] = [];
	private smoke: Particle[] = [];
	private moving = true;
	private from: Lib.IPoint = { x: 0, y: 0 };
	private to: Lib.IPoint = { x: 0, y: 0 };
	private lastSmoke = 0;
	private lastExplode = 1000;
	private explodeC = 0;

	private explodeSpeed = Lib.randomNum(0.1, 0.3);
	private explodeColors: string[] = [];

	public constructor(color?: number)
	{
		color = color ?? Lib.randomInt(360);
		this.explodeColors = [
			Lib.hslColor(color - 25, 100, 50),
			Lib.hslColor(color, 100, 50),
			Lib.hslColor(color + 25, 100, 50),
		];
	}

	public start(from: Lib.IPoint, to: Lib.IPoint)
	{
		this.pos = { ...from };
		this.from = from;
		this.to = to;
		return this;
	}

	public frame(ctx: CanvasRenderingContext2D, dt: number)
	{
		if (this.moving)
		{
			this.lastSmoke += dt;
			if (this.lastSmoke > 100)
				this.smoke.push(createParticle({
					x: this.pos.x,
					y: this.pos.y,
					r: [2, 4],
					dx: [-0.1, 0.1],
					dy: 0,
					c: "gray",
					a: 0.3,
					da: -0.0005,
				}));

			this.pos.x += (this.to.x - this.from.x) / 1000 * dt;
			this.pos.y += (this.to.y - this.from.y) / 1000 * dt;

			if (this.to.x > this.from.x && this.pos.x > this.to.x)
				this.moving = false;
			else if (this.to.x < this.from.x && this.pos.x < this.to.x)
				this.moving = false;
			else if (this.to.y > this.from.y && this.pos.y > this.to.y)
				this.moving = false;
			else if (this.to.y < this.from.y && this.pos.y < this.to.y)
				this.moving = false;
		}

		if (!this.moving)
			this.explode(dt);

		for (let i = 0; i < this.smoke.length; i++)
		{
			const p = this.smoke[i];
			calcParticle(p, dt);
			drawParticle(ctx, p);
			if (p.a < 0)
				this.smoke.splice(i, 1);
		}

		for (let i = 0; i < this.particles.length; i++)
		{
			const p = this.particles[i];
			calcParticle(p, dt);
			drawParticle(ctx, p);
			p.c = this.explodeColors[Lib.randomInt(this.explodeColors.length)];
			if (p.a < 0)
				this.particles.splice(i, 1);
		}

		return this.moving == false && this.particles.length == 0;
	}

	private explode(dt: number): void
	{
		this.lastExplode += dt;
		const countTrail = 5;
		if (this.explodeC > countTrail || this.lastExplode < 60)
			return;
		this.lastExplode = 0;

		const count = 18;
		const color = "orange";
		const dA = Math.PI * 2 / count;
		const k = (1 - this.explodeC++ / countTrail);
		for (let i = 0; i < count; i++)
		{
			const dx = Math.cos(dA * i) * this.explodeSpeed + Lib.random.asbOrNot(Lib.randomNum(0.005, 0.015));
			const dy = Math.sin(dA * i) * this.explodeSpeed + Lib.random.asbOrNot(Lib.randomNum(0.005, 0.015));
			this.particles.push(createParticle({
				x: this.pos.x,
				y: this.pos.y,
				r: 2 + k * 2,
				dx, dy,
				c: color,
				a: 0.9,
				da: -0.001,
			}));
		}
		for (let i = 0; i < count; i++)
		{
			const dx = Math.cos(dA * i) * this.explodeSpeed * Lib.randomNum(0.3, 0.8) + Lib.random.asbOrNot(Lib.randomNum(0.005, 0.01));
			const dy = Math.sin(dA * i) * this.explodeSpeed * Lib.randomNum(0.3, 0.8) + Lib.random.asbOrNot(Lib.randomNum(0.005, 0.01));
			this.particles.push(createParticle({
				x: this.pos.x,
				y: this.pos.y,
				r: 1 + k * 2,
				dx, dy,
				c: color,
				a: 0.9,
				da: -0.001,
			}));
		}
	}
}
