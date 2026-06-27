import { useRef, useEffect, useState } from 'react'
import type { SavedColor } from '../hooks/useSavedColors'
import type { ColorInfo } from '../utils/colorUtils'
import { rgbToHex } from '../utils/colorUtils'
import { useLang } from '../i18n'
import { TrashIcon } from './Icons'

interface Props {
  saved: SavedColor[]
  onSelect: (color: ColorInfo) => void
  onRemove: (hex: string) => void
  onClearAll: () => void
}

function SavedSwatch({
  color,
  onSelect,
  onRemove,
}: {
  color: SavedColor
  onSelect: (c: ColorInfo) => void
  onRemove: (hex: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const blockRef = useRef<HTMLDivElement>(null)
  const hex = rgbToHex(color.rgb.r, color.rgb.g, color.rgb.b)

  useEffect(() => {
    blockRef.current?.style.setProperty('--swatch-color', hex)
  }, [hex])

  const handleClick = () => {
    onSelect(color)
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1100)
    })
  }

  return (
    <div className="saved-swatch">
      <div className="swatch-block-wrap">
        <div
          ref={blockRef}
          className={`swatch-block ${copied ? 'is-copied' : ''}`}
          onClick={handleClick}
          title={hex}
        />
        <button
          type="button"
          className="saved-swatch-remove"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(hex)
          }}
          title="Remove"
        >
          <TrashIcon />
        </button>
      </div>
      <span className="swatch-hex">{hex}</span>
    </div>
  )
}

export default function SavedColors({ saved, onSelect, onRemove, onClearAll }: Props) {
  const { s } = useLang()
  if (saved.length === 0) return null

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{s.savedColors}</h2>
        <button type="button" className="clear-all-btn" onClick={onClearAll}>
          {s.clearAll}
        </button>
      </div>
      <div className="palette-grid">
        {saved.map((color) => (
          <SavedSwatch
            key={color.hex}
            color={color}
            onSelect={onSelect}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  )
}
