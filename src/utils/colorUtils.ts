import colorNames from 'color-name'

export interface RgbColor {
  r: number
  g: number
  b: number
}

export interface HslColor {
  h: number
  s: number
  l: number
}

export interface ColorInfo {
  hex: string
  rgb: RgbColor
  hsl: HslColor
  name: string
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()
}

export function rgbToHsl(r: number, g: number, b: number): HslColor {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
        break
      case gn:
        h = ((bn - rn) / d + 2) / 6
        break
      case bn:
        h = ((rn - gn) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export function nearestColorName(r: number, g: number, b: number): string {
  let minDist = Infinity
  let nearest = 'unknown'

  for (const [name, [cr, cg, cb]] of Object.entries(colorNames)) {
    const dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2
    if (dist < minDist) {
      minDist = dist
      nearest = name
    }
  }

  return nearest.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
}

export function buildColorInfo(r: number, g: number, b: number): ColorInfo {
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b),
    name: nearestColorName(r, g, b),
  }
}

export function formatHsl({ h, s, l }: HslColor): string {
  return `hsl(${h}, ${s}%, ${l}%)`
}

export function generateCssVars(palette: RgbColor[]): string {
  const lines = palette
    .map((c, i) => `  --color-${i + 1}: ${rgbToHex(c.r, c.g, c.b)};`)
    .join('\n')
  return `:root {\n${lines}\n}`
}

export function generateTailwindConfig(palette: RgbColor[]): string {
  const entries = palette
    .map((c, i) => `      'palette-${i + 1}': '${rgbToHex(c.r, c.g, c.b)}',`)
    .join('\n')
  return `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      },\n    },\n  },\n}`
}

export function generateJson(palette: RgbColor[]): string {
  const colors = palette.map((c) => {
    const hsl = rgbToHsl(c.r, c.g, c.b)
    return {
      hex: rgbToHex(c.r, c.g, c.b),
      rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
      hsl: formatHsl(hsl),
      name: nearestColorName(c.r, c.g, c.b),
    }
  })
  return JSON.stringify({ colors }, null, 2)
}
