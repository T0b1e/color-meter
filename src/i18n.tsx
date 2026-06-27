import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Lang = 'th' | 'en'

export const translations = {
  th: {
    title: 'เครื่องวัดสี',
    camera: 'กล้อง',
    upload: 'อัปโหลด',
    sampledColor: 'สีที่วัดได้',
    dominantPalette: 'จานสีหลัก',
    export: 'ส่งออก',
    cssVars: 'CSS Vars',
    tailwind: 'Tailwind',
    json: 'JSON',
    dropHint1: 'วางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์',
    dropHint2: 'หรือวางจากคลิปบอร์ด (Ctrl+V)',
    placeholder: 'ชี้กล้องหรือคลิกบนรูปภาพเพื่อเลือกสี',
    starting: 'กำลังเปิดกล้อง…',
    cameraError: 'ไม่สามารถเข้าถึงกล้องได้',
    clickToCopy: 'คลิกเพื่อคัดลอก',
    copied: 'คัดลอกแล้ว!',
    clear: '✕ ล้าง',
    name: 'ชื่อสี',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    freeze: 'หยุดภาพ',
    unfreeze: 'สดๆ',
    langLabel: 'EN',
    tosTitle: '⚠ ข้อควรทราบก่อนใช้งาน',
    tosBody: 'เครื่องมือนี้ให้ค่าสีโดยประมาณเท่านั้น ผลลัพธ์อาจคลาดเคลื่อนได้จากหลายปัจจัย',
    tosFactors: ['แสงสว่างในสภาพแวดล้อม', 'ความมืด / เงา', 'คุณภาพกล้อง', 'ความคมชัดของภาพ', 'การสอบเทียบสีหน้าจอ'],
    tosAccept: 'รับทราบและใช้งานต่อ',
    footerNote: 'ผลลัพธ์เป็นค่าประมาณ ขึ้นอยู่กับแสง กล้อง และหน้าจอ',
    madeBy: 'สร้างโดย',
  },
  en: {
    title: 'COLOR METER',
    camera: 'Camera',
    upload: 'Upload',
    sampledColor: 'Sampled Color',
    dominantPalette: 'Dominant Palette',
    export: 'Export',
    cssVars: 'CSS Vars',
    tailwind: 'Tailwind',
    json: 'JSON',
    dropHint1: 'Drop image here, click to browse,',
    dropHint2: 'or paste from clipboard',
    placeholder: 'Point camera or click image to sample',
    starting: 'Starting camera…',
    cameraError: 'Camera access denied or unavailable.',
    clickToCopy: 'Click to copy',
    copied: 'Copied!',
    clear: '✕ Clear',
    name: 'Name',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    freeze: 'Freeze',
    unfreeze: 'Live',
    langLabel: 'ไทย',
    tosTitle: '⚠ Accuracy Notice',
    tosBody: 'This tool provides approximate color values only. Results may vary due to several factors:',
    tosFactors: ['Ambient lighting conditions', 'Darkness / shadows', 'Camera quality', 'Image sharpness / focus', 'Display color calibration'],
    tosAccept: 'I understand, continue',
    footerNote: 'Results are approximate and depend on lighting, camera, and display.',
    madeBy: 'Made by',
  },
}

type Strings = typeof translations.th

interface LangContext {
  lang: Lang
  setLang: (l: Lang) => void
  s: Strings
}

const LangCtx = createContext<LangContext>({
  lang: 'th',
  setLang: () => {},
  s: translations.th,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('th')
  return (
    <LangCtx.Provider value={{ lang, setLang, s: translations[lang] }}>
      {children}
    </LangCtx.Provider>
  )
}

export function useLang() {
  return useContext(LangCtx)
}
