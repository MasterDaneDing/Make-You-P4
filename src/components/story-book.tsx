import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { paintPerson, STAGE_H, STAGE_W } from "@/lib/dress/paint";
import type { Look, Part } from "@/lib/dress/types";
import { previewAssetUrl } from "@/lib/preview-path-prefix";
import { drawPlace } from "@/lib/story/places";
import { sendStory } from "@/lib/story/drive";
import {
  FUNG_SRC,
  HELPER_LABEL,
  HELPER_SRC,
  PAGE_COUNT,
  PLACES,
  PLACE_LABEL,
  SONG_SRC,
  called,
  makeTale,
  sentence,
  type Hurt,
  type Tale,
} from "@/lib/story/tale";

const FRAME_W = 960;
const FRAME_H = 540;
const OUT = 280;

type Pose = "stand" | "dance" | "slide" | "jump" | "run" | "sing" | "fall" | "carried";

function useImage(src: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
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

function useActor(look: Look, parts: Part[]) {
  const byId = new Map(parts.map((part) => [part.id, part]));
  const hairPart = look.hair ? (byId.get(look.hair) ?? null) : null;
  const body = useImage(look.body ? (byId.get(look.body)?.src ?? null) : null);
  const head = useImage(look.head ? (byId.get(look.head)?.src ?? null) : null);
  const hair = useImage(hairPart?.src ?? null);
  const eyes = useImage(look.eyes ? (byId.get(look.eyes)?.src ?? null) : null);
  const nose = useImage(look.nose ? (byId.get(look.nose)?.src ?? null) : null);
  const mouth = useImage(look.mouth ? (byId.get(look.mouth)?.src ?? null) : null);
  const pack = useRef({ body, head, hair, eyes, nose, mouth, hairPart, look });
  pack.current = { body, head, hair, eyes, nose, mouth, hairPart, look };
  const off = useRef<HTMLCanvasElement | null>(null);
  const crop = useRef<{ key: string; x: number; y: number; w: number; h: number } | null>(null);

  const draw = (
    ctx: CanvasRenderingContext2D,
    x: number,
    ground: number,
    height: number,
    phase: number,
    pose: Pose,
  ) => {
    const cur = pack.current;
    if (!cur.body && !cur.head) return;
    if (!off.current) {
      off.current = document.createElement("canvas");
      off.current.width = STAGE_W + OUT * 2;
      off.current.height = STAGE_H + OUT * 2;
    }
    const sheet = off.current;
    const source = sheet.getContext("2d");
    if (!source) return;
    const paint = (at: number) => {
      source.setTransform(1, 0, 0, 1, 0, 0);
      source.clearRect(0, 0, sheet.width, sheet.height);
      source.setTransform(1, 0, 0, 1, OUT, OUT);
      paintPerson(
        source,
        {
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
          adjust: cur.look.adjust,
        },
        at,
        { zoom: 1, focusY: STAGE_H * 0.5 },
        null,
        true,
      );
    };
    const key = [
      cur.body?.src ?? "",
      cur.head?.src ?? "",
      cur.hair?.src ?? "",
      cur.eyes?.src ?? "",
      cur.nose?.src ?? "",
      cur.mouth?.src ?? "",
      cur.look.skin,
      cur.look.glasses ?? "",
      JSON.stringify(cur.look.adjust),
    ].join("|");
    const ready =
      (!cur.look.body || cur.body) &&
      (!cur.look.head || cur.head) &&
      (!cur.look.hair || cur.hair);
    if (ready && crop.current?.key !== key) {
      let minX = sheet.width;
      let minY = sheet.height;
      let maxX = 0;
      let maxY = 0;
      for (const at of [0, 0.8, 1.7, 2.5, 3.4, 4.3, 5.2]) {
        paint(at);
        const data = source.getImageData(0, 0, sheet.width, sheet.height).data;
        const width = sheet.width;
        for (let y = 0; y < sheet.height; y += 2) {
          for (let px = 0; px < width; px += 2) {
            if (data[(y * width + px) * 4 + 3]! > 12) {
              if (px < minX) minX = px;
              if (y < minY) minY = y;
              if (px > maxX) maxX = px;
              if (y > maxY) maxY = y;
            }
          }
        }
      }
      if (maxX > minX) {
        const pad = 28;
        const left = Math.max(0, minX - pad);
        const top = Math.max(0, minY - pad);
        const right = Math.min(sheet.width, maxX + pad);
        const bottom = Math.min(sheet.height, maxY + 6);
        crop.current = { key, x: left, y: top, w: right - left, h: bottom - top };
      }
    }
    paint(phase);
    const box = crop.current;
    if (!box) return;
    const scale = height / box.h;
    const dw = box.w * scale;
    let px = x;
    let py = ground;
    let rot = 0;
    if (pose === "dance") {
      py -= Math.abs(Math.sin(phase * 3)) * 12;
      rot = Math.sin(phase * 2) * 0.08;
    } else if (pose === "slide") px += Math.sin(phase * 1.3) * 34;
    else if (pose === "jump") py -= Math.abs(Math.sin(phase * 3.1)) * 48;
    else if (pose === "run") {
      px += Math.sin(phase * 2.2) * 64;
      rot = 0.08;
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
      ctx.fillText("♪", px + dw * 0.35, py - height + Math.sin(phase * 5) * 8);
    }
  };

  return draw;
}

function poseFor(page: number, action: Tale["action"], who: "me" | "pal"): Pose {
  if (page === 0 || page === 8) return "dance";
  if (page === 1) return "slide";
  if (page === 2) {
    if (who === "me") return "stand";
    if (action === "jumping") return "jump";
    if (action === "running") return "run";
    if (action === "singing") return "sing";
    return "dance";
  }
  if (page === 3 || page === 4) return who === "pal" ? "fall" : "stand";
  if (page === 6) return who === "pal" ? "carried" : "stand";
  return "stand";
}

function HurtMark({ hurt }: { hurt: Hurt }) {
  return (
    <svg className="hurt-mark" viewBox="0 0 64 64" aria-hidden>
      {hurt === "tongue" ? <ellipse cx="32" cy="34" rx="12" ry="16" fill="#e85d4c" stroke="#241910" strokeWidth="4" /> : null}
      {hurt === "nose" ? <ellipse cx="32" cy="32" rx="10" ry="14" fill="#e0a67a" stroke="#241910" strokeWidth="4" /> : null}
      {hurt === "brain" ? <path d="M18 34c0-12 8-20 14-20s14 8 14 20-6 16-14 16-14-6-14-16z" fill="#f2a3c7" stroke="#241910" strokeWidth="4" /> : null}
      {hurt === "hand" || hurt === "arm" ? <path d="M20 40c6-16 20-16 24 0" fill="none" stroke="#241910" strokeWidth="6" strokeLinecap="round" /> : null}
      {hurt === "leg" || hurt === "foot" ? <path d="M28 14v24c8 0 14 6 14 10H22" fill="none" stroke="#241910" strokeWidth="6" strokeLinecap="round" /> : null}
      {hurt === "pat-pat" ? <ellipse cx="32" cy="34" rx="16" ry="12" fill="#e0a67a" stroke="#241910" strokeWidth="4" /> : null}
      <circle cx="32" cy="32" r="22" fill="none" stroke="#d8442c" strokeWidth="5" />
      <path d="M16 16l32 32" stroke="#d8442c" strokeWidth="5" />
    </svg>
  );
}

export function StoryBook({
  me,
  classmate,
  parts,
  tuneOn,
  onTune,
  onAgain,
}: {
  me: Look;
  classmate: Look;
  parts: Part[];
  tuneOn: boolean;
  onTune: () => void;
  onAgain: () => void;
}) {
  const [tale, setTale] = useState(() => makeTale(me, classmate));
  const [page, setPage] = useState(0);
  const [localPdf, setLocalPdf] = useState<{ url: string; name: string } | null>(null);
  const [savingDrive, setSavingDrive] = useState(false);
  const [sent, setSent] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState(false);
  const sessionId = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `story-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const taleRef = useRef(tale);
  const pageRef = useRef(page);
  taleRef.current = tale;
  pageRef.current = page;
  const drawMe = useActor(me, parts);
  const drawPal = useActor(classmate, parts);
  const helperImg = useImage(previewAssetUrl(HELPER_SRC[tale.helper]));
  const guestImg = useImage(previewAssetUrl(HELPER_SRC[tale.guest]));
  const fungImg = useImage(previewAssetUrl(FUNG_SRC));
  const drawMeRef = useRef(drawMe);
  const drawPalRef = useRef(drawPal);
  const helperRef = useRef(helperImg);
  const guestRef = useRef(guestImg);
  const fungRef = useRef(fungImg);
  const songRef = useRef<HTMLAudioElement | null>(null);
  const silenced = useRef(false);
  const tuneOnRef = useRef(tuneOn);
  tuneOnRef.current = tuneOn;
  drawMeRef.current = drawMe;
  drawPalRef.current = drawPal;
  helperRef.current = helperImg;
  guestRef.current = guestImg;
  fungRef.current = fungImg;

  useEffect(() => {
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
    const tick = (now: number) => {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) clock += dt * 2.1;
      paintFrame(
        ctx,
        taleRef.current,
        pageRef.current,
        clock,
        drawMeRef.current,
        drawPalRef.current,
        helperRef.current,
        guestRef.current,
        fungRef.current,
      );
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  function buildPdf() {
    if (!tale.place) return null;
    const shot = document.createElement("canvas");
    shot.width = FRAME_W;
    shot.height = FRAME_H;
    const ctx = shot.getContext("2d");
    if (!ctx) return null;
    const captionH = 110;
    const page = document.createElement("canvas");
    page.width = FRAME_W;
    page.height = FRAME_H + captionH;
    const out = page.getContext("2d");
    if (!out) return null;
    const lines = Array.from({ length: PAGE_COUNT }, (_, i) => sentence(tale, i));
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [FRAME_W, FRAME_H + captionH],
      hotfixes: ["px_scaling"],
      compress: true,
    });
    for (let i = 0; i < PAGE_COUNT; i += 1) {
      paintFrame(ctx, tale, i, 1.1 + i * 0.4, drawMe, drawPal, helperImg, guestImg, fungImg);
      out.fillStyle = "#f4efe4";
      out.fillRect(0, 0, page.width, page.height);
      out.drawImage(shot, 0, 0);
      out.fillStyle = "#241910";
      out.font = "700 26px Georgia, serif";
      out.textBaseline = "top";
      wrapText(out, lines[i] ?? "", 28, FRAME_H + 16, FRAME_W - 56, 30);
      if (i > 0) pdf.addPage([FRAME_W, FRAME_H + captionH], "landscape");
      pdf.addImage(page.toDataURL("image/jpeg", 0.86), "JPEG", 0, 0, FRAME_W, FRAME_H + captionH);
    }
    return pdf;
  }

  useEffect(() => {
    if (page !== PAGE_COUNT - 1 || !tale.place) return;
    let dead = false;
    const timer = window.setTimeout(() => {
      if (dead) return;
      const pdf = buildPdf();
      if (!pdf || dead) return;
      const file = new Blob([pdf.output("blob")], { type: "application/octet-stream" });
      const url = URL.createObjectURL(file);
      const meName = called(tale.me, "Student").replace(/[^\w]+/g, "_");
      const palName = called(tale.classmate, "classmate").replace(/[^\w]+/g, "_");
      setLocalPdf((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url, name: `${meName}_and_${palName}.pdf` };
      });
    }, 80);
    return () => {
      dead = true;
      window.clearTimeout(timer);
    };
  }, [page, tale, helperImg, guestImg, fungImg]);

  async function sendToDane() {
    if (!tale.place) {
      setNote("Choose a place first.");
      setPage(0);
      return;
    }
    setSavingDrive(true);
    setNote(null);
    try {
      const pdf = buildPdf();
      if (!pdf) return;
      const lines = Array.from({ length: PAGE_COUNT }, (_, i) => sentence(tale, i));
      const meName = called(tale.me, "Student");
      const palName = called(tale.classmate, "classmate");
      const dataUri = pdf.output("datauristring");
      await sendStory({
        sessionId: sessionId.current,
        characterName: `${meName} and ${palName}`,
        pdfBase64: dataUri.split(",")[1] ?? "",
        background: tale.place,
        skinTone: tale.me.skin,
        dress: tale.me.body ?? "none",
        story: lines.join("\n\n"),
      });
      setSent(true);
      setNote("Sent to Mr. Dane.");
    } catch {
      setNote("It did not reach Mr. Dane. Try again.");
    } finally {
      setSavingDrive(false);
    }
  }

  useEffect(() => {
    const audio = new Audio(previewAssetUrl(SONG_SRC));
    audio.preload = "auto";
    songRef.current = audio;
    return () => {
      audio.pause();
    };
  }, []);

  function startEndingSong() {
    if (tuneOnRef.current && !silenced.current) {
      silenced.current = true;
      onTune();
    }
    const audio = songRef.current ?? new Audio(previewAssetUrl(SONG_SRC));
    songRef.current = audio;
    if (!audio.paused && audio.currentTime > 0.2) return;
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }

  function leaveEnding() {
    songRef.current?.pause();
    if (silenced.current) {
      silenced.current = false;
      if (!tuneOnRef.current) onTune();
    }
  }

  function openLyrics() {
    startEndingSong();
    setLyrics(true);
  }

  function closeLyrics() {
    setLyrics(false);
  }

  const words = sentence(tale, page);

  return (
    <main className="story-page">
      <header className="mb-3 flex items-center justify-between gap-3">
        <p className="font-sans text-xs font-extrabold tracking-widest text-coral uppercase">The story</p>
        <button type="button" className="tune-btn font-sans text-sm" onClick={onTune} aria-pressed={tuneOn}>
          {tuneOn ? "Tune on" : "Play tune"}
        </button>
      </header>
      <div className="story-frame">
        <canvas ref={canvasRef} aria-label="The story picture" />
      </div>
      <p className="story-words">
        {page === 3 ? <HurtMark hurt={tale.hurt} /> : null}
        {words}
      </p>
      {page === 0 ? (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Where the accident happened">
          {PLACES.map((place) => (
            <button
              key={place}
              type="button"
              data-on={tale.place === place ? "true" : "false"}
              className="toy-tab font-sans text-base capitalize"
              onClick={() => setTale((prev) => ({ ...prev, place }))}
            >
              {PLACE_LABEL[place]}
            </button>
          ))}
        </div>
      ) : null}
      {page === 8 ? (
        <div className="mt-3">
          <button type="button" className="toy-go toy-ghost" onClick={openLyrics}>
            Song lyrics
          </button>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="toy-go toy-ghost" disabled={page === 0} onClick={() => {
          if (page === PAGE_COUNT - 1) leaveEnding();
          setPage((n) => Math.max(0, n - 1));
        }}>
          Back
        </button>
        {page < PAGE_COUNT - 1 ? (
          <button
            type="button"
            className="toy-go"
            disabled={page === 0 && !tale.place}
            onClick={() => {
              const next = Math.min(PAGE_COUNT - 1, page + 1);
              setPage(next);
              if (next === PAGE_COUNT - 1) startEndingSong();
            }}
          >
            Next
          </button>
        ) : (
          <>
            {localPdf ? (
              <a className="toy-go toy-ghost" href={localPdf.url} download={localPdf.name} target="_blank" rel="noopener">
                Save here
              </a>
            ) : (
              <button type="button" className="toy-go toy-ghost" disabled>
                Preparing…
              </button>
            )}
            <button type="button" className="toy-go" disabled={savingDrive || sent} onClick={() => void sendToDane()}>
              {savingDrive ? "Sending…" : sent ? "Sent" : "Send to Mr. Dane"}
            </button>
          </>
        )}
        <button type="button" className="toy-go toy-ghost" onClick={() => {
          leaveEnding();
          onAgain();
        }}>
          New people
        </button>
      </div>
      <p className="mt-2 font-sans text-sm font-bold text-muted">Page {page + 1} of {PAGE_COUNT}{tale.helper ? ` · ${HELPER_LABEL[tale.helper]} is in this story` : ""}</p>
      {note ? <p className="mt-2 font-sans text-sm font-bold text-ink">{note}</p> : null}
      {lyrics ? (
        <div className="lyric-pop" role="presentation" onClick={closeLyrics}>
          <div
            className="lyric-card"
            role="dialog"
            aria-label="Song lyrics"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-sans text-xs font-extrabold tracking-widest text-coral uppercase">Going out with friends</p>
            {LYRICS.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <button type="button" className="toy-go mt-4" onClick={closeLyrics}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else line = next;
  }
  if (line) ctx.fillText(line, x, yy);
}

const LYRICS = [
  "We all love to have fun!",
  "It's something we all should feel!",
  "But let me tell you something important.",
  "No joking this is real!",
  "We should be careful when we're out.",
  "Or we might have an accident!",
  "We could fall or get hurt.",
  "Or to hospital, you might be sent!",
  "If you see someone have an accident,",
  "we shouldn't giggle or laugh!",
  "We need to respect each other!",
  "We can cry if we need to, we don't need to act tough!",
  "Going out is lots of fun,",
  "Let's be careful,",
  "That's a rule.",
  "It's rule number one!",
];

const trim = new WeakMap<HTMLImageElement, { x: number; y: number; w: number; h: number }>();

function opaqueBox(img: HTMLImageElement) {
  const hit = trim.get(img);
  if (hit) return hit;
  const sheet = document.createElement("canvas");
  sheet.width = img.naturalWidth;
  sheet.height = img.naturalHeight;
  const source = sheet.getContext("2d", { willReadFrequently: true });
  const fallback = { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
  if (!source) return fallback;
  source.drawImage(img, 0, 0);
  const data = source.getImageData(0, 0, sheet.width, sheet.height).data;
  let minX = sheet.width;
  let minY = sheet.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < sheet.height; y += 3) {
    for (let x = 0; x < sheet.width; x += 3) {
      if (data[(y * sheet.width + x) * 4 + 3]! > 16) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  const box = maxX > minX ? { x: minX, y: minY, w: maxX - minX, h: maxY - minY } : fallback;
  trim.set(img, box);
  return box;
}

function drawCutout(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  ground: number,
  height: number,
  phase: number,
  pose: "stand" | "dance" | "laugh",
) {
  if (!img?.naturalWidth) return;
  const box = opaqueBox(img);
  const scale = height / box.h;
  const dw = box.w * scale;
  let py = ground;
  let rot = 0;
  if (pose === "dance") {
    py -= Math.abs(Math.sin(phase * 3)) * 16;
    rot = Math.sin(phase * 2) * 0.07;
  } else if (pose === "laugh") {
    py -= Math.abs(Math.sin(phase * 4)) * 10;
    rot = Math.sin(phase * 5) * 0.06;
  }
  ctx.save();
  ctx.translate(x, py);
  ctx.rotate(rot);
  ctx.drawImage(img, box.x, box.y, box.w, box.h, -dw / 2, -height, dw, height);
  ctx.restore();
}

function paintFrame(
  ctx: CanvasRenderingContext2D,
  tale: Tale,
  page: number,
  phase: number,
  drawMe: ReturnType<typeof useActor>,
  drawPal: ReturnType<typeof useActor>,
  helper: HTMLImageElement | null,
  guest: HTMLImageElement | null,
  fung: HTMLImageElement | null,
) {
  drawPlace(ctx, tale.place, FRAME_W, FRAME_H, phase);
  const ground = FRAME_H - 2;
  const kid = page === 8 ? 330 : page === 4 || page === 5 ? 380 : 420;
  const shade = (x: number) => {
    ctx.save();
    ctx.fillStyle = "rgba(36, 25, 16, 0.16)";
    ctx.beginPath();
    ctx.ellipse(x, ground - 8, 54, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  const drift = Math.sin(phase * 1.2) * 36;
  if (page === 8) {
    const spots = [150, 370, 600, 820];
    shade(spots[0]!);
    shade(spots[1]!);
    shade(spots[2]!);
    shade(spots[3]!);
    drawMe(ctx, spots[0]!, ground, kid, phase, "dance");
    drawPal(ctx, spots[1]!, ground, kid, phase + 0.4, "dance");
    drawCutout(ctx, helper, spots[2]!, ground, kid + 10, phase + 0.8, "dance");
    drawCutout(ctx, guest, spots[3]!, ground, kid, phase + 1.2, "dance");
    return;
  }
  if (page === 6 && helper) {
    const hx = FRAME_W * 0.64 + drift;
    const hh = 460;
    shade(200);
    shade(hx);
    drawMe(ctx, 200, ground, 400, phase, "stand");
    drawCutout(ctx, helper, hx, ground, hh, phase, "stand");
    drawPal(ctx, hx - 10, ground - hh * 0.42, 230, phase, "carried");
    return;
  }
  if (page === 5) {
    shade(190);
    shade(470);
    shade(760);
    drawMe(ctx, 190, ground, kid, phase, "stand");
    drawPal(ctx, 470, ground, kid, phase + 0.5, "stand");
    drawCutout(ctx, helper, 760, ground, kid + 20, phase, "stand");
    return;
  }
  if (page === 4) {
    shade(200);
    shade(500);
    shade(790);
    drawMe(ctx, 200, ground, kid, phase, "stand");
    drawPal(ctx, 500, ground, kid, phase, "fall");
    drawCutout(ctx, fung, 790, ground, kid, phase, "laugh");
    return;
  }
  const left = page === 3 ? 220 : 320;
  const right = page === 3 ? 460 : 660;
  shade(left);
  shade(right);
  drawMe(ctx, left, ground, kid, phase, poseFor(page, tale.action, "me"));
  drawPal(ctx, right, ground, kid, phase + 0.6, poseFor(page, tale.action, "pal"));
}
