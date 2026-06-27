import { useState } from 'react'
import type { RgbColor } from '../utils/colorUtils'
import { generateCssVars, generateTailwindConfig, generateJson } from '../utils/colorUtils'
import { useLang } from '../i18n'
import { CopyIcon, CheckIcon } from './Icons'

type ExportMode = 'css' | 'tailwind' | 'json'

interface Props {
  palette: RgbColor[]
}

export default function ExportPanel({ palette }: Props) {
  const { s } = useLang()
  const [mode, setMode] = useState<ExportMode>('css')
  const [copied, setCopied] = useState(false)
  const [popKey, setPopKey] = useState(0)

  if (palette.length === 0) return null

  const outputs: Record<ExportMode, string> = {
    css: generateCssVars(palette),
    tailwind: generateTailwindConfig(palette),
    json: generateJson(palette),
  }

  const output = outputs[mode]

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setPopKey((k) => k + 1)
      setTimeout(() => setCopied(false), 1400)
    })
  }

  const tabLabels: Record<ExportMode, string> = {
    css: s.cssVars,
    tailwind: s.tailwind,
    json: s.json,
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{s.export}</h2>
        <div className="export-tabs">
          {(['css', 'tailwind', 'json'] as ExportMode[]).map((m) => (
            <button
              key={m}
              type="button"
              className={`export-tab ${mode === m ? 'active' : ''}`}
              onClick={() => setMode(m)}
            >
              {tabLabels[m]}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`export-output ${copied ? 'is-copied' : ''}`}
        onClick={handleCopy}
        title={s.clickToCopy}
      >
        <pre>{output}</pre>
        <div className="export-copy-row">
          <span className={`copy-icon-wrap ${copied ? 'check' : ''}`}>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </span>
          <span className="copy-hint">{copied ? s.copied : s.clickToCopy}</span>
          {copied && (
            <span key={popKey} className="copy-popup export-popup" role="status">
              {s.copied}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
