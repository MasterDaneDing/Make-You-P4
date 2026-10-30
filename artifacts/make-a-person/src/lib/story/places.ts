import type { Place } from "./tale";

const INK = "#241910";

function ink(ctx: CanvasRenderingContext2D, width: number) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
}

function ground(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, y: number) {
  ctx.fillStyle = color;
  ctx.fillRect(0, y, w, h - y);
  ink(ctx, 6);
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(w, y);
  ctx.stroke();
}

export function drawPlace(
  ctx: CanvasRenderingContext2D,
  place: Place | null,
  w: number,
  h: number,
  phase: number,
) {
  ctx.clearRect(0, 0, w, h);
  if (!place) {
    ctx.fillStyle = "#f4efe4";
    ctx.fillRect(0, 0, w, h);
    return;
  }
  if (place === "park") drawPark(ctx, w, h, phase);
  else if (place === "classroom") drawClassroom(ctx, w, h);
  else if (place === "toilet") drawToilet(ctx, w, h);
  else if (place === "moon") drawMoon(ctx, w, h, phase);
  else if (place === "zoo") drawZoo(ctx, w, h, phase);
  else drawAquarium(ctx, w, h, phase);
}

function drawPark(ctx: CanvasRenderingContext2D, w: number, h: number, phase: number) {
  ctx.fillStyle = "#b7def3";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#ffd56a";
  ctx.beginPath();
  ctx.arc(w * 0.82, h * 0.22, 42, 0, Math.PI * 2);
  ctx.fill();
  ink(ctx, 6);
  ctx.stroke();
  const drift = Math.sin(phase * 0.4) * 12;
  ctx.fillStyle = "#fffaf3";
  ctx.beginPath();
  ctx.arc(w * 0.22 + drift, h * 0.24, 26, 0, Math.PI * 2);
  ctx.arc(w * 0.22 + 30 + drift, h * 0.26, 18, 0, Math.PI * 2);
  ctx.fill();
  ink(ctx, 5);
  ctx.stroke();
  ground(ctx, w, h, "#7ec45a", h * 0.62);
  ctx.fillStyle = "#f0d7a8";
  ctx.beginPath();
  ctx.moveTo(w * 0.42, h * 0.62);
  ctx.lineTo(w * 0.58, h * 0.62);
  ctx.lineTo(w * 0.7, h);
  ctx.lineTo(w * 0.3, h);
  ctx.closePath();
  ctx.fill();
  ink(ctx, 5);
  ctx.stroke();
}

function drawClassroom(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#f6e7c1";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#2f6b4f";
  ctx.fillRect(w * 0.18, h * 0.1, w * 0.64, h * 0.32);
  ink(ctx, 6);
  ctx.strokeRect(w * 0.18, h * 0.1, w * 0.64, h * 0.32);
  ctx.strokeStyle = "#f4efe4";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w * 0.28, h * 0.22);
  ctx.lineTo(w * 0.7, h * 0.22);
  ctx.moveTo(w * 0.28, h * 0.3);
  ctx.lineTo(w * 0.62, h * 0.3);
  ctx.stroke();
  ground(ctx, w, h, "#d7b07a", h * 0.72);
  ctx.fillStyle = "#c46a3a";
  for (const x of [w * 0.16, w * 0.7]) {
    ctx.fillRect(x, h * 0.58, w * 0.16, h * 0.08);
    ink(ctx, 4);
    ctx.strokeRect(x, h * 0.58, w * 0.16, h * 0.08);
  }
}

function drawToilet(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#d7eef8";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#f7fbff";
  ctx.lineWidth = 3;
  for (let y = 0; y < h; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ground(ctx, w, h, "#c5d5de", h * 0.78);
  ctx.fillStyle = "#fffaf3";
  ctx.beginPath();
  ctx.roundRect(w * 0.38, h * 0.42, w * 0.24, h * 0.36, 18);
  ctx.fill();
  ink(ctx, 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.58, w * 0.07, h * 0.06, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#9fd0ea";
  ctx.fillRect(w * 0.72, h * 0.4, w * 0.16, h * 0.08);
  ink(ctx, 5);
  ctx.strokeRect(w * 0.72, h * 0.4, w * 0.16, h * 0.08);
}

function drawMoon(ctx: CanvasRenderingContext2D, w: number, h: number, phase: number) {
  ctx.fillStyle = "#1c2438";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#f4efe4";
  for (let i = 0; i < 18; i += 1) {
    const x = (i * 97) % w;
    const y = (i * 53) % (h * 0.55);
    ctx.fillRect(x, y, 3, 3);
  }
  ctx.fillStyle = "#7eb6e8";
  ctx.beginPath();
  ctx.arc(w * 0.8, h * 0.22 + Math.sin(phase * 0.3) * 4, 28, 0, Math.PI * 2);
  ctx.fill();
  ground(ctx, w, h, "#c7c1b6", h * 0.68);
  ctx.fillStyle = "#b3ada2";
  ctx.beginPath();
  ctx.ellipse(w * 0.3, h * 0.78, 50, 16, 0, 0, Math.PI * 2);
  ctx.ellipse(w * 0.62, h * 0.84, 36, 12, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawZoo(ctx: CanvasRenderingContext2D, w: number, h: number, phase: number) {
  ctx.fillStyle = "#b7def3";
  ctx.fillRect(0, 0, w, h);
  ground(ctx, w, h, "#8fc96a", h * 0.64);
  ctx.strokeStyle = "#8b5a34";
  ctx.lineWidth = 8;
  for (let x = w * 0.08; x < w; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, h * 0.42);
    ctx.lineTo(x, h * 0.7);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, h * 0.46);
  ctx.lineTo(w, h * 0.46);
  ctx.stroke();
  const bob = Math.sin(phase * 0.8) * 6;
  ctx.fillStyle = "#e6b15a";
  ctx.fillRect(w * 0.72, h * 0.28 + bob, 28, h * 0.28);
  ctx.beginPath();
  ctx.ellipse(w * 0.72 + 14, h * 0.26 + bob, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ink(ctx, 4);
  ctx.stroke();
}

function drawAquarium(ctx: CanvasRenderingContext2D, w: number, h: number, phase: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#1f6fbf");
  sky.addColorStop(1, "#0d3e78");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ground(ctx, w, h, "#d7c48a", h * 0.8);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  for (let i = 0; i < 8; i += 1) {
    const x = (i * 120 + phase * 18) % w;
    const y = h * 0.2 + ((i * 47) % (h * 0.5));
    ctx.beginPath();
    ctx.arc(x, y, 6 + (i % 3) * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  const fishX = (phase * 40) % (w + 80) - 40;
  ctx.fillStyle = "#ffb703";
  ctx.beginPath();
  ctx.ellipse(fishX, h * 0.4, 28, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(fishX - 24, h * 0.4);
  ctx.lineTo(fishX - 42, h * 0.4 - 12);
  ctx.lineTo(fishX - 42, h * 0.4 + 12);
  ctx.closePath();
  ctx.fill();
  ink(ctx, 4);
  ctx.stroke();
}
