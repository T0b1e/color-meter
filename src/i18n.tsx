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
    tosFactors: [
      'แสงสว่างในสภาพแวดล้อม',
      'ความมืด / เงา',
      'คุณภาพกล้อง',
      'ความคมชัดของภาพ',
      'การสอบเทียบสีหน้าจอ',
    ],
    tosAccept: 'รับทราบและใช้งานต่อ',
    footerNote: 'ผลลัพธ์เป็นค่าประมาณ ขึ้นอยู่กับแสง กล้อง และหน้าจอ',
    madeBy: 'สร้างโดย',
    saveColor: 'บันทึกสีนี้',
    alreadySaved: 'บันทึกแล้ว',
    savedColors: 'สีที่บันทึกไว้',
    clearAll: 'ล้างทั้งหมด',
    // Accuracy guide
    guideTitle: '🎯 คู่มือการวัดสีให้แม่นยำ',
    guideSubtitle: 'อิงผลงานวิจัย — ปฏิบัติตามเพื่อผลลัพธ์ที่ใกล้เคียงสีจริงมากที่สุด',
    // Core problem
    coreTitle: 'ทำไมสีจากกล้อง ≠ สีจริง',
    wbTitle: '1. ไวต์บาลานซ์ / อุณหภูมิสี',
    wbBody:
      'แสงแต่ละแหล่งมีอุณหภูมิสี (Kelvin) ต่างกัน เมื่อกล้องปรับไวต์บาลานซ์ผิด ค่าสีทุกค่าจะเบี่ยงเบน เช่น วัตถุสีขาวใต้หลอดทังสเตนจะอ่านค่าเป็นสีส้ม นี่คือ สาเหตุอันดับ 1 ของความคลาดเคลื่อน',
    ispTitle: '2. การประมวลผลภาพในกล้อง (ISP)',
    ispBody:
      'กล้องปรับแก้อัตโนมัติก่อนที่คุณจะเห็นพิกเซล ได้แก่ ปรับแสงอัตโนมัติ, ไวต์บาลานซ์อัตโนมัติ, โทนแมปปิง, เพิ่มความอิ่มตัวสี (โทรศัพท์ส่วนใหญ่เพิ่มเกินจริง)',
    ispResearch:
      'ผลวิจัย: กล้องสมาร์ตโฟนมักประเมิน Saturation สูงเกินจริง และ Value ต่ำกว่าค่า Pantone อ้างอิง',
    surfaceTitle: '3. วัสดุพื้นผิว',
    // Delta E
    deltaETitle: 'มาตรฐานความแม่นยำสี — Delta E (ΔE)',
    deltaEBody:
      'ΔE คือมาตรฐานสากล (CIE) ในการวัดความต่างของสีในพื้นที่สี CIELAB ซึ่งออกแบบให้ค่าที่เท่ากันสอดคล้องกับการรับรู้ที่เท่ากัน',
    deltaETarget: 'เป้าหมาย: ΔE ≤ 2 สำหรับงานที่ต้องการความแม่นยำสูง',
    deltaEScale: [
      '0 = เหมือนกันสมบูรณ์',
      '0–1 = แยกไม่ออก',
      '1–2 = เห็นต่างได้เฉพาะผู้เชี่ยวชาญ',
      '2–3 = เห็นต่างเมื่อเทียบชิดกัน',
      '3–5 = เห็นต่างชัดเจน',
      '5+ = ต่างกันมาก',
    ],
    // Practical tips
    lightingTitle: 'แสงสว่าง — ปัจจัยสำคัญที่สุด',
    lightingBest:
      'แนะนำ: แสงขาวนวล กระจายตัวดี อุณหภูมิ 5000–5500 K ส่องจากด้านหน้าวัตถุในมุม ~45°',
    wbLockTitle: 'ล็อกไวต์บาลานซ์',
    wbLockBody:
      'ห้ามใช้ Auto WB ขณะวัดสี — กล้องปรับค่าตลอดเวลาทำให้ผลเปลี่ยนแปลง กด tap-and-hold บนโทรศัพท์เพื่อล็อกโฟกัสและแสง',
    samplingTitle: 'เทคนิคการวัด',
    uploadVsCameraTitle: 'โหมดอัปโหลด vs กล้อง',
    uploadVsCameraBody:
      'โหมดอัปโหลดแม่นยำกว่า สำหรับวัตถุนิ่ง เพราะควบคุมแสงได้, เลือกพิกเซลได้แม่นยำ, ไม่มีการเบี่ยงเบนของ AWB แบบเรียลไทม์',
    // Color space guide
    colorSpaceTitle: 'สีแต่ละรูปแบบบอกอะไรได้บ้าง',
    hueReliable: 'Hue (H) — น่าเชื่อถือที่สุด เปลี่ยนแปลงน้อยที่สุดตามแสง',
    satCaution: 'Saturation (S) — โทรศัพท์มักเพิ่มค่าเกินจริง',
    lightCaution: 'Lightness (L) — ได้รับผลโดยตรงจากการรับแสงและเงา',
    colorNameCaution: 'ชื่อสี — ระบุแบบคร่าวๆ เท่านั้น ไม่ละเอียดพอสำหรับงานจริง',
    // Quick checklist
    checklistTitle: 'รายการตรวจสอบก่อนวัดสี',
    checklistItems: [
      'แหล่งแสงเป็นกลาง (แสงธรรมชาติหรือหลอด 5000 K)',
      'ไม่มีแสงผสม (ไม่ใช้หน้าต่าง + โคมไฟพร้อมกัน)',
      'ล็อกไวต์บาลานซ์ (ไม่ใช้ Auto)',
      'พื้นผิวด้าน หรือกล้องเอียง ~45° เพื่อหลีกเลี่ยงแสงสะท้อน',
      'กล้องตั้งฉากกับพื้นผิว',
      'วัตถุเต็มเฟรม เป้าอยู่ตรงกลางบริเวณสีสม่ำเสมอ',
      'ภาพชัด / โฟกัสถูกต้อง',
    ],
    checklistCriticalItems: [
      'ถ่ายภาพร่วมกับ grey card หรือ white reference patch',
      'ใช้ค่าอ้างอิงขาวแก้ไขค่าสีในซอฟต์แวร์',
      'เฉลี่ยผลการวัดอย่างน้อย 3–5 จุดบนพื้นที่เดียวกัน',
      'ตรวจสอบด้วยสวอตช์ Pantone / RAL จริง หรือ colorimeter มาตรฐาน',
    ],
    cameraPermTitle: 'ต้องการเข้าถึงกล้อง',
    cameraPermBody:
      'แอปต้องการใช้กล้องเพื่อวัดสีแบบเรียลไทม์ คลิก "อนุญาต" เพื่อเริ่มต้น ระบบจะจำการตัดสินใจนี้ไว้',
    cameraPermBtn: 'อนุญาตใช้กล้อง',
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
    tosBody:
      'This tool provides approximate color values only. Results may vary due to several factors:',
    tosFactors: [
      'Ambient lighting conditions',
      'Darkness / shadows',
      'Camera quality',
      'Image sharpness / focus',
      'Display color calibration',
    ],
    tosAccept: 'I understand, continue',
    footerNote: 'Results are approximate and depend on lighting, camera, and display.',
    madeBy: 'Made by',
    saveColor: 'Save this color',
    alreadySaved: 'Saved',
    savedColors: 'Saved Colors',
    clearAll: 'Clear all',
    // Accuracy guide
    guideTitle: '🎯 Color Accuracy Guide',
    guideSubtitle:
      'Research-backed guidelines for getting readings as close to ground truth as possible.',
    // Core problem
    coreTitle: 'Why Camera Color ≠ True Color',
    wbTitle: '1. White Balance / Color Temperature',
    wbBody:
      'Light sources have different temperatures (Kelvin). When the camera white balance is wrong, every color reading shifts. A white object under tungsten light reads as orange. This is the #1 source of inaccuracy.',
    ispTitle: '2. In-Camera Image Processing (ISP)',
    ispBody:
      'Cameras apply automatic corrections before you see any pixel: auto-exposure, auto white balance, tone mapping, and saturation enhancement (most phones over-saturate).',
    ispResearch:
      'Research finding: Smartphone cameras systematically overestimate Saturation and underestimate Value compared to Pantone reference values.',
    surfaceTitle: '3. Surface / Material Effects',
    // Delta E
    deltaETitle: 'Color Accuracy Standard — Delta E (ΔE)',
    deltaEBody:
      'ΔE is the international CIE standard for quantifying color difference, calculated in CIELAB color space — designed so equal ΔE values correspond to equal perceived differences.',
    deltaETarget: 'Target: ΔE ≤ 2 for professional color-accurate work.',
    deltaEScale: [
      '0 = Perfect match',
      '0–1 = Imperceptible',
      '1–2 = Barely perceptible (trained eye)',
      '2–3 = Noticeable on close comparison',
      '3–5 = Clearly visible',
      '5+ = Strong color difference',
    ],
    // Practical tips
    lightingTitle: 'Lighting — the single biggest factor',
    lightingBest:
      'Best setup: soft, diffused, neutral-white light (5000–5500 K) hitting the object from the front at ~45°.',
    wbLockTitle: 'Lock White Balance',
    wbLockBody:
      'Never use Auto WB when measuring color — the camera continuously re-estimates white balance and shifts readings. Tap-and-hold on a phone to lock focus and exposure.',
    samplingTitle: 'Sampling Technique',
    uploadVsCameraTitle: 'Upload Mode vs Camera Mode',
    uploadVsCameraBody:
      'Upload mode is more accurate for static objects: you control lighting at capture, choose the exact pixel by clicking, and there is no real-time AWB drift.',
    // Color space guide
    colorSpaceTitle: 'What Each Color Space Tells You',
    hueReliable: 'Hue (H) — most reliable; shifts least with lighting',
    satCaution: 'Saturation (S) — often inflated by phone ISP',
    lightCaution: 'Lightness (L) — directly affected by exposure and shadows',
    colorNameCaution: 'Color Name — coarse ballpark only; not suitable for precision work',
    // Quick checklist
    checklistTitle: 'Quick Field Checklist',
    checklistItems: [
      'Light source is neutral (daylight or 5000 K LED)',
      'No mixed lighting (not window + lamp simultaneously)',
      'White balance is locked (not Auto)',
      'Surface is matte, or camera is at ~45° to avoid glare',
      'Camera is perpendicular to the surface',
      'Object fills the frame; crosshair centered on flat, even-color area',
      'Area is in focus',
    ],
    checklistCriticalItems: [
      'Include a grey card or white reference patch in the shot',
      'Apply white reference correction in software',
      'Average at least 3–5 readings on different flat spots',
      'Verify with a physical Pantone / RAL swatch or calibrated colorimeter',
    ],
    cameraPermTitle: 'Camera Access Required',
    cameraPermBody:
      'This app needs your camera to measure colors in real time. Click "Allow Camera" to get started — your choice will be remembered.',
    cameraPermBtn: 'Allow Camera',
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
    <LangCtx.Provider value={{ lang, setLang, s: translations[lang] }}>{children}</LangCtx.Provider>
  )
}

export function useLang() {
  return useContext(LangCtx)
}
