import { randomNum } from "./littleLib.js";

export function createParticle(xr: Range | number, yr: Range | number, rr: Range | number, dxr: Range | number, dyr: Range | number, c: string, a: number): Particle
{
	if (typeof xr == "number") xr = [xr, xr];
	if (typeof yr == "number") yr = [yr, yr];
	if (typeof rr == "number") rr = [rr, rr];
	if (typeof dxr == "number") dxr = [dxr, dxr];
	if (typeof dyr == "number") dyr = [dyr, dyr];

	return {
		x: randomNum(...xr),
		y: randomNum(...yr),
		r: randomNum(...rr),
		dx: randomNum(...dxr),
		dy: randomNum(...dyr),
		c,
		a,
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

export function moveParticle(particle: Particle, dt: number)
{
	particle.x += particle.dx * dt;
	particle.y += particle.dy * dt;
}

export function loopParticle(particle: Particle, w: number, h: number)
{
	if (particle.x - particle.r > w) particle.x = particle.x % w;
	if (particle.x + particle.r < 0) particle.x = (particle.x % w) + w;
	if (particle.y - particle.r > h) particle.y = particle.y % h;
	if (particle.y + particle.r < 0) particle.y = (particle.y % h) + h;
}

type Range = [number, number];

export interface Particle
{
	x: number;
	y: number;
	r: number;
	dx: number;
	dy: number;
	c: string;
	a: number;
}
