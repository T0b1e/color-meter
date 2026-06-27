import { useEffect, useRef, useState } from 'react'
import type { RgbColor } from '../utils/colorUtils'
import { rgbToHex } from '../utils/colorUtils'
import { useLang } from '../i18n'

interface Props {
  palette: RgbColor[]
  onSelect: (color: RgbColor) => void
}

function PaletteSwatch({ color, onSelect }: { color: RgbColor; onSelect: (c: RgbColor) => void }) {
  const { s } = useLang()
  const [copied, setCopied] = useState(false)
  const [popKey, setPopKey] = useState(0)
  const hex = rgbToHex(color.r, color.g, color.b)
  const blockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    blockRef.current?.style.setProperty('--swatch-color', hex)
  }, [hex])

  const handleClick = () => {
    onSelect(color)
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true)
      setPopKey((k) => k + 1)
      setTimeout(() => setCopied(false), 1100)
    })
  }

  return (
    <div className="palette-swatch" onClick={handleClick} title={`${hex} — ${s.clickToCopy}`}>
      <div className="swatch-block-wrap">
        <div
          ref={blockRef}
          className={`swatch-block ${copied ? 'is-copied' : ''}`}
        />
        {copied && (
          <span key={popKey} className="copy-popup swatch-popup" role="status">
            {s.copied}
          </span>
        )}
      </div>
      <span className={`swatch-hex ${copied ? 'swatch-hex--copied' : ''}`}>{hex}</span>
    </div>
  )
}

export default function Palette({ palette, onSelect }: Props) {
  const { s } = useLang()
  if (palette.length === 0) return null

  return (
    <section className="panel">
      <h2 className="panel-title">{s.dominantPalette}</h2>
      <div className="palette-grid">
        {palette.map((color, i) => (
          <PaletteSwatch key={i} color={color} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
