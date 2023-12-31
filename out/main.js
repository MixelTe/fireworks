import { createParticle, drawParticle, loopParticle, calcParticle } from "./particles.js";
import * as Lib from "./littleLib.js";
import { startFireworks } from "./fireworks.js";
const date = Lib.get.el("date", HTMLSpanElement);
const title = Lib.get.div("title");
const canvas = Lib.get.canvas("canvas_overlay");
const ctx = Lib.canvas.getContext2d(canvas);
let lastT = 0;
let lastSnowflake = 0;
let animateBorder = -2;
let stop = false;
let removeSnowflakes = false;
const snowflakes = [];
// // TEMP
// const overlay = document.querySelector(".overlay");
// if (overlay && overlay.parentElement) overlay.parentElement.removeChild(overlay);
// startFireworks();
// // TEMP
Lib.addButtonListener("btn-start", () => {
    removeSnowflakes = true;
    animateBorder = -3;
    document.body.classList.add("animateBorder");
    document.body.classList.add("hide");
    document.body.requestFullscreen();
    setTimeout(() => {
        const overlay = document.querySelector(".overlay");
        if (overlay && overlay.parentElement)
            overlay.parentElement.removeChild(overlay);
        startFireworks();
    }, 1300);
});
setTimeout(() => document.body.classList.remove("hidden"), 10);
setTimeout(() => animateBorder == -2 ? animateBorder = -1 : {}, 3300);
draw(0);
function draw(t) {
    const dt = t - lastT;
    lastT = t;
    date.style.color = Lib.hslColor(39, 100, Lib.pingPong(t / 2000) * 40 + 30);
    if (animateBorder == -1) {
        animateBorder = t;
        document.body.classList.remove("animateBorder");
    }
    if (animateBorder > 0)
        title.style.setProperty("--block-borderC", Lib.hslColor(Math.floor(((t - animateBorder) / 100 + 210) % 360 * 10) / 10, 100, 64));
    if (animateBorder == -3)
        title.style.setProperty("--block-borderC", "");
    Lib.canvas.fitToParent(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!removeSnowflakes && t - lastSnowflake > 100 && snowflakes.length < canvas.width * canvas.height / 10000) {
        snowflakes.push(createParticle({
            x: [0, canvas.width],
            y: 0,
            r: [2, 5],
            dx: [-0.5, 0.5],
            dy: [0.1, 0.2],
            c: "white",
            a: 0.5,
        }));
        lastSnowflake = t;
    }
    for (let i = snowflakes.length - 1; i >= 0; i--) {
        const snowflake = snowflakes[i];
        calcParticle(snowflake, dt);
        const { loop } = loopParticle(snowflake, canvas.width, canvas.height);
        if (removeSnowflakes && loop) {
            snowflakes.splice(i, 1);
            if (snowflakes.length == 0)
                stop = true;
        }
        drawParticle(ctx, snowflake);
    }
    if (stop)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    else
        requestAnimationFrame(draw);
}
