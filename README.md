# 🎨 Color Meter

A browser-based color sampling tool built with React + Vite. Point your camera at any surface or upload an image to instantly read HEX, RGB, HSL values and extract a dominant color palette — no backend required.

---

## Features

| Feature | Details |
|---|---|
| **Live Camera Mode** | Samples the center pixel in real time via `getImageData` |
| **Freeze / Live toggle** | Lock the current reading with one tap; video keeps playing |
| **Image Upload Mode** | Drag & drop, click-to-browse, or paste from clipboard |
| **Click to Sample** | Click anywhere on an uploaded image to pick a color |
| **Dominant Palette** | Extracts top 6 colors using [Color Thief](https://lokeshdhakar.com/projects/color-thief/) |
| **Color Names** | Nearest CSS named color via Euclidean distance in RGB space |
| **Copy on Click** | Every value (HEX, RGB, HSL, name, palette swatch) copies to clipboard |
| **Animated Feedback** | Pill popup floats up on copy; crosshair turns amber when frozen |
| **Export Panel** | Output palette as CSS variables, Tailwind config, or JSON |
| **Bilingual UI** | Thai 🇹🇭 (default, Sarabun/Krub font) · English 🇬🇧 — toggle in header |
| **Responsive** | Two-column desktop layout collapses to single-column on mobile |
| **Error Boundary** | Catches runtime crashes and shows a recovery screen |
| **404 Page** | Batman-themed not-found page with home navigation |

---

## Tech Stack

- **React 18** — UI components and hooks
- **Vite 5** — dev server and bundler
- **TypeScript** — full type coverage
- **React Router v7** — client-side routing (`/` and `*` catch-all)
- **Color Thief 2** — dominant palette extraction via canvas
- **color-name** — CSS named color dataset for nearest-name lookup
- **Google Fonts** — [Sarabun](https://fonts.google.com/specimen/Sarabun) (title) + [Krub](https://fonts.google.com/specimen/Krub) (body)
- No backend. No build-time secrets. Runs entirely in the browser.

---

## Getting Started

### Prerequisites

- Node.js `^22` or `>=24`
- npm

### Install & run

```bash
git clone https://github.com/T0b1e/color-meter.git
cd color-meter
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

---

## Project Structure

```
color-meter/
├── public/
│   ├── batman.gif          # 404 page asset
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── CameraMode.tsx        # Live camera + freeze button
│   │   ├── ColorInfo.tsx         # HEX / RGB / HSL / Name fields
│   │   ├── DisclaimerModal.tsx   # First-visit accuracy warning
│   │   ├── ErrorBoundary.tsx     # Runtime error catch & recovery
│   │   ├── ExportPanel.tsx       # CSS Vars / Tailwind / JSON export
│   │   ├── Icons.tsx             # Inline SVG icon components
│   │   ├── ImageUploadMode.tsx   # Drag & drop image + click-to-sample
│   │   └── Palette.tsx           # 6-swatch dominant palette
│   ├── pages/
│   │   └── NotFound.tsx          # 404 page
│   ├── utils/
│   │   └── colorUtils.ts         # Color conversions & export generators
│   ├── i18n.tsx                  # Thai / English translations + context
│   ├── App.tsx                   # Root layout with header + footer
│   ├── App.css                   # All styles (light theme, animations)
│   └── main.tsx                  # ReactDOM entry + Router + ErrorBoundary
├── index.html
├── vite.config.ts
└── tsconfig.*.json
```

---

## How Color Sampling Works

```
Camera / Image
      │
      ▼
  <canvas> (hidden)
      │  ctx.drawImage(video / img)
      ▼
  getImageData(x, y, 1, 1)   ← one pixel
      │
      ├─► HEX  →  #RRGGBB
      ├─► RGB  →  rgb(r, g, b)
      ├─► HSL  →  hsl(h, s%, l%)
      └─► Name →  nearest CSS color by Euclidean distance in RGB space
```

Palette extraction uses **Color Thief**, which runs a modified median-cut algorithm on the full image canvas.

---

## ⚠️ Accuracy Notice

This tool provides **approximate** color values only.  
Results may vary due to:

- Ambient lighting conditions
- Darkness / shadows on the subject
- Camera sensor quality and white balance
- Image sharpness / focus
- Display color profile and calibration

Do not use for color-critical professional work without verification.

---

## 🎯 Color Detection Accuracy Guide

> Research-backed guidelines for getting the most accurate readings from a browser-based color meter.  
> *คู่มืออ้างอิงงานวิจัยสำหรับการวัดสีด้วยกล้องให้แม่นยำที่สุด*

---

### 1. Why Camera Color ≠ True Color

A camera is **not** a colorimeter. Three fundamental issues corrupt every reading:

#### 1.1 White Balance / Color Temperature

Light sources have different "temperatures" (Kelvin). When the camera's white balance is wrong, every color reading shifts — a white object under tungsten light reads as orange. This is the **#1 source of inaccuracy**.

| Light Source | Color Temp | Effect on readings |
|---|---|---|
| Candle flame | ~1800 K | Extreme orange cast |
| Tungsten bulb | ~2700 K | Warm / yellow shift |
| Fluorescent | ~4000 K | Cool / greenish shift |
| Daylight noon | ~5500 K | Neutral reference |
| Overcast sky | ~7000 K | Cool / blue shift |

**Target:** shoot under **5000–5500 K** daylight-balanced light for neutral readings.

#### 1.2 Non-Linear Image Processing (ISP)

Cameras apply automatic corrections that alter raw color data before you ever see a pixel:

- Auto-exposure (brightens / darkens the whole frame)
- Auto white balance (shifts the entire color cast)
- Tone mapping / gamma curves
- Saturation enhancement (most phones **over-saturate**)
- HDR compositing

> **Key research finding:** Smartphone cameras systematically **overestimate Saturation (S)** and **underestimate Value (V)** compared to Pantone reference values.  
> — *Tandfonline, 2024* · [doi:10.1080/20548923.2024.2444168](https://doi.org/10.1080/20548923.2024.2444168)

#### 1.3 Surface / Material Effects

The same color looks different depending on:

| Material | Problem | Fix |
|---|---|---|
| Glossy / lacquer | Specular highlights wash out color | Shoot at ~45° off-axis or use polarizing filter |
| Matte / flat | Most accurate, minimal issues | Shoot straight-on under diffuse light |
| Metallic | Color shifts with angle (anisotropic) | Average multiple angles |
| Fabric / textile | Texture creates micro-shadows | Use raking light or average a large area |
| Transparent | Background color bleeds through | Place on neutral grey background |

---

### 2. Color Accuracy Standard — Delta E (ΔE)

**ΔE** is the international standard (CIE) for quantifying color difference. It is calculated in **CIELAB** color space, designed to be perceptually uniform — equal ΔE values correspond to equal perceived differences.

```
ΔE = √( (L₂–L₁)² + (a₂–a₁)² + (b₂–b₁)² )
```

| ΔE Range | Human Perception |
|---|---|
| 0 | Perfect match |
| 0–1 | Imperceptible |
| 1–2 | Barely perceptible (trained eye only) |
| 2–3 | Noticeable on close comparison |
| 3–5 | Clearly visible |
| 5+ | Strong color difference |

**Rule of thumb: ΔE ≤ 2 is the target for professional color work.**  
Use **CIEDE2000** (ΔE00) for the most accurate formula — recommended over the older CIE76.

#### Realistic accuracy of smartphone cameras

Based on *Sensors / PMC, 2023* · [PMC10304433](https://pmc.ncbi.nlm.nih.gov/articles/PMC10304433/):

| Method | Typical ΔE |
|---|---|
| Raw smartphone camera, no calibration | 5–15 (unreliable) |
| With white balance calibration only | 3–6 |
| With full color profile + reference card | ~1–3 (near professional) |
| Dedicated hardware colorimeter | < 1 |

---

### 3. Practical Guidelines for Maximum Accuracy

#### 3.1 Shooting Conditions

**Lighting:**
- Use diffuse, neutral daylight (5000–5500 K / D50 or D65 standard)
- **Avoid mixed lighting** (e.g., window + lamp) — conflicting color temperatures fight each other
- Avoid direct harsh light — creates specular highlights that blow out color readings
- If indoors, use a daylight-balanced LED labeled 5000 K

**Camera (if manually controllable):**
- **Lock white balance** — never use Auto WB when measuring color
- **Lock exposure / ISO** — auto exposure shifts brightness and corrupts readings
- Shoot **perpendicular** to the surface — angle causes color shift on glossy materials
- Get close — fills the frame with the target, reduces environmental influence

**The Reference Card Method (most reliable):**
1. Photograph an **X-Rite ColorChecker** card under your exact conditions
2. Use the known 24-patch values to build a correction matrix
3. Apply that correction to all subsequent readings

#### 3.2 Sampling Technique

This app reads **one center pixel** in camera mode and the **clicked pixel** in upload mode.

| Tip | Why it helps |
|---|---|
| Fill the frame with the object | Center pixel is less likely to hit an edge or specular highlight |
| Avoid shiny / glossy areas | Specular highlights read near-white regardless of true color |
| Use **Freeze** before reading | Motion blur from a moving camera corrupts the pixel |
| Click the **flattest, most evenly lit patch** | Avoid edges, folds, shadows, or reflections |
| Take 3–5 readings on different flat spots | Surface texture causes micro-variation; compare for consistency |

> **Upgrade path:** averaging a 5×5 or 20×20 pixel region instead of 1 pixel dramatically reduces noise on textured surfaces.

#### 3.3 Upload Mode vs Camera Mode

**Upload mode is more accurate** for static objects because:
- You control lighting at capture time
- You click exactly the pixel you want
- No real-time AWB drift between frames
- Color Thief runs **median-cut** over the full image for palette extraction (vs. 6 grid points in camera mode)

Use **camera mode** for quick live identification; use **upload mode** when accuracy matters.

#### 3.4 Software-Side White Balance Correction

If you include a **white reference patch** in the image, you can correct readings in software:

```js
// Measure the "white" patch — should be (255, 255, 255)
const rGain = 255 / whiteRef.r
const gGain = 255 / whiteRef.g
const bGain = 255 / whiteRef.b

const corrected = {
  r: Math.min(255, Math.round(raw.r * rGain)),
  g: Math.min(255, Math.round(raw.g * gGain)),
  b: Math.min(255, Math.round(raw.b * bGain)),
}
```

#### 3.5 RGB → CIELAB Conversion (for ΔE comparison)

```js
// sRGB → Linear RGB (remove gamma)
function linearize(c) {
  c = c / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

// Linear RGB → XYZ (D65 illuminant)
function rgbToXyz(r, g, b) {
  r = linearize(r); g = linearize(g); b = linearize(b)
  return {
    x: r * 0.4124 + g * 0.3576 + b * 0.1805,
    y: r * 0.2126 + g * 0.7152 + b * 0.0722,
    z: r * 0.0193 + g * 0.1192 + b * 0.9505,
  }
}

// XYZ → CIELAB
function xyzToLab({ x, y, z }) {
  const f = v => v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116
  const fx = f(x / 0.95047), fy = f(y / 1.00000), fz = f(z / 1.08883)
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) }
}

// Delta E 76
function deltaE(lab1, lab2) {
  return Math.sqrt(
    (lab2.L - lab1.L) ** 2 +
    (lab2.a - lab1.a) ** 2 +
    (lab2.b - lab1.b) ** 2
  )
}
```

---

### 4. What Each Color Space Tells You

| Value | Most reliable for | Caution |
|---|---|---|
| **HEX / RGB** | Exact pixel values the camera reported | Absolute accuracy depends entirely on camera calibration |
| **HSL Hue (H)** | Identifying the color family — shifts least with lighting | |
| **HSL Saturation (S)** | Relative vividness | Suppressed by desaturating lights; inflated by phone ISP |
| **HSL Lightness (L)** | Relative brightness | Directly affected by exposure; meaningless without calibration |
| **Color Name** | Ballpark identification | CSS named colors are coarse — "tomato" vs "crimson" are 30 ΔE apart |

When comparing two objects, **Hue (H) is the most reliable dimension**. Same H, different L = same color family, different brightness.

---

### 5. Key Research References

| Paper | Key Finding | Link |
|---|---|---|
| "Accuracy and precision of smartphone colorimetry" (Tandfonline, 2024) | Android Color Grab outperformed iPhone; HSV overestimates S, underestimates V vs Pantone | [doi:10.1080/20548923.2024.2444168](https://doi.org/10.1080/20548923.2024.2444168) |
| "Smartphone-Enabled Colorimetry" (Sensors / PMC, 2023) | ΔE vs Labsphere certified samples; clip-on grating improves accuracy significantly | [PMC10304433](https://pmc.ncbi.nlm.nih.gov/articles/PMC10304433/) |
| "Novel systems solution for accurate colorimetric measurement via AR" (PLOS ONE, 2023) | Color correction algorithm + reference board reduces color variance by up to 90% | [doi:10.1371/journal.pone.0287099](https://doi.org/10.1371/journal.pone.0287099) |
| "Smartphone-based pH colorimetry with color adaptation" (PMC, 2017) | CIE 1976 u'v' color space + reference patch gives stable readings despite ambient light changes | [PMC5539506](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5539506/) |
| "Designing Color Filters for Colorimetric Cameras" (arXiv) | ΔE < 1 = imperceptible; camera sensors require spectral matching filters for true accuracy | [arXiv:2003.12645](https://arxiv.org/pdf/2003.12645) |
| CIEDE2000 Standard | Modern ΔE formula with perceptual weighting — recommended over CIE76 | ISO/CIE 11664-6:2022 |
| X-Rite ColorChecker Classic | Industry-standard 24-patch reference card for camera calibration | [xrite.com](https://www.xrite.com) |

---

### 6. Feature Roadmap (Research-Driven)

**MVP — already implemented**
- [x] Live camera pixel sampling
- [x] HEX / RGB / HSL display
- [x] Freeze + copy to clipboard
- [x] Image upload → click to sample
- [x] Dominant palette extraction (Color Thief)

**Accuracy layer — high value, low complexity**
- [ ] White reference patch — user clicks a known-white area; app corrects all readings
- [ ] Region average sampling — user drags a box; app averages the region (vs. 1 pixel)
- [ ] CIELAB output (L\* a\* b\*) — more meaningful than HSL for color science
- [ ] ΔE comparison — measure two colors, show difference with perceptual label
- [ ] Ambient light warning — warn if image histogram suggests poor lighting conditions

**Pro layer — optional**
- [ ] Nearest brand match — Pantone, RAL, Sherwin-Williams paint codes
- [ ] Accessibility check — WCAG contrast ratio between two sampled colors
- [ ] Color correction matrix — calibrate against a reference card

---

### 7. Quick Field Checklist

**Before every measurement:**
- [ ] Light source is neutral (daylight or 5000 K LED)
- [ ] No mixed lighting (no window + lamp simultaneously)
- [ ] White balance is **locked** (not Auto)
- [ ] Surface is matte, or camera is at ~45° to avoid glare
- [ ] Camera is perpendicular to the surface
- [ ] Object fills the frame; crosshair is centered on a flat, evenly-lit color area
- [ ] Area is in focus

**For critical / professional work:**
- [ ] Include a grey card or white reference patch in the shot
- [ ] Apply white reference correction in software
- [ ] Average at least 3–5 readings on different flat spots
- [ ] Output CIELAB L\*a\*b\* (not just HEX) for comparison
- [ ] Verify ΔE against reference — target ΔE ≤ 2
- [ ] Confirm with a physical Pantone / RAL swatch or calibrated colorimeter

---

## Keyboard & Interaction

| Action | Result |
|---|---|
| Click any HEX / RGB / HSL / Name field | Copies value to clipboard |
| Click palette swatch | Copies HEX + sets as active color |
| Click export block | Copies entire export snippet |
| Freeze button (camera) | Locks color output; video still plays |
| Paste `Ctrl+V` (upload mode) | Loads image from clipboard |
| Navigate to unknown URL | Shows 404 Batman page |

---

## License

MIT © [T0b1e](https://github.com/T0b1e)
