import { useState, useCallback } from 'react'
import { LangProvider, useLang } from './i18n'
import CameraMode from './components/CameraMode'
import ImageUploadMode from './components/ImageUploadMode'
import ColorInfo from './components/ColorInfo'
import Palette from './components/Palette'
import ExportPanel from './components/ExportPanel'
import DisclaimerModal from './components/DisclaimerModal'
import SavedColors from './components/SavedColors'
import { useSavedColors } from './hooks/useSavedColors'
import type { ColorInfo as ColorInfoType, RgbColor } from './utils/colorUtils'
import { buildColorInfo } from './utils/colorUtils'

type Tab = 'camera' | 'upload'

function AppInner() {
  const { lang, setLang, s } = useLang()
  const [tab, setTab] = useState<Tab>('camera')
  const [color, setColor] = useState<ColorInfoType | null>(null)
  const [palette, setPalette] = useState<RgbColor[]>([])

  const { saved, save, remove, clearAll, isSaved } = useSavedColors()

  const handleColor = useCallback((c: ColorInfoType) => setColor(c), [])
  const handlePalette = useCallback((p: RgbColor[]) => setPalette(p), [])
  const handlePaletteSelect = useCallback(
    (c: RgbColor) => setColor(buildColorInfo(c.r, c.g, c.b)),
    [],
  )
  const handleSavedSelect = useCallback(
    (c: ColorInfoType) => setColor(c),
    [],
  )

  const toggleLang = () => setLang(lang === 'th' ? 'en' : 'th')

  return (
    <div className="app">
      <DisclaimerModal />

      <header className="app-header">
        <h1 className="app-title">{s.title}</h1>
        <div className="header-controls">
          <div className="tab-bar">
            <button
              type="button"
              className={`tab-btn ${tab === 'camera' ? 'active' : ''}`}
              onClick={() => setTab('camera')}
            >
              {s.camera}
            </button>
            <button
              type="button"
              className={`tab-btn ${tab === 'upload' ? 'active' : ''}`}
              onClick={() => setTab('upload')}
            >
              {s.upload}
            </button>
          </div>
          <button type="button" className="lang-btn" onClick={toggleLang} title="Switch language">
            {s.langLabel}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="left-col">
          <div className="viewport-panel">
            {tab === 'camera' ? (
              <CameraMode onColor={handleColor} onPalette={handlePalette} />
            ) : (
              <ImageUploadMode onColor={handleColor} onPalette={handlePalette} />
            )}
          </div>
        </div>

        <div className="right-col">
          <section className="panel">
            <h2 className="panel-title">{s.sampledColor}</h2>
            <ColorInfo
              color={color}
              isSaved={color ? isSaved(color.hex) : false}
              onSave={save}
            />
          </section>

          <Palette palette={palette} onSelect={handlePaletteSelect} />
          <ExportPanel palette={palette} />
          <SavedColors
            saved={saved}
            onSelect={handleSavedSelect}
            onRemove={remove}
            onClearAll={clearAll}
          />
        </div>
      </main>

      <footer className="app-footer">
        <span className="footer-note">{s.footerNote}</span>
        <span className="footer-sep">·</span>
        <span className="footer-credit">
          {s.madeBy}{' '}
          <a
            href="https://github.com/T0b1e"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            T0b1e
          </a>
        </span>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  )
}
