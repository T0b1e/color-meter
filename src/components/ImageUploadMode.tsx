import { useCallback, useEffect, useRef, useState } from 'react'
import ColorThief from 'colorthief'
import type { RgbColor, ColorInfo } from '../utils/colorUtils'
import { buildColorInfo } from '../utils/colorUtils'
import { useLang } from '../i18n'

interface Props {
  onColor: (color: ColorInfo) => void
  onPalette: (palette: RgbColor[]) => void
}

export default function ImageUploadMode({ onColor, onPalette }: Props) {
  const { s } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const crosshairRef = useRef<HTMLDivElement>(null)
  const [hasImage, setHasImage] = useState(false)
  const [dragging, setDragging] = useState(false)

  const loadImage = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const src = e.target?.result as string
        const img = new Image()
        img.onload = () => {
          imgRef.current = img
          const canvas = canvasRef.current
          if (!canvas) return
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0)
          setHasImage(true)

          const thief = new ColorThief()
          const palette = thief.getPalette(img, 6) as [number, number, number][]
          onPalette(palette.map(([r, g, b]) => ({ r, g, b })))

          const cx = Math.floor(img.width / 2)
          const cy = Math.floor(img.height / 2)
          const pixel = ctx.getImageData(cx, cy, 1, 1).data
          onColor(buildColorInfo(pixel[0], pixel[1], pixel[2]))
        }
        img.src = src
      }
      reader.readAsDataURL(file)
    },
    [onColor, onPalette],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file?.type.startsWith('image/')) loadImage(file)
    },
    [loadImage],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) loadImage(file)
    },
    [loadImage],
  )

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = Math.floor((e.clientX - rect.left) * scaleX)
      const y = Math.floor((e.clientY - rect.top) * scaleY)
      const ctx = canvas.getContext('2d')!
      const pixel = ctx.getImageData(x, y, 1, 1).data
      onColor(buildColorInfo(pixel[0], pixel[1], pixel[2]))

      // Move crosshair using CSS custom properties to avoid inline styles
      const ch = crosshairRef.current
      if (ch) {
        ch.style.setProperty('--ch-x', `${e.clientX - rect.left}px`)
        ch.style.setProperty('--ch-y', `${e.clientY - rect.top}px`)
        ch.classList.add('visible')
      }
    },
    [onColor],
  )

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith('image/'),
      )
      if (item) {
        const file = item.getAsFile()
        if (file) loadImage(file)
      }
    }
    window.addEventListener('paste', handler)
    return () => window.removeEventListener('paste', handler)
  }, [loadImage])

  return (
    <div className="upload-wrapper">
      {!hasImage ? (
        <label
          className={`drop-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="drop-icon">⊕</div>
          <p>{s.dropHint1}</p>
          <p>{s.dropHint2}</p>
        </label>
      ) : (
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            className="upload-canvas"
            onClick={handleCanvasClick}
          />
          <div ref={crosshairRef} className="canvas-crosshair" />
          <button
            type="button"
            className="reset-btn"
            onClick={() => {
              setHasImage(false)
              imgRef.current = null
              const ch = crosshairRef.current
              if (ch) ch.classList.remove('visible')
            }}
          >
            {s.clear}
          </button>
        </div>
      )}
    </div>
  )
}
