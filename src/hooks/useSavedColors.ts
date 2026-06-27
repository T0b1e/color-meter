import { useState, useCallback } from 'react'
import type { ColorInfo } from '../utils/colorUtils'

export interface SavedColor extends ColorInfo {
  savedAt: number
}

const STORAGE_KEY = 'color-meter:saved'

function load(): SavedColor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedColor[]) : []
  } catch {
    return []
  }
}

function persist(colors: SavedColor[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(colors))
}

export function useSavedColors() {
  const [saved, setSaved] = useState<SavedColor[]>(load)

  const save = useCallback((color: ColorInfo) => {
    setSaved((prev) => {
      if (prev.some((c) => c.hex === color.hex)) return prev
      const next = [{ ...color, savedAt: Date.now() }, ...prev]
      persist(next)
      return next
    })
  }, [])

  const remove = useCallback((hex: string) => {
    setSaved((prev) => {
      const next = prev.filter((c) => c.hex !== hex)
      persist(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSaved([])
  }, [])

  const isSaved = useCallback(
    (hex: string) => saved.some((c) => c.hex === hex),
    [saved],
  )

  return { saved, save, remove, clearAll, isSaved }
}
