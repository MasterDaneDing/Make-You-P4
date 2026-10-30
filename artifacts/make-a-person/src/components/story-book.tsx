import { useEffect, useRef, useState } from "react";
import { paintPerson, STAGE_H, STAGE_W } from "@/lib/dress/paint";
import type { Look, Part } from "@/lib/dress/types";
import { previewAssetUrl } from "@/lib/preview-path-prefix";
import { drawPlace } from "@/lib/story/places";
import { DRIVE_SCRIPT, loadWebhook, saveWebhook, sendStoryPdf } from "@/lib/story/drive";
import {
  HELPER_LABEL,
  HELPER_SRC,
  PLACES,
  PLACE_LABEL,
  called,
  makeTale,
  sentence,
  type Hurt,
  type Place,
  type Tale,
} from "@/lib/story/tale";

const FRAME_W = 960;
const FRAME_H = 540;

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
  const crop = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

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
      off.current.width = STAGE_W;
      off.current.height = STAGE_H;
    }
    const source = off.current.getContext("2d");
    if (!source) return;
    source.setTransform(1, 0, 0, 1, 0, 0);
    source.clearRect(0, 0, STAGE_W, STAGE_H);
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
      phase,
      { zoom: 1, focusY: STAGE_H * 0.5 },
      null,
      true,
    );
    if (!crop.current) {
      const data = source.getImageData(0, 0, STAGE_W, STAGE_H).data;
      let minX = STAGE_W;
      let minY = STAGE_H;
      let maxX = 0;
      let maxY = 0;
      for (let y = 0; y < STAGE_H; y += 3) {
        for (let px = 0; px < STAGE_W; px += 3) {
          if (data[(y * STAGE_W + px) * 4 + 3]! > 20) {
            if (px < minX) minX = px;
            if (y < minY) minY = y;
            if (px > maxX) maxX = px;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX > minX) {
        crop.current = {
          x: Math.max(0, minX - 8),
          y: Math.max(0, minY - 8),
          w: Math.min(STAGE_W, maxX + 8) - Math.max(0, minX - 8),
          h: Math.min(STAGE_H, maxY + 12) - Math.max(0, minY - 8),
        };
      }
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
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [webhook, setWebhook] = useState("");
  const [scriptCopied, setScriptCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    setWebhook(loadWebhook());
  }, []);
  const taleRef = useRef(tale);
  const pageRef = useRef(page);
  taleRef.current = tale;
  pageRef.current = page;
  const drawMe = useActor(me, parts);
  const drawPal = useActor(classmate, parts);
  const helperImg = useImage(previewAssetUrl(HELPER_SRC[tale.helper]));
  const drawMeRef = useRef(drawMe);
  const drawPalRef = useRef(drawPal);
  const helperRef = useRef(helperImg);
  drawMeRef.current = drawMe;
  drawPalRef.current = drawPal;
  helperRef.current = helperImg;

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
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const shot = document.createElement("canvas");
      shot.width = FRAME_W;
      shot.height = FRAME_H;
      const ctx = shot.getContext("2d");
      if (!ctx) return;
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const pictureW = pageW - 56;
      const pictureH = pictureW * (FRAME_H / FRAME_W);
      for (let i = 0; i < 7; i += 1) {
        if (i > 0) pdf.addPage();
        paintFrame(ctx, tale, i, 1.1 + i * 0.4, drawMe, drawPal, helperImg);
        pdf.addImage(shot.toDataURL("image/jpeg", 0.86), "JPEG", 28, 22, pictureW, pictureH);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(36, 25, 16);
        pdf.text(sentence(tale, i), 28, pictureH + 52, { maxWidth: pictureW });
      }
      const file = `${called(tale.me, "me")}-and-${called(tale.classmate, "classmate")}`.replace(/[^\w]+/g, "-");
      const filename = `${file}.pdf`.toLowerCase();
      const dataUri = pdf.output("datauristring") as string;
      pdf.save(filename);
      const hook = loadWebhook();
      if (hook) {
        await sendStoryPdf(hook, filename, dataUri.split(",")[1] ?? "", called(tale.me, "Me"));
        setNote("Sent to Google Drive, in Grok / Make you.");
      } else {
        setNote("Downloaded here. Add the Drive web app address once, and the next stories go straight to Grok / Make you.");
      }
    } catch {
      setNote("The PDF did not save. Try again.");
    } finally {
      setSaving(false);
    }
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
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="toy-go toy-ghost" disabled={page === 0} onClick={() => setPage((n) => Math.max(0, n - 1))}>
          Back
        </button>
        {page < 6 ? (
          <button
            type="button"
            className="toy-go"
            disabled={page === 0 && !tale.place}
            onClick={() => setPage((n) => Math.min(6, n + 1))}
          >
            Next
          </button>
        ) : (
          <button type="button" className="toy-go" disabled={saving} onClick={() => void savePdf()}>
            {saving ? "Saving…" : webhook ? "Save to Drive" : "Save story"}
          </button>
        )}
        <button type="button" className="toy-go toy-ghost" onClick={onAgain}>
          New people
        </button>
      </div>
      <p className="mt-2 font-sans text-sm font-bold text-muted">Page {page + 1} of 7{tale.helper ? ` · ${HELPER_LABEL[tale.helper]} is in this story` : ""}</p>
      {note ? <p className="mt-2 font-sans text-sm font-bold text-ink">{note}</p> : null}
      <details className="teacher-drive">
        <summary>Teacher: send stories straight to Drive</summary>
        <p>
          Same door as the park book. In Google Apps Script, paste this, deploy it as a web app (run as you, anyone), then paste the address ending in /exec. It files each PDF in Grok / Make you. Do it once on the class iPad.
        </p>
        <pre>{DRIVE_SCRIPT}</pre>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            className="toy-tab font-sans text-sm"
            onClick={() => {
              void navigator.clipboard.writeText(DRIVE_SCRIPT).then(() => {
                setScriptCopied(true);
              });
            }}
          >
            {scriptCopied ? "Copied" : "Copy script"}
          </button>
        </div>
        <label className="mt-3 block font-sans text-sm font-extrabold text-ink">
          Web app address
          <input
            type="url"
            value={webhook}
            placeholder="https://script.google.com/macros/s/…/exec"
            className="nameplate mt-1"
            onChange={(e) => setWebhook(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="toy-go mt-2"
          onClick={() => {
            const next = saveWebhook(webhook);
            setWebhook(next);
            setNote(next ? "Drive address saved on this iPad." : "Drive address cleared.");
          }}
        >
          Save Drive address
        </button>
      </details>
    </main>
  );
}

function paintFrame(
  ctx: CanvasRenderingContext2D,
  tale: Tale,
  page: number,
  phase: number,
  drawMe: ReturnType<typeof useActor>,
  drawPal: ReturnType<typeof useActor>,
  helper: HTMLImageElement | null,
) {
  drawPlace(ctx, tale.place, FRAME_W, FRAME_H, phase);
  const ground = FRAME_H - 18;
  const drift = Math.sin(phase * 1.2) * 46;
  if (page === 5 && helper) {
    const hx = FRAME_W * 0.58 + drift;
    const hh = 340;
    const hw = hh * (helper.naturalWidth / helper.naturalHeight);
    ctx.drawImage(helper, hx - hw / 2, ground - hh, hw, hh);
    drawPal(ctx, hx - hw * 0.05, ground - hh * 0.42, 210, phase, "carried");
    drawMe(ctx, FRAME_W * 0.22, ground, 250, phase, "stand");
    return;
  }
  if (page === 4 && helper) {
    const hh = 320;
    const hw = hh * (helper.naturalWidth / helper.naturalHeight);
    ctx.drawImage(helper, FRAME_W * 0.72 - hw / 2, ground - hh, hw, hh);
  }
  drawMe(ctx, page === 3 ? 300 : 360, ground, 280, phase, poseFor(page, tale.action, "me"));
  drawPal(ctx, page === 3 ? 620 : 600, ground, 280, phase + 0.6, poseFor(page, tale.action, "pal"));
}
