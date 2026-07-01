import { useEffect, useRef, useState } from 'react'
import type { RgbColor } from '../utils/colorUtils'
import { buildColorInfo, rgbToHex } from '../utils/colorUtils'
import type { ColorInfo } from '../utils/colorUtils'
import { useLang } from '../i18n'
import { PauseIcon, PlayIcon } from './Icons'

const CAMERA_PERM_KEY = 'color-meter-camera-v1'

const GRID_SIZES = [4, 16, 32] as const
type GridSize = (typeof GRID_SIZES)[number]

type ViewMode = 'camera' | 'grid'

interface Props {
  onColor: (color: ColorInfo) => void
  onPalette: (palette: RgbColor[]) => void
}

export default function CameraMode({ onColor, onPalette }: Props) {
  const { s } = useLang()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const frozenRef = useRef(false)
  const [permitted, setPermitted] = useState(
    () => localStorage.getItem(CAMERA_PERM_KEY) === 'granted',
  )
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('camera')
  const [gridSize, setGridSize] = useState<GridSize>(4)
  const [gridColors, setGridColors] = useState<RgbColor[]>([])

  const allowCamera = () => {
    localStorage.setItem(CAMERA_PERM_KEY, 'granted')
    setPermitted(true)
  }

  const toggleFreeze = () => {
    frozenRef.current = !frozenRef.current
    setFrozen(frozenRef.current)
  }

  useEffect(() => {
    if (!permitted) return
    let stream: MediaStream | null = null

    const tick = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Always draw the frame so the live preview keeps playing
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      // Only push color updates when not frozen
      if (!frozenRef.current) {
        const cx = Math.floor(canvas.width / 2)
        const cy = Math.floor(canvas.height / 2)
        const pixel = ctx.getImageData(cx, cy, 1, 1).data
        onColor(buildColorInfo(pixel[0], pixel[1], pixel[2]))

        const palettePoints: RgbColor[] = []
        const cols = 3
        const rows = 2
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const px = Math.floor(((col + 1) / (cols + 1)) * canvas.width)
            const py = Math.floor(((row + 1) / (rows + 1)) * canvas.height)
            const d = ctx.getImageData(px, py, 1, 1).data
            palettePoints.push({ r: d[0], g: d[1], b: d[2] })
          }
        }
        onPalette(palettePoints)

        const grid: RgbColor[] = []
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const gx = Math.floor(((col + 0.5) / gridSize) * canvas.width)
            const gy = Math.floor(((row + 0.5) / gridSize) * canvas.height)
            const d = ctx.getImageData(gx, gy, 1, 1).data
            grid.push({ r: d[0], g: d[1], b: d[2] })
          }
        }
        setGridColors(grid)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        await video.play()
        setActive(true)
        setError(null)
        tick()
      } catch {
        setError(s.cameraError)
      }
    }

    void start()

    return () => {
      cancelAnimationFrame(rafRef.current)
      stream?.getTracks().forEach((t) => t.stop())
      setActive(false)
    }
  }, [permitted, onColor, onPalette, s.cameraError, gridSize])

  if (!permitted) {
    return (
      <div className="camera-perm">
        <div className="camera-perm__icon">📷</div>
        <h3 className="camera-perm__title">{s.cameraPermTitle}</h3>
        <p className="camera-perm__body">{s.cameraPermBody}</p>
        <button type="button" className="camera-perm__btn" onClick={allowCamera}>
          {s.cameraPermBtn}
        </button>
      </div>
    )
  }

  return (
    <div className="camera-wrapper">
      {error && <div className="mode-error">{error}</div>}

      <div className={`camera-viewport ${active ? '' : 'hidden'}`}>
        <video ref={videoRef} muted playsInline className="camera-video" />
        <canvas ref={canvasRef} className="hidden" />

        {/* View toggle */}
        <div className="camera-view-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'camera' ? 'active' : ''}`}
            onClick={() => setViewMode('camera')}
          >
            Camera
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
        </div>

        {/* Grid size selector */}
        {viewMode === 'grid' && (
          <div className="grid-size-toggle">
            {GRID_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className={`grid-size-btn ${gridSize === size ? 'active' : ''}`}
                onClick={() => setGridSize(size)}
              >
                {size}×{size}
              </button>
            ))}
          </div>
        )}

        {/* Grid overlay */}
        {viewMode === 'grid' && (
          <div className="color-grid" data-grid-size={gridSize}>
            {gridColors.map((c, i) => {
              const hex = rgbToHex(c.r, c.g, c.b)
              const luminance = (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255
              const textColor = luminance > 0.5 ? '#000000' : '#ffffff'
              return (
                <div
                  key={i}
                  className="color-grid-cell"
                  style={{ '--cell-bg': hex, '--cell-text': textColor } as React.CSSProperties}
                >
                  {gridSize === 4 && <span className="color-grid-label">{hex}</span>}
                </div>
              )
            })}
          </div>
        )}

        {viewMode === 'camera' && (
          <div className={`crosshair ${frozen ? 'crosshair--frozen' : ''}`}>
            <div className="crosshair-h" />
            <div className="crosshair-v" />
            <div className="crosshair-dot" />
          </div>
        )}

        <div className="camera-controls">
          <button
            type="button"
            className={`freeze-btn ${frozen ? 'freeze-btn--frozen' : ''}`}
            onClick={toggleFreeze}
          >
            <span className="freeze-btn__icon">{frozen ? <PlayIcon /> : <PauseIcon />}</span>
            <span className="freeze-btn__label">{frozen ? s.unfreeze : s.freeze}</span>
          </button>
        </div>
      </div>

      {!active && !error && (
        <div className="camera-placeholder">
          <span>{s.starting}</span>
        </div>
      )}
    </div>
  )
}
