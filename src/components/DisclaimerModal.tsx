import { useState } from 'react'
import { useLang } from '../i18n'

const STORAGE_KEY = 'color-meter-tos-v1'

export default function DisclaimerModal() {
  const { s } = useLang()
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  if (!visible) return null

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  return (
    <div className="tos-backdrop" role="dialog" aria-modal="true" aria-labelledby="tos-title">
      <div className="tos-modal">
        <h2 className="tos-title" id="tos-title">{s.tosTitle}</h2>
        <p className="tos-body">{s.tosBody}</p>
        <ul className="tos-factors">
          {s.tosFactors.map((factor) => (
            <li key={factor} className="tos-factor">
              <span className="tos-bullet">·</span>
              {factor}
            </li>
          ))}
        </ul>
        <button type="button" className="tos-accept-btn" onClick={accept}>
          {s.tosAccept}
        </button>
      </div>
    </div>
  )
}
