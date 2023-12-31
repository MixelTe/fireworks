import { hslColor, randomNum } from "./littleLib.js";

export function createParticle(p: RandomParticle): Particle
{
	return {
		x: typeof p.x == "number" ? p.x : randomNum(...p.x),
		y: typeof p.y == "number" ? p.y : randomNum(...p.y),
		r: typeof p.r == "number" ? p.r : randomNum(...p.r),
		a: typeof p.a == "number" ? p.a : randomNum(...p.a),
		c: typeof p.c == "string" ? p.c : hslColor(
			typeof p.c[0] == "number" ? p.c[0] : randomNum(...p.c[0]),
			typeof p.c[1] == "number" ? p.c[1] : randomNum(...p.c[1]),
			typeof p.c[2] == "number" ? p.c[2] : randomNum(...p.c[2]),
		),
		dx: p.dx == undefined ? 0 : typeof p.dx == "number" ? p.dx : randomNum(...p.dx),
		dy: p.dy == undefined ? 0 : typeof p.dy == "number" ? p.dy : randomNum(...p.dy),
		dr: p.dr == undefined ? 0 : typeof p.dr == "number" ? p.dr : randomNum(...p.dr),
		da: p.da == undefined ? 0 : typeof p.da == "number" ? p.da : randomNum(...p.da),
	};
}

export function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle)
{
	ctx.save();
	ctx.globalAlpha = particle.a;
	ctx.fillStyle = particle.c;
	ctx.beginPath();
	ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

export function calcParticle(particle: Particle, dt: number)
{
	particle.x += particle.dx * dt;
	particle.y += particle.dy * dt;
	particle.r += particle.dr * dt;
	particle.a += particle.da * dt;
}

export function loopParticle(particle: Particle, w: number, h: number)
{
	let loopX = 0;
	let loopY = 0;
	if (particle.x - particle.r > w)
	{
		particle.x = particle.x % w;
		loopX = 1;
	}
	if (particle.x + particle.r < 0)
	{
		particle.x = (particle.x % w) + w;
		loopX = -1;
	}
	if (particle.y - particle.r > h)
	{
		particle.y = particle.y % h;
		loopY = 1;
	}
	if (particle.y + particle.r < 0)
	{
		particle.y = (particle.y % h) + h;
		loopY = -1;
	}
	return { loop: loopX != 0 || loopY != 0, loopX, loopY };
}

type Range = [number, number];

export interface Particle
{
	x: number;
	y: number;
	r: number;
	a: number;
	c: string;
	dx: number;
	dy: number;
	dr: number;
	da: number;
}

export interface RandomParticle
{
	x: number | Range;
	y: number | Range;
	r: number | Range;
	a: number | Range;
	c: string | [number | Range, number | Range, number | Range];
	dx?: number | Range;
	dy?: number | Range;
	dr?: number | Range;
	da?: number | Range;
}
