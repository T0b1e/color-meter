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
