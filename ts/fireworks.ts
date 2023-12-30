import * as Lib from "./littleLib.js";

const canvas = Lib.get.canvas("canvas");
const ctx = Lib.canvas.getContext2d(canvas);
let lastT = 0;

export function start()
{

}

function draw(t: number)
{
	const dt = t - lastT;
	lastT = t;

	Lib.canvas.fitToParent(canvas);
	ctx.fillStyle = "#00002d";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	requestAnimationFrame(draw);
}

