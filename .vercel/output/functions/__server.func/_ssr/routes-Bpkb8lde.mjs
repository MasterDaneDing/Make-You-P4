import { o as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ChevronLeft, i as ChevronRight, n as Shuffle, r as Music } from "../_libs/lucide-react.mjs";
import { n as previewAssetUrl } from "./router-PbgvQfo0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bpkb8lde.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function freshAdjust() {
	return {
		head: {
			x: 0,
			y: 0,
			s: 1
		},
		hair: {
			x: 0,
			y: 0,
			s: 1
		},
		eyes: {
			x: 0,
			y: 0,
			s: 1
		},
		nose: {
			x: 0,
			y: 0,
			s: 1
		},
		mouth: {
			x: 0,
			y: 0,
			s: 1
		},
		body: {
			x: 0,
			y: 0,
			s: 1
		}
	};
}
function clampAdjust(a) {
	const s = typeof a?.s === "number" && Number.isFinite(a.s) ? a.s : 1;
	const x = typeof a?.x === "number" && Number.isFinite(a.x) ? a.x : 0;
	const y = typeof a?.y === "number" && Number.isFinite(a.y) ? a.y : 0;
	return {
		x: Math.min(220, Math.max(-220, x)),
		y: Math.min(260, Math.max(-260, y)),
		s: Math.min(2.4, Math.max(.4, s))
	};
}
function partId(look, kind) {
	switch (kind) {
		case "head": return look.head;
		case "hair": return look.hair;
		case "eyes": return look.eyes;
		case "nose": return look.nose;
		case "mouth": return look.mouth;
		case "body": return look.body;
	}
}
function withPart(look, kind, id) {
	if (kind === "head") return {
		...look,
		head: id
	};
	if (kind === "body") return {
		...look,
		body: id
	};
	if (kind === "hair") return {
		...look,
		hair: id
	};
	if (kind === "eyes") return {
		...look,
		eyes: id
	};
	if (kind === "nose") return {
		...look,
		nose: id
	};
	return {
		...look,
		mouth: id
	};
}
var STAGE_H = 1040;
var INK$1 = "#241910";
var CARD = "#fffaf3";
var LINE = "#e3d5c0";
var bodyBoxCache = /* @__PURE__ */ new WeakMap();
function bodySpan(img) {
	const cached = bodyBoxCache.get(img);
	if (cached) return cached;
	const w = img.naturalWidth || img.width;
	const h = img.naturalHeight || img.height;
	const scratch = document.createElement("canvas");
	scratch.width = w;
	scratch.height = h;
	const g = scratch.getContext("2d", { willReadFrequently: true });
	if (!g) return {
		t: 0,
		b: h
	};
	g.drawImage(img, 0, 0);
	const data = g.getImageData(0, 0, w, h).data;
	let t = h;
	let b = 0;
	for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 3) if (data[(y * w + x) * 4 + 3] > 24) {
		if (y < t) t = y;
		if (y > b) b = y;
		break;
	}
	const span = b > t ? {
		t,
		b: b + 1
	} : {
		t: 0,
		b: h
	};
	bodyBoxCache.set(img, span);
	return span;
}
function drawBodyPuppet(ctx, img, dx, dy, dw, dh, phase) {
	if (phase === 0) {
		ctx.drawImage(img, dx, dy, dw, dh);
		return;
	}
	const srcW = img.naturalWidth || img.width;
	const srcH = img.naturalHeight || img.height;
	const span = bodySpan(img);
	const hipSrc = span.t + (span.b - span.t) * .62;
	const footSrc = Math.min(srcH, span.b + 1);
	const scaleX = dw / srcW;
	const scaleY = dh / srcH;
	const hipY = dy + hipSrc * scaleY;
	const overlap = Math.max(8, srcW * .06);
	const step = Math.sin(phase * 1.35);
	const sides = [{
		x0: 0,
		x1: srcW / 2 + overlap,
		sign: -1
	}, {
		x0: srcW / 2 - overlap,
		x1: srcW,
		sign: 1
	}];
	for (const side of sides) {
		const sw = side.x1 - side.x0;
		const destW = sw * scaleX;
		const destX = dx + side.x0 * scaleX;
		const legH = (footSrc - hipSrc) * scaleY;
		ctx.save();
		ctx.translate(destX + destW / 2, hipY);
		ctx.rotate(step * .045 * side.sign);
		ctx.drawImage(img, side.x0, hipSrc, sw, footSrc - hipSrc, -destW / 2, 0, destW, legH);
		ctx.restore();
	}
	const cover = (footSrc - hipSrc) * .08;
	const torsoSrc = Math.min(srcH, hipSrc + cover);
	ctx.drawImage(img, 0, 0, srcW, torsoSrc, dx, dy, dw, torsoSrc * scaleY);
}
function drawGlasses(ctx, kind, hx, hy, hw, hh) {
	const blue = kind.endsWith("blue");
	const round = kind.startsWith("round");
	ctx.save();
	ctx.strokeStyle = blue ? "#2f62d6" : "#1a120e";
	ctx.fillStyle = blue ? "rgba(120, 170, 255, 0.28)" : "rgba(255, 255, 255, 0.18)";
	ctx.lineWidth = Math.max(5, hw * .045);
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	const y = hy + hh * .4;
	const lensW = hw * (round ? .24 : .26);
	const lensH = round ? lensW * .92 : lensW * .72;
	const gap = hw * .05;
	const cx = hx + hw / 2;
	const lens = (x) => {
		ctx.beginPath();
		if (round) ctx.ellipse(x + lensW / 2, y, lensW / 2, lensH / 2, 0, 0, Math.PI * 2);
		else roundRect(ctx, x, y - lensH / 2, lensW, lensH, Math.min(8, lensH / 4));
		ctx.fill();
		ctx.stroke();
	};
	lens(cx - gap / 2 - lensW);
	lens(cx + gap / 2);
	ctx.beginPath();
	ctx.moveTo(cx - gap / 2, y);
	ctx.lineTo(cx + gap / 2, y);
	ctx.stroke();
	ctx.restore();
}
var headCache = /* @__PURE__ */ new Map();
function hexToRgb(hex) {
	const h = hex.replace("#", "");
	const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
	const v = Number.parseInt(n, 16);
	return {
		r: v >> 16 & 255,
		g: v >> 8 & 255,
		b: v & 255
	};
}
function luminance(hex) {
	const { r, g, b } = hexToRgb(hex);
	return (.2126 * r + .7152 * g + .0722 * b) / 255;
}
function recolor(img, hex, mode) {
	const key = `${mode}:${hex}:${img.src}`;
	const hit = headCache.get(key);
	if (hit) return hit;
	const c = document.createElement("canvas");
	c.width = img.naturalWidth || img.width;
	c.height = img.naturalHeight || img.height;
	const ctx = c.getContext("2d");
	if (!ctx) return img;
	ctx.drawImage(img, 0, 0);
	const image = ctx.getImageData(0, 0, c.width, c.height);
	const d = image.data;
	const { r, g, b } = hexToRgb(hex);
	for (let i = 0; i < d.length; i += 4) {
		if (d[i + 3] === 0) continue;
		const lum = (d[i] + d[i + 1] + d[i + 2]) / 765;
		const ink = mode === "fill" ? lum : 1 - lum;
		d[i] = r * ink;
		d[i + 1] = g * ink;
		d[i + 2] = b * ink;
	}
	ctx.putImageData(image, 0, 0);
	headCache.set(key, c);
	return c;
}
function roundRect(ctx, x, y, w, h, r) {
	const radius = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + w, y, x + w, y + h, radius);
	ctx.arcTo(x + w, y + h, x, y + h, radius);
	ctx.arcTo(x, y + h, x, y, radius);
	ctx.arcTo(x, y, x + w, y, radius);
	ctx.closePath();
}
function viewZoom(kind) {
	return kind === "body" ? 1 : 1.12;
}
var PARK = {
	sky: "#b7def3",
	hill: "#9ed0ea",
	grass: "#7ec45a",
	grassDark: "#69ae48",
	path: "#f0d7a8",
	sun: "#ffd56a",
	leaf: "#3e9a4c",
	leafDeep: "#2f7d3d",
	trunk: "#8b5a34",
	cloud: "#fffaf3",
	flower: "#d8442c",
	petal: "#f2c14e"
};
function ink$1(ctx, width) {
	ctx.strokeStyle = INK$1;
	ctx.lineWidth = width;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
}
function drawPark$1(ctx, phase) {
	const W = 680;
	const H = STAGE_H;
	const drift = Math.sin(phase * .35) * 10;
	ctx.fillStyle = PARK.sky;
	ctx.fillRect(0, 0, W, H);
	ctx.fillStyle = PARK.sun;
	ctx.beginPath();
	ctx.arc(548, 168, 54, 0, Math.PI * 2);
	ctx.fill();
	ink$1(ctx, 8);
	ctx.stroke();
	ctx.save();
	ctx.translate(548, 168);
	ctx.rotate(phase * .08);
	ctx.strokeStyle = PARK.sun;
	ctx.lineWidth = 8;
	for (let i = 0; i < 8; i += 1) {
		ctx.rotate(Math.PI / 4);
		ctx.beginPath();
		ctx.moveTo(68, 0);
		ctx.lineTo(96, 0);
		ctx.stroke();
	}
	ctx.restore();
	const cloud = (x, y, s) => {
		ctx.fillStyle = PARK.cloud;
		ctx.beginPath();
		ctx.arc(x, y, 28 * s, 0, Math.PI * 2);
		ctx.arc(x + 32 * s, y + 6 * s, 22 * s, 0, Math.PI * 2);
		ctx.arc(x - 30 * s, y + 8 * s, 20 * s, 0, Math.PI * 2);
		ctx.fill();
		ink$1(ctx, 7);
		ctx.stroke();
	};
	cloud(150 + drift, 150, 1);
	cloud(330 - drift * .6, 96, .8);
	ctx.fillStyle = PARK.hill;
	ctx.beginPath();
	ctx.moveTo(0, 470);
	ctx.quadraticCurveTo(180, 390, 360, 450);
	ctx.quadraticCurveTo(520, 500, W, 420);
	ctx.lineTo(W, 560);
	ctx.lineTo(0, 560);
	ctx.fill();
	ctx.fillStyle = PARK.grass;
	ctx.beginPath();
	ctx.moveTo(0, 530);
	ctx.quadraticCurveTo(W * .5, 490, W, 540);
	ctx.lineTo(W, H);
	ctx.lineTo(0, H);
	ctx.fill();
	ink$1(ctx, 8);
	ctx.beginPath();
	ctx.moveTo(0, 534);
	ctx.quadraticCurveTo(W * .5, 494, W, 544);
	ctx.stroke();
	ctx.fillStyle = PARK.grassDark;
	ctx.beginPath();
	ctx.ellipse(120, 700, 90, 22, 0, 0, Math.PI * 2);
	ctx.ellipse(560, 760, 80, 18, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = PARK.path;
	ctx.beginPath();
	ctx.moveTo(W / 2 - 36, 620);
	ctx.lineTo(376, 620);
	ctx.lineTo(490, H);
	ctx.lineTo(W / 2 - 150, H);
	ctx.closePath();
	ctx.fill();
	ink$1(ctx, 8);
	ctx.stroke();
	const tree = (x, y, lean) => {
		ctx.strokeStyle = PARK.trunk;
		ctx.lineWidth = 16;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(x, y + 150);
		ctx.quadraticCurveTo(x + lean, y + 70, x + lean * .4, y);
		ctx.stroke();
		const puffs = [
			[
				0,
				0,
				58
			],
			[
				-48,
				16,
				42
			],
			[
				46,
				18,
				40
			],
			[
				-16,
				-36,
				36
			],
			[
				22,
				-28,
				32
			]
		];
		ctx.fillStyle = PARK.leaf;
		for (const [dx, dy, r] of puffs) {
			ctx.beginPath();
			ctx.arc(x + dx + lean * .2, y + dy, r, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.fillStyle = PARK.leafDeep;
		ctx.beginPath();
		ctx.arc(x - 20, y + 10, 22, 0, Math.PI * 2);
		ctx.fill();
		ink$1(ctx, 7);
		for (const [dx, dy, r] of puffs) {
			ctx.beginPath();
			ctx.arc(x + dx + lean * .2, y + dy, r, 0, Math.PI * 2);
			ctx.stroke();
		}
	};
	tree(86, 430, 10);
	tree(600, 400, -14);
	const flower = (x, y, color) => {
		ctx.strokeStyle = PARK.grassDark;
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + 28);
		ctx.stroke();
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, 11, 0, Math.PI * 2);
		ctx.fill();
		ink$1(ctx, 4);
		ctx.stroke();
		ctx.fillStyle = PARK.sun;
		ctx.beginPath();
		ctx.arc(x, y, 4, 0, Math.PI * 2);
		ctx.fill();
	};
	flower(70, 820, PARK.flower);
	flower(128, 860, PARK.petal);
	flower(560, 840, PARK.flower);
	flower(620, 800, PARK.petal);
	flower(500, 900, PARK.flower);
}
function headScaleFor(nw, nh, bodyW) {
	const fitted = bodyW * .9 / nw;
	if (nh / nw >= .82) return fitted;
	const grown = bodyW * .9 * .82 / nh;
	return Math.min(grown, fitted * 1.55);
}
function project(x, y, sway, bob, pivotX, pivotY, view) {
	const dx = x - pivotX;
	const dy = y - pivotY;
	const rot = sway * .058;
	const c = Math.cos(rot);
	const s = Math.sin(rot);
	const wx = pivotX + sway * 18 + dx * c - dy * s;
	const wy = pivotY + bob + dx * s + dy * c;
	const anchorY = STAGE_H * .4;
	const t = Math.min(1, Math.max(0, (view.zoom - 1) / 1.05));
	const originY = view.focusY + (anchorY - view.focusY) * t;
	return {
		x: 340 + (wx - 340) * view.zoom,
		y: originY + (wy - view.focusY) * view.zoom
	};
}
function boxOf(kind, x, y, w, h, sway, bob, pivotX, pivotY, view) {
	const corners = [
		project(x, y, sway, bob, pivotX, pivotY, view),
		project(x + w, y, sway, bob, pivotX, pivotY, view),
		project(x, y + h, sway, bob, pivotX, pivotY, view),
		project(x + w, y + h, sway, bob, pivotX, pivotY, view)
	];
	const xs = corners.map((p) => p.x);
	const ys = corners.map((p) => p.y);
	const left = Math.min(...xs);
	const top = Math.min(...ys);
	const right = Math.max(...xs);
	const bottom = Math.max(...ys);
	return {
		kind,
		x: left,
		y: top,
		w: right - left,
		h: bottom - top,
		hx: right - 4,
		hy: bottom - 4
	};
}
function paintPerson(ctx, input, phase = 0, view = {
	zoom: 1,
	focusY: STAGE_H * .42
}, guide = null, plain = false) {
	const { body, head, skin, name, adjust } = input;
	const W = 680;
	const H = STAGE_H;
	ctx.clearRect(0, 0, W, H);
	ctx.save();
	const anchorY = H * .4;
	const blend = Math.min(1, Math.max(0, (view.zoom - 1) / 1.05));
	const originY = view.focusY + (anchorY - view.focusY) * blend;
	ctx.translate(W / 2, originY);
	ctx.scale(view.zoom, view.zoom);
	ctx.translate(-340, -view.focusY);
	if (!plain) drawPark$1(ctx, phase);
	const bodyH = 460;
	const bodyW = body ? body.naturalWidth * (bodyH / body.naturalHeight) : 320;
	const bodyTop = 424;
	const bodyX = (W - bodyW) / 2;
	const sway = Math.sin(phase);
	if (!plain && body) {
		ctx.save();
		ctx.fillStyle = "rgba(36, 25, 16, 0.12)";
		ctx.beginPath();
		ctx.ellipse(W / 2 + sway * 18, 876, Math.max(24, bodyW * .34 * (1 - Math.abs(sway) * .1)), 13, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
	const bodyA = clampAdjust(adjust.body);
	const drawBW = bodyW * bodyA.s;
	const drawBH = bodyH * bodyA.s;
	const drawBX = bodyX + (bodyW - drawBW) / 2 + bodyA.x;
	const drawBY = bodyTop + (bodyH - drawBH) / 2 + bodyA.y;
	const fitted = head ? headScaleFor(head.naturalWidth, head.naturalHeight, bodyW) : 0;
	const headW = head ? head.naturalWidth * fitted : 0;
	const headH = head ? head.naturalHeight * fitted : 0;
	const headTop = 470 - headH;
	const headX = (W - headW) / 2;
	const headA = clampAdjust(adjust.head);
	const drawHW = headW * headA.s;
	const drawHH = headH * headA.s;
	const drawHX = headX + (headW - drawHW) / 2 + headA.x;
	const drawHY = headTop + (headH - drawHH) / 2 + headA.y;
	const pivotX = W / 2;
	const pivotY = 860;
	const bob = Math.sin(phase * 2) * 9;
	ctx.save();
	ctx.translate(pivotX + sway * 18, pivotY + bob);
	ctx.rotate(sway * .058);
	ctx.translate(-340, -860);
	if (body) drawBodyPuppet(ctx, body, drawBX, drawBY, drawBW, drawBH, phase);
	const faceCx = drawHX + drawHW / 2;
	const faceCy = drawHY + drawHH * .55;
	const turn = phase === 0 ? 0 : Math.sin(phase * .85) * .22 - .08;
	const squash = 1 - Math.abs(turn) * .55;
	const shift = turn * drawHW * .14;
	const slide = turn * drawHW * .2;
	const featureSquash = squash * (1 - Math.abs(turn) * .12);
	const withTurn = (amount, slideX, draw) => {
		ctx.save();
		ctx.translate(faceCx + slideX, faceCy);
		ctx.scale(amount, 1);
		ctx.translate(-faceCx, -faceCy);
		draw();
		ctx.restore();
	};
	const turned = (x, y, w, h, amount, slideX) => ({
		x: faceCx + slideX + (x - faceCx) * amount,
		y,
		w: w * amount,
		h
	});
	if (head) withTurn(squash, shift, () => {
		ctx.drawImage(recolor(head, skin, "fill"), drawHX, drawHY, drawHW, drawHH);
	});
	const featureRects = [];
	const drawFeature = (img, kind, yFrac, wFrac, asInk) => {
		if (!img) return;
		const source = asInk ? recolor(img, luminance(skin) < .42 ? "#f7f1e6" : "#1a120e", "ink") : img;
		const a = clampAdjust(adjust[kind]);
		const w = drawHW * wFrac * a.s;
		const h = w * ((img.naturalHeight || img.height) / (img.naturalWidth || img.width || 1));
		const x = drawHX + drawHW / 2 - w / 2 + a.x;
		const y = drawHY + drawHH * yFrac - h / 2 + a.y;
		ctx.drawImage(source, x, y, w, h);
		featureRects.push({
			kind,
			x,
			y,
			w,
			h
		});
	};
	if (head) withTurn(featureSquash, shift + slide, () => {
		drawFeature(input.eyes, "eyes", .4, .46, true);
		drawFeature(input.nose, "nose", .56, .2, false);
		drawFeature(input.mouth, "mouth", .72, .34, false);
		if (input.glasses) drawGlasses(ctx, input.glasses, drawHX, drawHY, drawHW, drawHH);
	});
	const hairHeld = { rect: null };
	const hairImg = input.hair;
	if (head && hairImg) withTurn(squash, shift, () => {
		const a = clampAdjust(adjust.hair);
		if (input.hairPart?.scarf && input.hairPart.frame) {
			const frame = input.hairPart.frame;
			const scale = drawHW * .72 / frame.w * a.s;
			const dw = hairImg.naturalWidth * scale;
			const dh = hairImg.naturalHeight * scale;
			const fcx = (frame.x + frame.w / 2) * scale;
			const fcy = (frame.y + frame.h / 2) * scale;
			const holeX = drawHX + drawHW / 2;
			const holeY = drawHY + drawHH * .47;
			const x = holeX - fcx + a.x;
			const y = holeY - fcy + a.y;
			ctx.drawImage(hairImg, x, y, dw, dh);
			hairHeld.rect = {
				x,
				y,
				w: dw,
				h: dh
			};
		} else {
			const iw = hairImg.naturalWidth || hairImg.width || 1;
			const ih = hairImg.naturalHeight || hairImg.height;
			const dw = drawHW * 1.06 * a.s;
			const dh = dw * (ih / iw);
			const x = drawHX + drawHW / 2 - dw / 2 + a.x;
			const y = drawHY - drawHH * .06 + a.y;
			ctx.drawImage(hairImg, x, y, dw, dh);
			hairHeld.rect = {
				x,
				y,
				w: dw,
				h: dh
			};
		}
	});
	ctx.restore();
	ctx.restore();
	const boxes = [];
	if (body) boxes.push(boxOf("body", drawBX, drawBY, drawBW, drawBH, sway, bob, pivotX, pivotY, view));
	if (head) {
		const shown = turned(drawHX, drawHY, drawHW, drawHH, squash, shift);
		boxes.push(boxOf("head", shown.x, shown.y, shown.w, shown.h, sway, bob, pivotX, pivotY, view));
	}
	if (hairHeld.rect) {
		const shown = turned(hairHeld.rect.x, hairHeld.rect.y, hairHeld.rect.w, hairHeld.rect.h, squash, shift);
		boxes.push(boxOf("hair", shown.x, shown.y, shown.w, shown.h, sway, bob, pivotX, pivotY, view));
	}
	for (const rect of featureRects) {
		const shown = turned(rect.x, rect.y, rect.w, rect.h, featureSquash, shift + slide);
		boxes.push(boxOf(rect.kind, shown.x, shown.y, shown.w, shown.h, sway, bob, pivotX, pivotY, view));
	}
	if (guide) {
		const box = boxes.find((item) => item.kind === guide);
		if (box) {
			ctx.save();
			ctx.strokeStyle = "#d8442c";
			ctx.lineWidth = 5;
			ctx.lineJoin = "round";
			roundRect(ctx, box.x - 8, box.y - 8, box.w + 16, box.h + 16, 20);
			ctx.stroke();
			ctx.restore();
		}
	}
	const label = name.trim().slice(0, 22);
	if (!plain && label) {
		let size = 48;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const maxW = 584;
		for (; size > 26; size -= 2) {
			ctx.font = `700 ${size}px Fraunces, Georgia, serif`;
			if (ctx.measureText(label).width <= maxW) break;
		}
		const textW = ctx.measureText(label).width;
		const pw = Math.min(632, textW + 56);
		const ph = 72;
		const px = (W - pw) / 2;
		const py = 922;
		ctx.fillStyle = CARD;
		ctx.strokeStyle = LINE;
		ctx.lineWidth = 3;
		roundRect(ctx, px, py, pw, ph, 36);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = INK$1;
		ctx.fillText(label, W / 2, 960);
	}
	return {
		boxes,
		headMidY: drawHY + drawHH * .46,
		bodyMidY: drawBY + drawBH * .5
	};
}
var STEP = 64;
var BASS = [
	"C2",
	null,
	"C2",
	null,
	"G2",
	null,
	"E2",
	null,
	"C2",
	null,
	"G2",
	null,
	"C3",
	null,
	"G2",
	null,
	"A1",
	null,
	"A1",
	null,
	"E2",
	null,
	"A2",
	null,
	"F2",
	null,
	"C2",
	null,
	"F2",
	null,
	"A2",
	null,
	"F2",
	null,
	"C2",
	null,
	"A2",
	null,
	"C3",
	null,
	"G2",
	null,
	"D2",
	null,
	"B2",
	null,
	"G2",
	null,
	"C2",
	null,
	"E2",
	null,
	"G2",
	null,
	"E2",
	null,
	"F2",
	null,
	"E2",
	null,
	"D2",
	null,
	"G1",
	null
];
var LEAD = [
	null,
	null,
	"E5",
	null,
	"G5",
	null,
	"C6",
	"E6",
	null,
	"D6",
	null,
	"C6",
	"A5",
	null,
	"G5",
	null,
	null,
	"C5",
	null,
	"E5",
	"A5",
	null,
	"G5",
	"E5",
	null,
	"F5",
	null,
	"A5",
	"C6",
	null,
	"A5",
	null,
	null,
	"A5",
	"C6",
	null,
	"F6",
	null,
	"E6",
	"C6",
	null,
	"B5",
	null,
	"G5",
	"D6",
	null,
	"B5",
	null,
	"C6",
	null,
	"E6",
	null,
	"G6",
	"E6",
	"D6",
	null,
	"C6",
	null,
	null,
	"G5",
	null,
	"E5",
	null,
	null
];
function bounce(notes, count) {
	const out = [];
	for (let i = 0; i < count; i += 1) out.push(notes[i % notes.length]);
	return out;
}
var ARP = [
	...bounce([
		"C5",
		"E5",
		"G5",
		"C6"
	], 16),
	...bounce([
		"A4",
		"C5",
		"E5",
		"A5"
	], 8),
	...bounce([
		"F4",
		"A4",
		"C5",
		"F5"
	], 8),
	...bounce([
		"F4",
		"A4",
		"C5",
		"F5"
	], 8),
	...bounce([
		"G4",
		"B4",
		"D5",
		"G5"
	], 8),
	...bounce([
		"C5",
		"E5",
		"G5",
		"C6"
	], 8),
	...bounce([
		"B4",
		"D5",
		"F5",
		"G5"
	], 4),
	...bounce([
		"C5",
		"E5",
		"G5",
		"C6"
	], 4)
];
var MIDI = {};
for (const [name, semitone] of [
	["C", 0],
	["D", 2],
	["E", 4],
	["F", 5],
	["G", 7],
	["A", 9],
	["Bb", 10],
	["B", 11]
]) for (let octave = 1; octave <= 7; octave += 1) MIDI[`${name}${octave}`] = 12 * (octave + 1) + semitone;
function freq(note) {
	return 440 * 2 ** ((MIDI[note] - 69) / 12);
}
function pulseWave(ctx, duty) {
	const n = 64;
	const real = new Float32Array(n);
	const imag = new Float32Array(n);
	for (let i = 1; i < n; i += 1) imag[i] = 2 / (i * Math.PI) * Math.sin(i * Math.PI * duty);
	return ctx.createPeriodicWave(real, imag, { disableNormalization: false });
}
function createTune() {
	let ctx = null;
	let master = null;
	let filter = null;
	let noise = null;
	let timer = 0;
	let step = 0;
	let next = 0;
	let playing = false;
	let want = false;
	let lastLead = 0;
	const waves = /* @__PURE__ */ new Map();
	function context() {
		if (ctx) return ctx;
		const audio = new AudioContext();
		ctx = audio;
		master = audio.createGain();
		master.gain.value = 1e-4;
		filter = audio.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = 1400;
		filter.Q.value = 2.4;
		master.connect(filter);
		filter.connect(audio.destination);
		const samples = audio.sampleRate;
		noise = audio.createBuffer(1, samples, samples);
		const data = noise.getChannelData(0);
		for (let i = 0; i < samples; i += 1) data[i] = Math.random() * 2 - 1;
		return audio;
	}
	function pulse(duty) {
		const audio = context();
		const key = Math.round(duty * 100);
		let wave = waves.get(key);
		if (!wave) {
			wave = pulseWave(audio, duty);
			waves.set(key, wave);
		}
		return wave;
	}
	function env(time, dur, gain, attack = .012) {
		const amp = context().createGain();
		amp.gain.setValueAtTime(1e-4, time);
		amp.gain.exponentialRampToValueAtTime(gain, time + attack);
		amp.gain.exponentialRampToValueAtTime(1e-4, time + dur);
		return amp;
	}
	function triangle(time, note, dur, gain) {
		const audio = context();
		if (!master) return;
		const osc = audio.createOscillator();
		osc.type = "triangle";
		osc.frequency.setValueAtTime(freq(note), time);
		const amp = env(time, dur, gain, .008);
		osc.connect(amp);
		amp.connect(master);
		osc.start(time);
		osc.stop(time + dur + .02);
	}
	function tone(time, note, dur, gain, duty, slide = false) {
		const audio = context();
		if (!master) return;
		const osc = audio.createOscillator();
		osc.setPeriodicWave(pulse(duty));
		const f = freq(note);
		if (slide && lastLead > 0) {
			osc.frequency.setValueAtTime(lastLead, time);
			osc.frequency.exponentialRampToValueAtTime(f, time + .045);
		} else osc.frequency.setValueAtTime(f, time);
		if (slide) lastLead = f;
		const amp = env(time, dur, gain, .01);
		osc.connect(amp);
		amp.connect(master);
		osc.start(time);
		osc.stop(time + dur + .02);
	}
	function drum(time, snare) {
		const audio = context();
		if (!master || !noise) return;
		const src = audio.createBufferSource();
		src.buffer = noise;
		const amp = audio.createGain();
		const band = audio.createBiquadFilter();
		band.type = "bandpass";
		band.Q.value = snare ? .7 : 1.4;
		band.frequency.setValueAtTime(snare ? 1800 : 240, time);
		band.frequency.exponentialRampToValueAtTime(snare ? 900 : 80, time + (snare ? .09 : .12));
		amp.gain.setValueAtTime(snare ? .16 : .28, time);
		amp.gain.exponentialRampToValueAtTime(1e-4, time + (snare ? .1 : .14));
		src.connect(band);
		band.connect(amp);
		amp.connect(master);
		src.start(time);
		src.stop(time + .16);
	}
	function play(index, time) {
		const bass = BASS[index];
		const lead = LEAD[index];
		const arp = ARP[index];
		const beat = index % 8;
		if (bass) triangle(time, bass, beat === 0 ? .22 : .14, .42);
		if (lead) tone(time, lead, .2, .12, .32, true);
		if (beat === 0) drum(time, false);
		else if (beat === 4) drum(time, true);
		else if (arp) tone(time, arp, .09, .055, .12, false);
	}
	function tick() {
		const audio = context();
		const horizon = audio.currentTime + .18;
		const gap = 60 / 128 / 4;
		const sweep = 1100 + (Math.sin(step / STEP * Math.PI * 2) * .5 + .5) * 1700;
		filter?.frequency.setTargetAtTime(sweep, audio.currentTime, .12);
		while (next < horizon) {
			play(step, next);
			next += gap;
			step = (step + 1) % STEP;
		}
	}
	function begin() {
		const audio = context();
		if (!master || playing) return;
		master.gain.cancelScheduledValues(audio.currentTime);
		master.gain.setValueAtTime(1e-4, audio.currentTime);
		master.gain.setTargetAtTime(.2, audio.currentTime, .06);
		next = audio.currentTime + .05;
		step = 0;
		lastLead = 0;
		playing = true;
		tick();
		timer = window.setInterval(tick, 40);
	}
	function stop() {
		want = false;
		playing = false;
		window.clearInterval(timer);
		if (master && ctx) master.gain.setTargetAtTime(1e-4, ctx.currentTime, .04);
	}
	function start() {
		want = true;
		const audio = context();
		if (playing) return true;
		if (audio.state === "suspended") {
			audio.resume().then(() => {
				if (want) begin();
			});
			return false;
		}
		begin();
		return true;
	}
	function toggle() {
		if (playing || want) {
			stop();
			return false;
		}
		start();
		return true;
	}
	return {
		start,
		toggle,
		stop,
		get playing() {
			return playing;
		},
		get wanted() {
			return want;
		}
	};
}
var INK = "#241910";
function ink(ctx, width) {
	ctx.strokeStyle = INK;
	ctx.lineWidth = width;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
}
function ground(ctx, w, h, color, y) {
	ctx.fillStyle = color;
	ctx.fillRect(0, y, w, h - y);
	ink(ctx, 6);
	ctx.beginPath();
	ctx.moveTo(0, y);
	ctx.lineTo(w, y);
	ctx.stroke();
}
function drawPlace(ctx, place, w, h, phase) {
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
function drawPark(ctx, w, h, phase) {
	ctx.fillStyle = "#b7def3";
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#ffd56a";
	ctx.beginPath();
	ctx.arc(w * .82, h * .22, 42, 0, Math.PI * 2);
	ctx.fill();
	ink(ctx, 6);
	ctx.stroke();
	const drift = Math.sin(phase * .4) * 12;
	ctx.fillStyle = "#fffaf3";
	ctx.beginPath();
	ctx.arc(w * .22 + drift, h * .24, 26, 0, Math.PI * 2);
	ctx.arc(w * .22 + 30 + drift, h * .26, 18, 0, Math.PI * 2);
	ctx.fill();
	ink(ctx, 5);
	ctx.stroke();
	ground(ctx, w, h, "#7ec45a", h * .62);
	ctx.fillStyle = "#f0d7a8";
	ctx.beginPath();
	ctx.moveTo(w * .42, h * .62);
	ctx.lineTo(w * .58, h * .62);
	ctx.lineTo(w * .7, h);
	ctx.lineTo(w * .3, h);
	ctx.closePath();
	ctx.fill();
	ink(ctx, 5);
	ctx.stroke();
}
function drawClassroom(ctx, w, h) {
	ctx.fillStyle = "#f6e7c1";
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#2f6b4f";
	ctx.fillRect(w * .18, h * .1, w * .64, h * .32);
	ink(ctx, 6);
	ctx.strokeRect(w * .18, h * .1, w * .64, h * .32);
	ctx.strokeStyle = "#f4efe4";
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(w * .28, h * .22);
	ctx.lineTo(w * .7, h * .22);
	ctx.moveTo(w * .28, h * .3);
	ctx.lineTo(w * .62, h * .3);
	ctx.stroke();
	ground(ctx, w, h, "#d7b07a", h * .72);
	ctx.fillStyle = "#c46a3a";
	for (const x of [w * .16, w * .7]) {
		ctx.fillRect(x, h * .58, w * .16, h * .08);
		ink(ctx, 4);
		ctx.strokeRect(x, h * .58, w * .16, h * .08);
	}
}
function drawToilet(ctx, w, h) {
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
	ground(ctx, w, h, "#c5d5de", h * .78);
	ctx.fillStyle = "#fffaf3";
	ctx.beginPath();
	ctx.roundRect(w * .38, h * .42, w * .24, h * .36, 18);
	ctx.fill();
	ink(ctx, 6);
	ctx.stroke();
	ctx.beginPath();
	ctx.ellipse(w * .5, h * .58, w * .07, h * .06, 0, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fillStyle = "#9fd0ea";
	ctx.fillRect(w * .72, h * .4, w * .16, h * .08);
	ink(ctx, 5);
	ctx.strokeRect(w * .72, h * .4, w * .16, h * .08);
}
function drawMoon(ctx, w, h, phase) {
	ctx.fillStyle = "#1c2438";
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#f4efe4";
	for (let i = 0; i < 18; i += 1) {
		const x = i * 97 % w;
		const y = i * 53 % (h * .55);
		ctx.fillRect(x, y, 3, 3);
	}
	ctx.fillStyle = "#7eb6e8";
	ctx.beginPath();
	ctx.arc(w * .8, h * .22 + Math.sin(phase * .3) * 4, 28, 0, Math.PI * 2);
	ctx.fill();
	ground(ctx, w, h, "#c7c1b6", h * .68);
	ctx.fillStyle = "#b3ada2";
	ctx.beginPath();
	ctx.ellipse(w * .3, h * .78, 50, 16, 0, 0, Math.PI * 2);
	ctx.ellipse(w * .62, h * .84, 36, 12, 0, 0, Math.PI * 2);
	ctx.fill();
}
function drawZoo(ctx, w, h, phase) {
	ctx.fillStyle = "#b7def3";
	ctx.fillRect(0, 0, w, h);
	ground(ctx, w, h, "#8fc96a", h * .64);
	ctx.strokeStyle = "#8b5a34";
	ctx.lineWidth = 8;
	for (let x = w * .08; x < w; x += 36) {
		ctx.beginPath();
		ctx.moveTo(x, h * .42);
		ctx.lineTo(x, h * .7);
		ctx.stroke();
	}
	ctx.beginPath();
	ctx.moveTo(0, h * .46);
	ctx.lineTo(w, h * .46);
	ctx.stroke();
	const bob = Math.sin(phase * .8) * 6;
	ctx.fillStyle = "#e6b15a";
	ctx.fillRect(w * .72, h * .28 + bob, 28, h * .28);
	ctx.beginPath();
	ctx.ellipse(w * .72 + 14, h * .26 + bob, 16, 12, 0, 0, Math.PI * 2);
	ctx.fill();
	ink(ctx, 4);
	ctx.stroke();
}
function drawAquarium(ctx, w, h, phase) {
	const sky = ctx.createLinearGradient(0, 0, 0, h);
	sky.addColorStop(0, "#1f6fbf");
	sky.addColorStop(1, "#0d3e78");
	ctx.fillStyle = sky;
	ctx.fillRect(0, 0, w, h);
	ground(ctx, w, h, "#d7c48a", h * .8);
	ctx.fillStyle = "rgba(255,255,255,0.35)";
	for (let i = 0; i < 8; i += 1) {
		const x = (i * 120 + phase * 18) % w;
		const y = h * .2 + i * 47 % (h * .5);
		ctx.beginPath();
		ctx.arc(x, y, 6 + i % 3 * 2, 0, Math.PI * 2);
		ctx.fill();
	}
	const fishX = phase * 40 % (w + 80) - 40;
	ctx.fillStyle = "#ffb703";
	ctx.beginPath();
	ctx.ellipse(fishX, h * .4, 28, 14, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(fishX - 24, h * .4);
	ctx.lineTo(fishX - 42, h * .4 - 12);
	ctx.lineTo(fishX - 42, h * .4 + 12);
	ctx.closePath();
	ctx.fill();
	ink(ctx, 4);
	ctx.stroke();
}
var KEY = "make-you-drive-webhook";
var DRIVE_SCRIPT = `function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var folder = DriveApp.getFolderById("1NJUZnlnuQ3vux_8I6AraOIE2IsTjVqLg");
  var bytes = Utilities.base64Decode(data.pdfBase64);
  var blob = Utilities.newBlob(bytes, "application/pdf", data.filename || "Story.pdf");
  var file = folder.createFile(blob);
  return ContentService.createTextOutput(JSON.stringify({ status: "ok", url: file.getUrl() }))
    .setMimeType(ContentService.MimeType.JSON);
}`;
function loadWebhook() {
	try {
		return localStorage.getItem(KEY)?.trim() ?? "";
	} catch {
		return "";
	}
}
function saveWebhook(url) {
	const next = url.trim();
	try {
		if (next) localStorage.setItem(KEY, next);
		else localStorage.removeItem(KEY);
	} catch {}
	return next;
}
async function sendStoryPdf(webhook, filename, pdfBase64, studentName) {
	await fetch(webhook, {
		method: "POST",
		mode: "no-cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			filename,
			pdfBase64,
			studentName
		})
	});
}
var PLACES = [
	"park",
	"classroom",
	"toilet",
	"moon",
	"zoo",
	"aquarium"
];
var ACTIONS = [
	"jumping",
	"running",
	"singing",
	"dancing"
];
var HURTS = [
	"arm",
	"leg",
	"foot",
	"hand",
	"nose",
	"pat-pat",
	"brain",
	"tongue"
];
var HELPERS = [
	"phonics",
	"vegetable",
	"violin"
];
var DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday"
];
var PLACE_LABEL = {
	park: "park",
	classroom: "classroom",
	toilet: "toilet",
	moon: "moon",
	zoo: "zoo",
	aquarium: "aquarium"
};
var HELPER_LABEL = {
	phonics: "Phonics Man",
	vegetable: "Mr. Vegetable",
	violin: "Mr. Violin"
};
var HELPER_SRC = {
	phonics: "/story/phonics-man.png",
	vegetable: "/story/mr-vegetable.png",
	violin: "/story/mr-violin.png"
};
var ACTION_LINE = {
	jumping: "jumping",
	running: "running too fast",
	singing: "singing loudly",
	dancing: "dancing"
};
var ACTION_LESSON = {
	jumping: "jump like that",
	running: "run too fast",
	singing: "sing so loudly",
	dancing: "dance like that"
};
function pick(list) {
	return list[Math.floor(Math.random() * list.length)];
}
function called(look, fallback) {
	return look.name.trim() || fallback;
}
function makeTale(me, classmate) {
	return {
		me,
		classmate,
		place: null,
		day: pick(DAYS),
		action: pick(ACTIONS),
		sudden: pick(["Suddenly", "All of a sudden"]),
		hurt: pick(HURTS),
		helper: pick(HELPERS)
	};
}
function sentence(tale, page) {
	const me = called(tale.me, "Me");
	const pal = called(tale.classmate, "my classmate");
	const where = tale.place ? `the ${PLACE_LABEL[tale.place]}` : "the ______";
	if (page === 0) return `Hello! I am ${me} and this is my classmate, ${pal}. I want to tell you about the accident in ${where}.`;
	if (page === 1) return `${me} and ${pal} went to ${where} last ${tale.day}.`;
	if (page === 2) return `${pal} was ${ACTION_LINE[tale.action]}.`;
	if (page === 3) return `${tale.sudden} ${pal} fell down. "Ouch! I can't move my ${tale.hurt}!" shouted ${pal}.`;
	if (page === 4) return `I called for help! Luckily, ${HELPER_LABEL[tale.helper]} came to help!`;
	if (page === 5) return `${pal} felt afraid because their ${tale.hurt} couldn't move.`;
	return `${pal} learnt that we should be careful and not ${ACTION_LESSON[tale.action]}.`;
}
var FRAME_W = 960;
var FRAME_H = 540;
function useImage(src) {
	const [img, setImg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!src) {
			setImg(null);
			return;
		}
		let alive = true;
		const el = new Image();
		el.onload = () => {
			if (alive) setImg(el);
		};
		el.src = src;
		return () => {
			alive = false;
		};
	}, [src]);
	return img;
}
function useActor(look, parts) {
	const byId = new Map(parts.map((part) => [part.id, part]));
	const hairPart = look.hair ? byId.get(look.hair) ?? null : null;
	const body = useImage(look.body ? byId.get(look.body)?.src ?? null : null);
	const head = useImage(look.head ? byId.get(look.head)?.src ?? null : null);
	const hair = useImage(hairPart?.src ?? null);
	const eyes = useImage(look.eyes ? byId.get(look.eyes)?.src ?? null : null);
	const nose = useImage(look.nose ? byId.get(look.nose)?.src ?? null : null);
	const mouth = useImage(look.mouth ? byId.get(look.mouth)?.src ?? null : null);
	const pack = (0, import_react.useRef)({
		body,
		head,
		hair,
		eyes,
		nose,
		mouth,
		hairPart,
		look
	});
	pack.current = {
		body,
		head,
		hair,
		eyes,
		nose,
		mouth,
		hairPart,
		look
	};
	const off = (0, import_react.useRef)(null);
	const crop = (0, import_react.useRef)(null);
	const draw = (ctx, x, ground, height, phase, pose) => {
		const cur = pack.current;
		if (!cur.body && !cur.head) return;
		if (!off.current) {
			off.current = document.createElement("canvas");
			off.current.width = 680;
			off.current.height = STAGE_H;
		}
		const source = off.current.getContext("2d");
		if (!source) return;
		source.setTransform(1, 0, 0, 1, 0, 0);
		source.clearRect(0, 0, 680, STAGE_H);
		paintPerson(source, {
			body: cur.body,
			head: cur.head,
			hair: cur.hair,
			eyes: cur.eyes,
			nose: cur.nose,
			mouth: cur.mouth,
			hairPart: cur.hairPart,
			glasses: cur.look.glasses,
			skin: cur.look.skin,
			name: "",
			adjust: cur.look.adjust
		}, phase, {
			zoom: 1,
			focusY: STAGE_H * .5
		}, null, true);
		if (!crop.current) {
			const data = source.getImageData(0, 0, 680, STAGE_H).data;
			let minX = 680;
			let minY = STAGE_H;
			let maxX = 0;
			let maxY = 0;
			for (let y = 0; y < STAGE_H; y += 3) for (let px = 0; px < 680; px += 3) if (data[(y * 680 + px) * 4 + 3] > 20) {
				if (px < minX) minX = px;
				if (y < minY) minY = y;
				if (px > maxX) maxX = px;
				if (y > maxY) maxY = y;
			}
			if (maxX > minX) crop.current = {
				x: Math.max(0, minX - 8),
				y: Math.max(0, minY - 8),
				w: Math.min(680, maxX + 8) - Math.max(0, minX - 8),
				h: Math.min(STAGE_H, maxY + 12) - Math.max(0, minY - 8)
			};
		}
		const box = crop.current;
		if (!box) return;
		const scale = height / box.h;
		const dw = box.w * scale;
		let px = x;
		let py = ground;
		let rot = 0;
		if (pose === "dance") {
			py -= Math.abs(Math.sin(phase * 3)) * 12;
			rot = Math.sin(phase * 2) * .08;
		} else if (pose === "slide") px += Math.sin(phase * 1.3) * 34;
		else if (pose === "jump") py -= Math.abs(Math.sin(phase * 3.1)) * 48;
		else if (pose === "run") {
			px += Math.sin(phase * 2.2) * 64;
			rot = .08;
		} else if (pose === "sing") py -= Math.sin(phase * 4) * 6;
		else if (pose === "fall") rot = 1.15;
		else if (pose === "carried") rot = -1.2;
		else py -= Math.sin(phase * 2) * 4;
		ctx.save();
		ctx.translate(px, py);
		ctx.rotate(rot);
		ctx.drawImage(off.current, box.x, box.y, box.w, box.h, -dw / 2, -height, dw, height);
		ctx.restore();
		if (pose === "sing") {
			ctx.fillStyle = "#241910";
			ctx.font = "700 32px Georgia, serif";
			ctx.fillText("♪", px + dw * .35, py - height + Math.sin(phase * 5) * 8);
		}
	};
	return draw;
}
function poseFor(page, action, who) {
	if (page === 0) return "dance";
	if (page === 1) return "slide";
	if (page === 2) {
		if (who === "me") return "stand";
		if (action === "jumping") return "jump";
		if (action === "running") return "run";
		if (action === "singing") return "sing";
		return "dance";
	}
	if (page === 3) return who === "pal" ? "fall" : "stand";
	if (page === 5) return who === "pal" ? "carried" : "stand";
	return "stand";
}
function HurtMark({ hurt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "hurt-mark",
		viewBox: "0 0 64 64",
		"aria-hidden": true,
		children: [
			hurt === "tongue" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "32",
				cy: "34",
				rx: "12",
				ry: "16",
				fill: "#e85d4c",
				stroke: "#241910",
				strokeWidth: "4"
			}) : null,
			hurt === "nose" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "32",
				cy: "32",
				rx: "10",
				ry: "14",
				fill: "#e0a67a",
				stroke: "#241910",
				strokeWidth: "4"
			}) : null,
			hurt === "brain" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M18 34c0-12 8-20 14-20s14 8 14 20-6 16-14 16-14-6-14-16z",
				fill: "#f2a3c7",
				stroke: "#241910",
				strokeWidth: "4"
			}) : null,
			hurt === "hand" || hurt === "arm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M20 40c6-16 20-16 24 0",
				fill: "none",
				stroke: "#241910",
				strokeWidth: "6",
				strokeLinecap: "round"
			}) : null,
			hurt === "leg" || hurt === "foot" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M28 14v24c8 0 14 6 14 10H22",
				fill: "none",
				stroke: "#241910",
				strokeWidth: "6",
				strokeLinecap: "round"
			}) : null,
			hurt === "pat-pat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "32",
				cy: "34",
				rx: "16",
				ry: "12",
				fill: "#e0a67a",
				stroke: "#241910",
				strokeWidth: "4"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "22",
				fill: "none",
				stroke: "#d8442c",
				strokeWidth: "5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 16l32 32",
				stroke: "#d8442c",
				strokeWidth: "5"
			})
		]
	});
}
function StoryBook({ me, classmate, parts, tuneOn, onTune, onAgain }) {
	const [tale, setTale] = (0, import_react.useState)(() => makeTale(me, classmate));
	const [page, setPage] = (0, import_react.useState)(0);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)(null);
	const [webhook, setWebhook] = (0, import_react.useState)("");
	const [scriptCopied, setScriptCopied] = (0, import_react.useState)(false);
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setWebhook(loadWebhook());
	}, []);
	const taleRef = (0, import_react.useRef)(tale);
	const pageRef = (0, import_react.useRef)(page);
	taleRef.current = tale;
	pageRef.current = page;
	const drawMe = useActor(me, parts);
	const drawPal = useActor(classmate, parts);
	const helperImg = useImage(previewAssetUrl(HELPER_SRC[tale.helper]));
	const drawMeRef = (0, import_react.useRef)(drawMe);
	const drawPalRef = (0, import_react.useRef)(drawPal);
	const helperRef = (0, import_react.useRef)(helperImg);
	drawMeRef.current = drawMe;
	drawPalRef.current = drawPal;
	helperRef.current = helperImg;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = FRAME_W * dpr;
		canvas.height = FRAME_H * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let frame = 0;
		let alive = true;
		let clock = 0;
		let last = performance.now();
		const tick = (now) => {
			if (!alive) return;
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			if (!reduce) clock += dt * 2.1;
			paintFrame(ctx, taleRef.current, pageRef.current, clock, drawMeRef.current, drawPalRef.current, helperRef.current);
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => {
			alive = false;
			cancelAnimationFrame(frame);
		};
	}, []);
	async function savePdf() {
		if (!tale.place) {
			setNote("Choose a place first.");
			setPage(0);
			return;
		}
		setSaving(true);
		setNote(null);
		try {
			const { jsPDF } = await import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			const pdf = new jsPDF({
				orientation: "landscape",
				unit: "pt",
				format: "a4"
			});
			const shot = document.createElement("canvas");
			shot.width = FRAME_W;
			shot.height = FRAME_H;
			const ctx = shot.getContext("2d");
			if (!ctx) return;
			const pageW = pdf.internal.pageSize.getWidth();
			pdf.internal.pageSize.getHeight();
			const pictureW = pageW - 56;
			const pictureH = pictureW * (FRAME_H / FRAME_W);
			for (let i = 0; i < 7; i += 1) {
				if (i > 0) pdf.addPage();
				paintFrame(ctx, tale, i, 1.1 + i * .4, drawMe, drawPal, helperImg);
				pdf.addImage(shot.toDataURL("image/jpeg", .86), "JPEG", 28, 22, pictureW, pictureH);
				pdf.setFont("helvetica", "bold");
				pdf.setFontSize(16);
				pdf.setTextColor(36, 25, 16);
				pdf.text(sentence(tale, i), 28, pictureH + 52, { maxWidth: pictureW });
			}
			const filename = `${`${called(tale.me, "me")}-and-${called(tale.classmate, "classmate")}`.replace(/[^\w]+/g, "-")}.pdf`.toLowerCase();
			const dataUri = pdf.output("datauristring");
			pdf.save(filename);
			const hook = loadWebhook();
			if (hook) {
				await sendStoryPdf(hook, filename, dataUri.split(",")[1] ?? "", called(tale.me, "Me"));
				setNote("Sent to Google Drive, in Grok / Make you.");
			} else setNote("Downloaded here. Add the Drive web app address once, and the next stories go straight to Grok / Make you.");
		} catch {
			setNote("The PDF did not save. Try again.");
		} finally {
			setSaving(false);
		}
	}
	const words = sentence(tale, page);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "story-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-3 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs font-extrabold tracking-widest text-coral uppercase",
					children: "The story"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "tune-btn font-sans text-sm",
					onClick: onTune,
					"aria-pressed": tuneOn,
					children: tuneOn ? "Tune on" : "Play tune"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "story-frame",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					"aria-label": "The story picture"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "story-words",
				children: [page === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HurtMark, { hurt: tale.hurt }) : null, words]
			}),
			page === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				role: "group",
				"aria-label": "Where the accident happened",
				children: PLACES.map((place) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-on": tale.place === place ? "true" : "false",
					className: "toy-tab font-sans text-base capitalize",
					onClick: () => setTale((prev) => ({
						...prev,
						place
					})),
					children: PLACE_LABEL[place]
				}, place))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "toy-go toy-ghost",
						disabled: page === 0,
						onClick: () => setPage((n) => Math.max(0, n - 1)),
						children: "Back"
					}),
					page < 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "toy-go",
						disabled: page === 0 && !tale.place,
						onClick: () => setPage((n) => Math.min(6, n + 1)),
						children: "Next"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "toy-go",
						disabled: saving,
						onClick: () => void savePdf(),
						children: saving ? "Saving…" : webhook ? "Save to Drive" : "Save story"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "toy-go toy-ghost",
						onClick: onAgain,
						children: "New people"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-sans text-sm font-bold text-muted",
				children: [
					"Page ",
					page + 1,
					" of 7",
					tale.helper ? ` · ${HELPER_LABEL[tale.helper]} is in this story` : ""
				]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-sans text-sm font-bold text-ink",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "teacher-drive",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Teacher: send stories straight to Drive" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Same door as the park book. In Google Apps Script, paste this, deploy it as a web app (run as you, anyone), then paste the address ending in /exec. It files each PDF in Grok / Make you. Do it once on the class iPad." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: DRIVE_SCRIPT }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "toy-tab font-sans text-sm",
							onClick: () => {
								navigator.clipboard.writeText(DRIVE_SCRIPT).then(() => {
									setScriptCopied(true);
								});
							},
							children: scriptCopied ? "Copied" : "Copy script"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block font-sans text-sm font-extrabold text-ink",
						children: ["Web app address", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "url",
							value: webhook,
							placeholder: "https://script.google.com/macros/s/…/exec",
							className: "nameplate mt-1",
							onChange: (e) => setWebhook(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "toy-go mt-2",
						onClick: () => {
							const next = saveWebhook(webhook);
							setWebhook(next);
							setNote(next ? "Drive address saved on this iPad." : "Drive address cleared.");
						},
						children: "Save Drive address"
					})
				]
			})
		]
	});
}
function paintFrame(ctx, tale, page, phase, drawMe, drawPal, helper) {
	drawPlace(ctx, tale.place, FRAME_W, FRAME_H, phase);
	const ground = 522;
	const drift = Math.sin(phase * 1.2) * 46;
	if (page === 5 && helper) {
		const hx = FRAME_W * .58 + drift;
		const hh = 340;
		const hw = hh * (helper.naturalWidth / helper.naturalHeight);
		ctx.drawImage(helper, hx - hw / 2, 182, hw, hh);
		drawPal(ctx, hx - hw * .05, ground - hh * .42, 210, phase, "carried");
		drawMe(ctx, FRAME_W * .22, ground, 250, phase, "stand");
		return;
	}
	if (page === 4 && helper) {
		const hh = 320;
		const hw = hh * (helper.naturalWidth / helper.naturalHeight);
		ctx.drawImage(helper, FRAME_W * .72 - hw / 2, 202, hw, hh);
	}
	drawMe(ctx, page === 3 ? 300 : 360, ground, 280, phase, poseFor(page, tale.action, "me"));
	drawPal(ctx, page === 3 ? 620 : 600, ground, 280, phase + .6, poseFor(page, tale.action, "pal"));
}
var STORAGE_KEY = "make-a-person-v2";
var TABS = [
	{
		id: "head",
		label: "Head"
	},
	{
		id: "hair",
		label: "Hair"
	},
	{
		id: "eyes",
		label: "Eyes"
	},
	{
		id: "glasses",
		label: "Glasses"
	},
	{
		id: "nose",
		label: "Nose"
	},
	{
		id: "mouth",
		label: "Mouth"
	},
	{
		id: "body",
		label: "Body"
	}
];
var GLASSES = [
	{
		id: null,
		label: "None"
	},
	{
		id: "round-black",
		label: "Round black"
	},
	{
		id: "round-blue",
		label: "Round blue"
	},
	{
		id: "square-black",
		label: "Square black"
	},
	{
		id: "square-blue",
		label: "Square blue"
	}
];
var SKINS = [
	{
		hex: "#F6D3C0",
		label: "Very light"
	},
	{
		hex: "#F0C0A0",
		label: "Light"
	},
	{
		hex: "#E0A67A",
		label: "Medium light"
	},
	{
		hex: "#C68642",
		label: "Medium"
	},
	{
		hex: "#8D5524",
		label: "Tan"
	},
	{
		hex: "#5C3A28",
		label: "Deep"
	},
	{
		hex: "#3B2418",
		label: "Very deep"
	}
];
function defaultLook() {
	return {
		head: null,
		hair: null,
		eyes: null,
		nose: null,
		mouth: null,
		body: null,
		glasses: null,
		skin: "#E0A67A",
		name: "",
		adjust: freshAdjust()
	};
}
function loadLook() {
	const base = defaultLook();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return base;
		const parsed = JSON.parse(raw);
		const adjust = freshAdjust();
		const stored = parsed.adjust;
		if (stored) Object.keys(adjust).forEach((kind) => {
			adjust[kind] = clampAdjust(stored[kind]);
		});
		return {
			...base,
			...parsed,
			head: parsed.head === null || typeof parsed.head === "string" ? parsed.head ?? null : null,
			body: parsed.body === null || typeof parsed.body === "string" ? parsed.body ?? null : null,
			glasses: GLASSES.some((item) => item.id === parsed.glasses) ? parsed.glasses ?? null : null,
			name: typeof parsed.name === "string" ? parsed.name : "",
			skin: typeof parsed.skin === "string" ? parsed.skin : base.skin,
			adjust
		};
	} catch {
		return base;
	}
}
function slotsFor(parts, kind, tone) {
	let list = parts.filter((p) => p.kind === kind);
	if (kind === "body") list = list.filter((p) => (p.tone === "deep" ? "deep" : "light") === tone);
	const slots = list.map((part) => ({
		id: part.id,
		part
	}));
	slots.unshift({
		id: null,
		part: null
	});
	return slots;
}
function cycleId(slots, current, dir) {
	if (slots.length === 0) return current;
	let idx = slots.findIndex((s) => s.id === current);
	if (idx < 0) idx = dir === 1 ? -1 : 0;
	idx = (idx + dir + slots.length) % slots.length;
	return slots[idx]?.id ?? current;
}
function LittlePerson({ look, parts, caption }) {
	const ref = (0, import_react.useRef)(null);
	const byId = new Map(parts.map((part) => [part.id, part]));
	const hairPart = look.hair ? byId.get(look.hair) ?? null : null;
	const body = useSprite(look.body ? byId.get(look.body)?.src ?? null : null);
	const head = useSprite(look.head ? byId.get(look.head)?.src ?? null : null);
	const hair = useSprite(hairPart?.src ?? null);
	const eyes = useSprite(look.eyes ? byId.get(look.eyes)?.src ?? null : null);
	const nose = useSprite(look.nose ? byId.get(look.nose)?.src ?? null : null);
	const mouth = useSprite(look.mouth ? byId.get(look.mouth)?.src ?? null : null);
	const pack = (0, import_react.useRef)({
		body,
		head,
		hair,
		eyes,
		nose,
		mouth,
		hairPart,
		look
	});
	pack.current = {
		body,
		head,
		hair,
		eyes,
		nose,
		mouth,
		hairPart,
		look
	};
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const off = document.createElement("canvas");
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		off.width = 680 * dpr;
		off.height = STAGE_H * dpr;
		const source = off.getContext("2d");
		if (!source) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let crop = null;
		let frame = 0;
		let alive = true;
		const draw = (now) => {
			if (!alive) return;
			const cur = pack.current;
			if (cur.body || cur.head) {
				source.setTransform(dpr, 0, 0, dpr, 0, 0);
				source.clearRect(0, 0, 680, STAGE_H);
				paintPerson(source, {
					body: cur.body,
					head: cur.head,
					hair: cur.hair,
					eyes: cur.eyes,
					nose: cur.nose,
					mouth: cur.mouth,
					hairPart: cur.hairPart,
					glasses: cur.look.glasses,
					skin: cur.look.skin,
					name: "",
					adjust: cur.look.adjust
				}, reduce ? 0 : now / 1e3, {
					zoom: 1,
					focusY: STAGE_H * .5
				}, null, true);
				if (!crop && (!cur.look.hair || cur.hair)) {
					const pixels = source.getImageData(0, 0, off.width, off.height).data;
					const width = off.width;
					let minX = width;
					let minY = off.height;
					let maxX = 0;
					let maxY = 0;
					for (let y = 0; y < off.height; y += 2) for (let x = 0; x < width; x += 2) if (pixels[(y * width + x) * 4 + 3] > 20) {
						if (x < minX) minX = x;
						if (y < minY) minY = y;
						if (x > maxX) maxX = x;
						if (y > maxY) maxY = y;
					}
					if (maxX > minX && maxY > minY) {
						const padX = 28 * dpr;
						const padTop = 22 * dpr;
						const padBottom = 30 * dpr;
						const x = Math.max(0, minX - padX);
						const y = Math.max(0, minY - padTop);
						const right = Math.min(width, maxX + padX);
						const bottom = Math.min(off.height, maxY + padBottom);
						crop = {
							x: x / dpr,
							y: y / dpr,
							w: (right - x) / dpr,
							h: (bottom - y) / dpr
						};
						canvas.width = Math.ceil(crop.w * dpr);
						canvas.height = Math.ceil(crop.h * dpr);
					}
				}
				const frameCrop = crop;
				if (frameCrop) {
					ctx.setTransform(1, 0, 0, 1, 0, 0);
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(off, frameCrop.x * dpr, frameCrop.y * dpr, frameCrop.w * dpr, frameCrop.h * dpr, 0, 0, canvas.width, canvas.height);
				}
			}
			frame = requestAnimationFrame(draw);
		};
		frame = requestAnimationFrame(draw);
		return () => {
			alive = false;
			cancelAnimationFrame(frame);
		};
	}, []);
	const name = look.name.trim();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "little-canvas",
		"aria-label": name || caption
	});
}
function useSprite(src) {
	const [img, setImg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!src) {
			setImg(null);
			return;
		}
		let alive = true;
		const el = new Image();
		el.onload = () => {
			if (alive) setImg(el);
		};
		el.src = src;
		return () => {
			alive = false;
		};
	}, [src]);
	return img;
}
function toColorInput(hex) {
	const h = hex.trim();
	if (/^#[0-9a-fA-F]{6}$/.test(h)) return h;
	return "#E0A67A";
}
function DressUp() {
	const [parts, setParts] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [look, setLook] = (0, import_react.useState)(defaultLook);
	const [tab, setTab] = (0, import_react.useState)("head");
	const [bodyTone, setBodyTone] = (0, import_react.useState)("light");
	const [ready, setReady] = (0, import_react.useState)(false);
	const canvasRef = (0, import_react.useRef)(null);
	const reelRef = (0, import_react.useRef)(null);
	const lookRef = (0, import_react.useRef)(look);
	const tabRef = (0, import_react.useRef)("head");
	const toneRef = (0, import_react.useRef)(bodyTone);
	const partsRef = (0, import_react.useRef)(parts);
	const imagesRef = (0, import_react.useRef)({
		body: null,
		head: null,
		hair: null,
		eyes: null,
		nose: null,
		mouth: null,
		hairPart: null
	});
	const liveAdjustRef = (0, import_react.useRef)(null);
	const holdingRef = (0, import_react.useRef)(false);
	const exportingRef = (0, import_react.useRef)(false);
	const motionRef = (0, import_react.useRef)(true);
	const gestureRef = (0, import_react.useRef)(null);
	const pointersRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const boxesRef = (0, import_react.useRef)([]);
	const viewRef = (0, import_react.useRef)({
		zoom: 1,
		focusY: STAGE_H * .42
	});
	const dotRef = (0, import_react.useRef)(null);
	const paintRef = (0, import_react.useRef)(() => {});
	const tuneRef = (0, import_react.useRef)(null);
	const [tuneOn, setTuneOn] = (0, import_react.useState)(true);
	const [phase, setPhase] = (0, import_react.useState)("you");
	const [me, setMe] = (0, import_react.useState)(null);
	const [classmate, setClassmate] = (0, import_react.useState)(null);
	const [cast, setCast] = (0, import_react.useState)(null);
	lookRef.current = look;
	if (tab !== "glasses") tabRef.current = tab;
	toneRef.current = bodyTone;
	partsRef.current = parts;
	(0, import_react.useEffect)(() => {
		setLook(loadLook());
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		const tune = createTune();
		tuneRef.current = tune;
		const drop = () => {
			window.removeEventListener("pointerdown", kick);
			window.removeEventListener("keydown", kick);
		};
		const kick = (event) => {
			const target = event.target;
			if (target instanceof Element && target.closest(".tune-btn")) return;
			if (!tune.wanted) {
				drop();
				return;
			}
			if (!tune.start()) return;
			setTuneOn(true);
			drop();
		};
		tune.start();
		setTuneOn(true);
		window.addEventListener("pointerdown", kick);
		window.addEventListener("keydown", kick);
		return () => {
			drop();
			tune.stop();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		const t = window.setTimeout(() => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(look));
		}, 180);
		return () => window.clearTimeout(t);
	}, [look, ready]);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const apply = () => {
			motionRef.current = !mq.matches;
		};
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, []);
	(0, import_react.useEffect)(() => {
		let alive = true;
		fetch(previewAssetUrl("/dressup/catalog.json")).then((r) => {
			if (!r.ok) throw new Error("Could not load the pictures.");
			return r.json();
		}).then((data) => {
			if (alive) setParts(data.map((part) => ({
				...part,
				src: previewAssetUrl(part.src)
			})));
		}).catch(() => {
			if (alive) setError("The picture pieces did not load. Try again in a moment.");
		});
		return () => {
			alive = false;
		};
	}, []);
	const byId = /* @__PURE__ */ new Map();
	parts?.forEach((p) => byId.set(p.id, p));
	(0, import_react.useEffect)(() => {
		const tone = look.body ? byId.get(look.body)?.tone : void 0;
		if (tone) setBodyTone(tone);
	}, [look.body, parts]);
	const body = useSprite(look.body ? byId.get(look.body)?.src ?? null : null);
	const head = useSprite(look.head ? byId.get(look.head)?.src ?? null : null);
	const hairPart = look.hair ? byId.get(look.hair) ?? null : null;
	imagesRef.current = {
		body,
		head,
		hair: useSprite(hairPart?.src ?? null),
		eyes: useSprite(look.eyes ? byId.get(look.eyes)?.src ?? null : null),
		nose: useSprite(look.nose ? byId.get(look.nose)?.src ?? null : null),
		mouth: useSprite(look.mouth ? byId.get(look.mouth)?.src ?? null : null),
		hairPart
	};
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = 680 * dpr;
		canvas.height = STAGE_H * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const paint = (phase) => {
			const imgs = imagesRef.current;
			const current = lookRef.current;
			const kind = tabRef.current;
			const upper = kind !== "body";
			const aimZoom = viewZoom(kind);
			const aimY = upper ? STAGE_H * .4 : STAGE_H * .5;
			const ease = motionRef.current ? .2 : 1;
			const view = viewRef.current;
			view.zoom += (aimZoom - view.zoom) * ease;
			view.focusY += (aimY - view.focusY) * ease;
			const scene = paintPerson(ctx, {
				body: imgs.body,
				head: imgs.head,
				hair: imgs.hair,
				eyes: imgs.eyes,
				nose: imgs.nose,
				mouth: imgs.mouth,
				hairPart: imgs.hairPart,
				glasses: current.glasses,
				skin: current.skin,
				name: current.name,
				adjust: liveAdjustRef.current ?? current.adjust
			}, phase, view, exportingRef.current || partId(current, kind) === null ? null : kind);
			boxesRef.current = scene.boxes;
			const dot = dotRef.current;
			const guided = scene.boxes.find((item) => item.kind === kind);
			if (dot) {
				if (!guided || exportingRef.current || partId(current, kind) === null) dot.hidden = true;
				else {
					dot.hidden = false;
					dot.style.left = `${guided.hx / 680 * 100}%`;
					dot.style.top = `${guided.hy / STAGE_H * 100}%`;
				}
			}
		};
		paintRef.current = paint;
		let raf = 0;
		let phase = 0;
		let last = performance.now();
		let running = true;
		const frame = (now) => {
			if (!running) return;
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			if (holdingRef.current || !motionRef.current || document.hidden) phase = 0;
			else phase += dt * 2.15;
			paint(phase);
			raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);
		return () => {
			running = false;
			cancelAnimationFrame(raf);
			tuneRef.current?.stop();
		};
	}, []);
	const slots = parts && tab !== "glasses" ? slotsFor(parts, tab, bodyTone) : [];
	const selectedId = tab === "glasses" ? look.glasses : partId(look, tab);
	const selectedIndex = tab === "glasses" ? GLASSES.findIndex((item) => item.id === look.glasses) : slots.findIndex((s) => s.id === selectedId);
	const choiceCount = tab === "glasses" ? GLASSES.length : slots.length;
	const place = selectedIndex >= 0 ? selectedIndex + 1 : 1;
	const tabLabel = TABS.find((t) => t.id === tab)?.label ?? "Piece";
	const pieceOn = selectedId !== null;
	const sizeLabel = tab === "glasses" ? "" : `${Math.round(clampAdjust(look.adjust[tab]).s * 100)}%`;
	(0, import_react.useEffect)(() => {
		const root = reelRef.current;
		if (!root) return;
		root.querySelector("[data-on='true']")?.scrollIntoView({
			inline: "center",
			block: "nearest",
			behavior: "smooth"
		});
	}, [
		tab,
		bodyTone,
		selectedId,
		parts
	]);
	function step(dir) {
		if (tab === "glasses") {
			const next = GLASSES[(GLASSES.findIndex((item) => item.id === look.glasses) + dir + GLASSES.length) % GLASSES.length];
			setLook((prev) => ({
				...prev,
				glasses: next.id
			}));
			return;
		}
		const catalog = partsRef.current;
		if (!catalog) return;
		const kind = tabRef.current;
		const nextSlots = slotsFor(catalog, kind, toneRef.current);
		setLook((prev) => withPart(prev, kind, cycleId(nextSlots, partId(prev, kind), dir)));
	}
	function centrePiece() {
		const kind = tabRef.current;
		setLook((prev) => ({
			...prev,
			adjust: {
				...prev.adjust,
				[kind]: {
					x: 0,
					y: 0,
					s: 1
				}
			}
		}));
	}
	function toggleTune() {
		tuneRef.current ??= createTune();
		setTuneOn(tuneRef.current.toggle());
	}
	function scaledSize(start, dist, startDist) {
		const safe = Math.max(72, startDist);
		return start * (1 + (dist - startDist) / safe * .4);
	}
	function stagePoint(clientX, clientY) {
		const canvas = canvasRef.current;
		if (!canvas) return {
			x: 0,
			y: 0
		};
		const rect = canvas.getBoundingClientRect();
		return {
			x: (clientX - rect.left) / rect.width * 680,
			y: (clientY - rect.top) / rect.height * STAGE_H
		};
	}
	function hitHandle(p) {
		const box = boxesRef.current.find((item) => item.kind === tabRef.current);
		if (!box || partId(lookRef.current, tabRef.current) === null) return false;
		return Math.hypot(p.x - box.hx, p.y - box.hy) <= 30;
	}
	function applyGesture(clientX, clientY) {
		const gesture = gestureRef.current;
		if (!gesture) return;
		const current = lookRef.current.adjust;
		if (gesture.mode === "pinch") {
			const pts = [...pointersRef.current.values()];
			if (pts.length < 2) return;
			const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
			liveAdjustRef.current = {
				...current,
				[gesture.kind]: clampAdjust({
					...gesture.start,
					s: scaledSize(gesture.start.s, dist, gesture.startDist)
				})
			};
			return;
		}
		if (gesture.mode === "scale") {
			const p = stagePoint(clientX, clientY);
			const dist = Math.hypot(p.x - gesture.cx, p.y - gesture.cy) || 1;
			liveAdjustRef.current = {
				...current,
				[gesture.kind]: clampAdjust({
					...gesture.start,
					s: scaledSize(gesture.start.s, dist, gesture.startDist)
				})
			};
			return;
		}
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const zoom = Math.max(.8, viewRef.current.zoom);
		let dx = (clientX - gesture.sx) / rect.width * 680 / zoom;
		let dy = (clientY - gesture.sy) / rect.height * STAGE_H / zoom;
		dx *= .72;
		dy *= .72;
		liveAdjustRef.current = {
			...current,
			[gesture.kind]: clampAdjust({
				x: gesture.start.x + dx,
				y: gesture.start.y + dy,
				s: gesture.start.s
			})
		};
	}
	function snapshotLook() {
		const pending = liveAdjustRef.current;
		const adjust = freshAdjust();
		Object.keys(adjust).forEach((kind) => {
			adjust[kind] = clampAdjust(pending?.[kind] ?? look.adjust[kind]);
		});
		return {
			...look,
			adjust
		};
	}
	function restartPerson() {
		liveAdjustRef.current = null;
		setLook((prev) => ({
			...defaultLook(),
			name: prev.name,
			skin: prev.skin
		}));
		setTab("head");
	}
	function thisIsMe() {
		setMe(snapshotLook());
		liveAdjustRef.current = null;
		setLook(defaultLook());
		setTab("head");
		setPhase("classmate");
	}
	function letTheStoryBegin() {
		if (!me) return;
		setCast({
			me,
			classmate: snapshotLook()
		});
	}
	function surprise() {
		if (!parts) return;
		const choose = (kind) => {
			const pool = parts.filter((p) => p.kind === kind);
			return pool[Math.floor(Math.random() * pool.length)];
		};
		const bodyPart = choose("body");
		const family = bodyPart.tone === "deep" ? SKINS.slice(3) : SKINS.slice(0, 4);
		const skin = family[Math.floor(Math.random() * family.length)].hex;
		liveAdjustRef.current = null;
		setLook((prev) => ({
			...prev,
			head: choose("head").id,
			hair: Math.random() < .82 ? choose("hair").id : null,
			eyes: choose("eyes").id,
			nose: choose("nose").id,
			mouth: choose("mouth").id,
			body: bodyPart.id,
			glasses: Math.random() < .5 ? GLASSES[1 + Math.floor(Math.random() * (GLASSES.length - 1))].id : null,
			skin,
			adjust: freshAdjust()
		}));
	}
	function onDotDown(e) {
		e.stopPropagation();
		const kind = tabRef.current;
		if (partId(lookRef.current, kind) === null) return;
		pointersRef.current.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		});
		e.currentTarget.setPointerCapture(e.pointerId);
		const point = stagePoint(e.clientX, e.clientY);
		const box = boxesRef.current.find((item) => item.kind === kind);
		const cx = box ? box.x + box.w / 2 : point.x;
		const cy = box ? box.y + box.h / 2 : point.y;
		const start = liveAdjustRef.current?.[kind] ?? clampAdjust(lookRef.current.adjust[kind]);
		gestureRef.current = {
			mode: "scale",
			pointerId: e.pointerId,
			kind,
			start,
			sx: e.clientX,
			sy: e.clientY,
			startDist: Math.max(120, Math.hypot(point.x - cx, point.y - cy)),
			cx,
			cy
		};
		holdingRef.current = true;
	}
	function onPointerDown(e) {
		pointersRef.current.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		});
		e.currentTarget.setPointerCapture(e.pointerId);
		const point = stagePoint(e.clientX, e.clientY);
		if (pointersRef.current.size >= 2 && partId(lookRef.current, tabRef.current) !== null) {
			const pts = [...pointersRef.current.values()];
			const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
			const kind = gestureRef.current?.kind ?? tabRef.current;
			const start = liveAdjustRef.current?.[kind] ?? clampAdjust(lookRef.current.adjust[kind]);
			gestureRef.current = {
				mode: "pinch",
				pointerId: e.pointerId,
				kind,
				start,
				sx: 0,
				sy: 0,
				startDist: dist,
				cx: 0,
				cy: 0
			};
			holdingRef.current = true;
			return;
		}
		if (hitHandle(point)) {
			const box = boxesRef.current.find((item) => item.kind === tabRef.current);
			if (!box) return;
			const start = clampAdjust(lookRef.current.adjust[tabRef.current]);
			gestureRef.current = {
				mode: "scale",
				pointerId: e.pointerId,
				kind: tabRef.current,
				start,
				sx: e.clientX,
				sy: e.clientY,
				startDist: Math.hypot(point.x - (box.x + box.w / 2), point.y - (box.y + box.h / 2)) || 1,
				cx: box.x + box.w / 2,
				cy: box.y + box.h / 2
			};
			holdingRef.current = true;
			return;
		}
		const kind = tabRef.current;
		if (partId(lookRef.current, kind) === null) return;
		const start = clampAdjust(lookRef.current.adjust[kind]);
		gestureRef.current = {
			mode: "move",
			pointerId: e.pointerId,
			kind,
			start,
			sx: e.clientX,
			sy: e.clientY,
			startDist: 1,
			cx: 0,
			cy: 0
		};
		holdingRef.current = true;
	}
	function onPointerMove(e) {
		if (!pointersRef.current.has(e.pointerId)) return;
		pointersRef.current.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		});
		const gesture = gestureRef.current;
		if (!gesture) return;
		if (gesture.mode !== "pinch" && gesture.pointerId !== e.pointerId) return;
		applyGesture(e.clientX, e.clientY);
	}
	function onPointerUp(e) {
		pointersRef.current.delete(e.pointerId);
		if (pointersRef.current.size > 0) {
			if (gestureRef.current?.mode === "pinch") gestureRef.current = null;
			return;
		}
		gestureRef.current = null;
		holdingRef.current = false;
		const pending = liveAdjustRef.current;
		liveAdjustRef.current = null;
		if (pending) setLook((prev) => ({
			...prev,
			adjust: pending
		}));
	}
	if (cast && parts) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryBook, {
		me: cast.me,
		classmate: cast.classmate,
		parts,
		tuneOn,
		onTune: toggleTune,
		onAgain: () => {
			setCast(null);
			setMe(null);
			setClassmate(null);
			setPhase("you");
			setTab("head");
			setLook(defaultLook());
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "layout",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "stage-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "slot-head mb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bulb-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bulb bulb-coral" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bulb" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bulb bulb-coral" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-sans text-xs font-extrabold tracking-widest text-coral uppercase",
										children: "Dress-up"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "tune-btn font-sans text-sm",
								"data-on": tuneOn ? "true" : "false",
								"aria-pressed": tuneOn,
								onClick: toggleTune,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, {
									className: "size-4",
									"aria-hidden": true
								}), tuneOn ? "Tune on" : "Play tune"]
							})]
						}),
						(me || classmate) && parts ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "title-band",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "story-row",
								children: [me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LittlePerson, {
									look: me,
									parts,
									caption: "Me"
								}) : null, classmate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LittlePerson, {
									look: classmate,
									parts,
									caption: "Classmate"
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "title-lockup",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									className: "title-art",
									src: previewAssetUrl(phase === "you" ? "/story/make-you.png" : "/story/make-classmate.png"),
									alt: phase === "you" ? "Make you!" : "Make your classmate!"
								})
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "title-lockup",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								className: "title-art",
								src: previewAssetUrl("/story/make-you.png"),
								alt: "Make you!"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "lede mt-2 max-w-md text-base text-muted",
							children: "Start with a head. Each piece appears when you choose it. Drag it, or pull the dot, to place it."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "slot-stage stage-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cabinet",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rivet rivet-tl" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rivet rivet-tr" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rivet rivet-bl" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rivet rivet-br" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "cabinet-screen",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
										ref: canvasRef,
										width: 680,
										height: STAGE_H,
										className: "stage-canvas",
										"aria-label": "Your person in the park. Tap a piece to grab it, drag to move it, and pinch or pull the dot to scale it.",
										onPointerDown,
										onPointerMove,
										onPointerUp,
										onPointerCancel: onPointerUp
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										ref: dotRef,
										type: "button",
										className: "grab-dot",
										hidden: true,
										"aria-label": "Pull to change the size of this piece",
										onPointerDown: onDotDown,
										onPointerMove,
										onPointerUp,
										onPointerCancel: onPointerUp
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "toy-arrow toy-arrow-left",
							"aria-label": `Previous ${tabLabel.toLowerCase()}`,
							disabled: !parts,
							onClick: () => step(-1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
								className: "size-7",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "toy-arrow toy-arrow-right",
							"aria-label": `Next ${tabLabel.toLowerCase()}`,
							disabled: !parts,
							onClick: () => step(1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								className: "size-7",
								"aria-hidden": true
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "slot-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block font-sans text-sm font-extrabold text-ink",
							children: phase === "you" ? "Your name" : "Classmate's name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: look.name,
							maxLength: 22,
							onChange: (e) => setLook((prev) => ({
								...prev,
								name: e.target.value
							})),
							placeholder: phase === "you" ? "Type your name" : "Type their name",
							className: "nameplate"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: restartPerson,
								className: "toy-go toy-ghost",
								children: "Restart"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: surprise,
								disabled: !parts,
								className: "toy-go toy-ghost",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, {
									className: "size-5",
									"aria-hidden": true
								}), "Surprise me"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: phase === "you" ? thisIsMe : letTheStoryBegin,
								disabled: !parts,
								className: "toy-go col-span-2",
								children: phase === "you" ? "This is me" : "Let the story begin!"
							})
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "console min-w-0",
			children: [
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "console-card mb-3 text-ink",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "slot-pick",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 flex flex-wrap gap-2",
						role: "tablist",
						"aria-label": "Piece to change",
						children: TABS.map((item) => {
							const on = tab === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": on,
								"data-on": on ? "true" : "false",
								onClick: () => setTab(item.id),
								className: "toy-tab font-sans text-base",
								children: item.label
							}, item.id);
						})
					}), !parts ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-base font-bold text-muted",
						children: "Lining up the pictures…"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						tab === "body" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex gap-2",
							role: "group",
							"aria-label": "Body tone",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-on": bodyTone === "light" ? "true" : "false",
								onClick: () => setBodyTone("light"),
								className: "toy-tab font-sans text-base",
								children: "Lighter"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-on": bodyTone === "deep" ? "true" : "false",
								onClick: () => setBodyTone("deep"),
								className: "toy-tab font-sans text-base",
								children: "Deeper"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-sans text-base font-extrabold text-ink",
								children: selectedId === null ? `No ${tabLabel.toLowerCase()}` : tabLabel
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "font-sans text-sm font-extrabold text-coral disabled:opacity-40",
									disabled: !pieceOn,
									onClick: centrePiece,
									children: "Reset place"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-sans text-sm font-extrabold text-muted",
									"aria-live": "polite",
									children: [selectedIndex >= 0 ? `${place} of ${choiceCount}` : `${choiceCount} in this set`, pieceOn ? ` · ${sizeLabel}` : ""]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: reelRef,
							className: "reel",
							role: "group",
							"aria-label": `${tabLabel} choices`,
							tabIndex: 0,
							onKeyDown: (e) => {
								if (e.key === "ArrowLeft") {
									e.preventDefault();
									step(-1);
								} else if (e.key === "ArrowRight") {
									e.preventDefault();
									step(1);
								}
							},
							children: tab === "glasses" ? GLASSES.map((item) => {
								const on = item.id === look.glasses;
								const round = item.id?.startsWith("round");
								const blue = item.id?.endsWith("blue");
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-on": on ? "true" : "false",
									"aria-label": item.label,
									"aria-pressed": on,
									onClick: () => setLook((prev) => ({
										...prev,
										glasses: item.id
									})),
									className: "reel-item font-sans text-sm",
									children: item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: round ? "specs specs-round" : "specs",
										"aria-hidden": true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { borderColor: blue ? "#2f62d6" : "#1a120e" } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { borderColor: blue ? "#2f62d6" : "#1a120e" } })]
									}) : "None"
								}, item.id ?? "none");
							}) : slots.map((slot, index) => {
								const on = slot.id === selectedId;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-on": on ? "true" : "false",
									"aria-label": slot.part ? `${tabLabel} ${index + 1}` : `No ${tabLabel.toLowerCase()}`,
									"aria-pressed": on,
									onClick: () => setLook((prev) => withPart(prev, tab, slot.id)),
									className: "reel-item font-sans text-sm",
									children: slot.part ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: slot.part.src,
										alt: "",
										className: "max-h-full max-w-full object-contain",
										draggable: false
									}) : "None"
								}, slot.id ?? "none");
							})
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "slot-tools mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "console-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-sans text-base font-extrabold text-ink",
								children: "Head colour"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex items-center gap-2 font-sans text-sm font-extrabold text-muted",
								children: ["Any colour", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "color",
									value: toColorInput(look.skin),
									onChange: (e) => setLook((prev) => ({
										...prev,
										skin: e.target.value
									})),
									"aria-label": "Choose any head colour",
									className: "colour-input"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: SKINS.map((swatch) => {
								const on = look.skin.toLowerCase() === swatch.hex.toLowerCase();
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": swatch.label,
									"aria-pressed": on,
									"data-on": on ? "true" : "false",
									onClick: () => setLook((prev) => ({
										...prev,
										skin: swatch.hex
									})),
									className: "swatch",
									style: { backgroundColor: swatch.hex }
								}, swatch.hex);
							})
						})]
					})
				})
			]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DressUp, {});
}
//#endregion
export { Home as component };
