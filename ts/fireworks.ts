import { Firewok } from "./firewok.js";
import * as Lib from "./littleLib.js";
import { Mode, ModeBigExplosion, ModeSimple } from "./modes.js";

const canvas = Lib.get.canvas("canvas");
const ctx = Lib.canvas.getContext2d(canvas);
let lastT = 0;
const fireworks: IFirewok[] = [];
const modes: (new (fireworks: IFirewok[]) => Mode)[] = [ModeSimple, ModeBigExplosion];
let mode: Mode = new ModeSimple(fireworks);

export function startFireworks()
{
	draw(0)
	canvas.addEventListener("click", e =>
	{
		fireworks.push(new Firewok().start(
			{ x: Lib.randomNum(canvas.width), y: canvas.height },
			{ x: e.offsetX, y: e.offsetY },
		));
	});
}

function draw(t: number)
{
	const dt = t - lastT;
	lastT = t;

	Lib.canvas.fitToParent(canvas);
	ctx.fillStyle = "#00002d";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const done = mode.frame(dt, canvas.width, canvas.height);
	if (done)
	{
		const ModeNext = modes[Lib.random.int(modes.length)];
		mode = new ModeNext(fireworks)
	}

	for (let i = fireworks.length - 1; i >= 0; i--)
	{
		const ended = fireworks[i].frame(ctx, dt);
		if (ended) fireworks.splice(i, 1);
	}

	requestAnimationFrame(draw);
}

export interface IFirewok
{
	frame(ctx: CanvasRenderingContext2D, dt: number): boolean,
}


