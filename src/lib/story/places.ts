import type { Place } from "./tale";

const SRC: Record<Place, string> = {
  park: "/story/places/park.png",
  classroom: "/story/places/classroom.jpg",
  toilet: "/story/places/toilet.jpg",
  moon: "/story/places/moon.png",
  zoo: "/story/places/zoo.jpg",
  aquarium: "/story/places/aquarium.png",
};

const cache = new Map<Place, HTMLImageElement>();

function picture(place: Place) {
  let img = cache.get(place);
  if (!img) {
    img = new Image();
    img.src = SRC[place];
    cache.set(place, img);
  }
  return img;
}

export function drawPlace(
  ctx: CanvasRenderingContext2D,
  place: Place | null,
  w: number,
  h: number,
  _phase: number,
) {
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, w, h);
  if (!place) {
    ctx.fillStyle = "#f4efe4";
    ctx.fillRect(0, 0, w, h);
    return;
  }
  ctx.fillStyle = "#e7f2f6";
  ctx.fillRect(0, 0, w, h);
  const img = picture(place);
  if (!img.complete || img.naturalWidth === 0) return;
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}
