import { Particle, createParticle, drawParticle, loopParticle, moveParticle } from "./particles.js";
import * as Lib from "./littleLib.js";

const date = Lib.get.el("date", HTMLSpanElement);
const title = Lib.get.div("title");
const canvas = Lib.get.canvas("canvas_overlay");
const ctx = Lib.canvas.getContext2d(canvas);
let lastT = 0;
let lastSnowflake = 0;
let animateBorder = -2;
const snowflakes: Particle[] = [];

setTimeout(() => document.body.classList.remove("hidden"), 10);
setTimeout(() => animateBorder = -1, 3300);
draw(0)
function draw(t: number)
{
	const dt = t - lastT;
	lastT = t;

	date.style.color = Lib.hslColor(39, 100, Lib.pingPong(t / 2000) * 40 + 30);
	if (animateBorder == -1)
	{
		animateBorder = t;
		document.body.classList.remove("animateBorder");
	}
	if (animateBorder > 0)
		title.style.setProperty("--block-borderC", Lib.hslColor(Math.floor(((t - animateBorder) / 100 + 9) % 360 * 10) / 10, 100, 64));

	Lib.canvas.fitToParent(canvas);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (t - lastSnowflake > 100 && snowflakes.length < 100)
	{
		snowflakes.push(createParticle([0, canvas.width], 0, [2, 5], [-0.5, 0.5], [0.1, 0.2], "white", 0.5));
		lastSnowflake = t;
	}

	for (const snowflake of snowflakes)
	{
		moveParticle(snowflake, dt);
		loopParticle(snowflake, canvas.width, canvas.height);
		drawParticle(ctx, snowflake);
	}

	requestAnimationFrame(draw);
}
