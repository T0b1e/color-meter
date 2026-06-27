import { useState } from 'react'
import type { ColorInfo as ColorInfoType } from '../utils/colorUtils'
import { formatHsl } from '../utils/colorUtils'
import { useLang } from '../i18n'
import { CopyIcon, CheckIcon } from './Icons'

interface Props {
  color: ColorInfoType | null
}

function CopyField({ label, value }: { label: string; value: string }) {
  const { s } = useLang()
  const [copied, setCopied] = useState(false)
  const [popKey, setPopKey] = useState(0)

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setPopKey((k) => k + 1)
      setTimeout(() => setCopied(false), 1400)
    })
  }

  return (
    <div
      className={`color-field ${copied ? 'is-copied' : ''}`}
      onClick={handleCopy}
      title={s.clickToCopy}
    >
      <span className="field-label">{label}</span>
      <span className="field-right">
        <span className="field-value">{value}</span>
        <span className={`copy-icon-wrap ${copied ? 'check' : ''}`}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </span>
        {copied && (
          <span key={popKey} className="copy-popup" role="status">
            {s.copied}
          </span>
        )}
      </span>
    </div>
  )
}

export default function ColorInfo({ color }: Props) {
  const { s } = useLang()

  if (!color) {
    return (
      <div className="color-info empty">
        <div className="swatch-empty" />
        <p className="placeholder-text">{s.placeholder}</p>
      </div>
    )
  }

  const { hex, rgb, hsl, name } = color

  return (
    <div className="color-info">
      <div
        className="swatch"
        style={{ '--swatch-color': hex } as React.CSSProperties}
      />
      <div className="fields">
        <CopyField label={s.hex} value={hex} />
        <CopyField label={s.rgb} value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
        <CopyField label={s.hsl} value={formatHsl(hsl)} />
        <CopyField label={s.name} value={name} />
      </div>
    </div>
  )
}
