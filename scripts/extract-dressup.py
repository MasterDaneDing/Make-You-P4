#!/usr/bin/env python3
"""Slice the dress-up sheets into individual transparent sprites."""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path("/workspace/public/dressup")
SRC = Path("/workspace/artifacts/parts")

SHEETS = {
    "head": ["PhM-093414.png", "PhM-094329.png"],
    "eyes": ["PhM-102014.png"],
    "mouth": ["PhM-102723.png"],
    "nose": ["PhM-103004.png"],
    "body": ["PhM-103421.png", "PhM-103500.png", "PhM-104435.png", "PhM-104750.png"],
    "hair": ["PhM-103656.png", "PhM-104756.png"],
}


def load(name: str) -> np.ndarray:
    return np.array(Image.open(SRC / name).convert("RGBA"))


def components(arr: np.ndarray, step: int = 4, alpha: int = 28, min_area: int = 60):
    mask = (arr[:, :, 3] > alpha)[::step, ::step]
    lab, _n = ndimage.label(mask)
    boxes = []
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        if sl is None:
            continue
        ys, xs = sl
        area = int((lab[sl] == i).sum())
        if area < min_area:
            continue
        boxes.append(
            [
                int(xs.start * step),
                int(ys.start * step),
                int(xs.stop * step),
                int(ys.stop * step),
            ]
        )
    return boxes


def split_wide(arr: np.ndarray, box, alpha: int = 28):
    x0, y0, x1, y1 = box
    w = x1 - x0
    if w < 700:
        return [box]
    crop = arr[y0:y1, x0:x1]
    ink = (crop[:, :, 3] > alpha).sum(axis=0).astype(np.float32)
    # Smooth and look for a valley in the middle half.
    kernel = np.ones(12) / 12
    smooth = np.convolve(ink, kernel, mode="same")
    lo, hi = int(w * 0.35), int(w * 0.65)
    cut = lo + int(np.argmin(smooth[lo:hi]))
    # Don't split if the valley is still dense (it's one wide sprite).
    if smooth[cut] > smooth.max() * 0.45:
        return [box]
    return [[x0, y0, x0 + cut, y1], [x0 + cut, y0, x1, y1]]


def trim(arr: np.ndarray, box, pad: int = 8, alpha: int = 16):
    x0, y0, x1, y1 = box
    x0 = max(0, x0)
    y0 = max(0, y0)
    x1 = min(arr.shape[1], x1)
    y1 = min(arr.shape[0], y1)
    crop = arr[y0:y1, x0:x1]
    ink = crop[:, :, 3] > alpha
    if not ink.any():
        return None
    ys = np.flatnonzero(ink.any(axis=1))
    xs = np.flatnonzero(ink.any(axis=0))
    t, b = int(ys[0]), int(ys[-1]) + 1
    l, r = int(xs[0]), int(xs[-1]) + 1
    t = max(0, t - pad)
    l = max(0, l - pad)
    b = min(crop.shape[0], b + pad)
    r = min(crop.shape[1], r + pad)
    return crop[t:b, l:r]


def grid_cells(arr: np.ndarray, cols: int, rows: int):
    h, w = arr.shape[:2]
    cw, ch = w / cols, h / rows
    boxes = []
    for r in range(rows):
        for c in range(cols):
            boxes.append([int(c * cw), int(r * ch), int((c + 1) * cw), int((r + 1) * ch)])
    return boxes


def merge_by_grid(arr: np.ndarray, boxes, cols: int, rows: int):
    h, w = arr.shape[:2]
    cw, ch = w / cols, h / rows
    cells: dict[tuple[int, int], list[int]] = {}
    for i, (x0, y0, x1, y1) in enumerate(boxes):
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        c = min(cols - 1, max(0, int(cx / cw)))
        r = min(rows - 1, max(0, int(cy / ch)))
        cells.setdefault((r, c), []).append(i)
    merged = []
    for r in range(rows):
        for c in range(cols):
            idxs = cells.get((r, c), [])
            if not idxs:
                continue
            xs0, ys0, xs1, ys1 = [], [], [], []
            for i in idxs:
                x0, y0, x1, y1 = boxes[i]
                xs0.append(x0)
                ys0.append(y0)
                xs1.append(x1)
                ys1.append(y1)
            merged.append([min(xs0), min(ys0), max(xs1), max(ys1)])
    return merged


def sort_row_major(boxes, row_gap: int = 80):
    boxes = sorted(boxes, key=lambda b: ((b[1] + b[3]) / 2, (b[0] + b[2]) / 2))
    rows: list[list] = []
    for b in boxes:
        cy = (b[1] + b[3]) / 2
        if not rows or cy - np.mean([(x[1] + x[3]) / 2 for x in rows[-1]]) > row_gap:
            rows.append([b])
        else:
            rows[-1].append(b)
    out = []
    for row in rows:
        row.sort(key=lambda b: b[0])
        out.extend(row)
    return out


def resize_max(im: Image.Image, max_edge: int) -> Image.Image:
    w, h = im.size
    scale = min(1.0, max_edge / max(w, h))
    if scale >= 0.999:
        return im
    return im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.Resampling.LANCZOS)


def save_png(im: Image.Image, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "PNG", optimize=True)


def sprites_for(kind: str, filename: str) -> list[np.ndarray]:
    arr = load(filename)
    if kind == "eyes":
        boxes = grid_cells(arr, 6, 5)
    elif kind == "nose":
        boxes = merge_by_grid(arr, components(arr, min_area=30), 8, 5)
    elif kind == "body" and filename == "PhM-104750.png":
        raw = components(arr, min_area=80)
        boxes = []
        for b in raw:
            boxes.extend(split_wide(arr, b))
        boxes = sort_row_major(boxes, row_gap=100)
    else:
        boxes = sort_row_major(components(arr, min_area=80 if kind != "eyes" else 20), row_gap=90)
    out = []
    for b in boxes:
        crop = trim(arr, b, pad=6)
        if crop is None:
            continue
        if int((crop[:, :, 3] > 16).sum()) < 200:
            continue
        out.append(crop)
    return out


def main():
    if ROOT.exists():
        import shutil

        shutil.rmtree(ROOT)
    catalog = []
    limits = {"head": 520, "eyes": 420, "nose": 360, "mouth": 420, "body": 640, "hair": 560}
    for kind, files in SHEETS.items():
        n = 0
        for filename in files:
            for crop in sprites_for(kind, filename):
                n += 1
                im = resize_max(Image.fromarray(crop), limits[kind])
                rel = f"{kind}/{n:03d}.png"
                save_png(im, ROOT / rel)
                catalog.append(
                    {
                        "id": f"{kind}-{n:03d}",
                        "kind": kind,
                        "src": f"/dressup/{rel}",
                        "w": im.size[0],
                        "h": im.size[1],
                    }
                )
        print(kind, n)
    (ROOT / "catalog.json").write_text(json.dumps(catalog))
    print("total", len(catalog))


if __name__ == "__main__":
    main()
