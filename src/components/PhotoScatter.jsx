import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const BASE = import.meta.env.BASE_URL;

const PHOTOS = [
  { src: 'c00.webp', label: 'B1층', ratio: 1.5 },
  { src: 'c01.webp', label: 'B1층 · 상담실', ratio: 1.33 },
  { src: 'c02.webp', label: '1층', ratio: 1.5 },
  { src: 'c03.webp', label: '2층 · 피부클리닉', ratio: 0.667 },
  { src: 'c04.webp', label: '2층 · 피부클리닉', ratio: 1.5 },
  { src: 'c05.webp', label: '3층 · 클리닉', ratio: 1.5 },
  { src: 'c06.webp', label: '3층 · 클리닉', ratio: 1.5 },
  { src: 'c07.webp', label: '3층 · 클리닉', ratio: 1.5 },
  { src: 'c08.webp', label: '3층 · 클리닉', ratio: 1.5 },
  { src: 'c09.webp', label: '3층 · 클리닉', ratio: 1.5 },
  { src: 'c10.webp', label: '3층 · 클리닉', ratio: 1.5 },
  { src: 'c11.webp', label: '3층 · 클리닉', ratio: 0.667 },
  { src: 'c12.webp', label: '4층 · 여성클리닉', ratio: 1.5 },
  { src: 'c13.webp', label: '4층 · 여성클리닉', ratio: 1.5 },
  { src: 'c14.webp', label: '4층 · 여성클리닉', ratio: 1.5 },
  { src: 'c15.webp', label: '4층 · 여성클리닉', ratio: 1.5 },
  { src: 'c16.webp', label: '5층 · 프리컨디셔닝', ratio: 1.5 },
  { src: 'c17.webp', label: '5층', ratio: 1.5 }
];

// 매번 같은 배치가 나오도록 고정된 의사난수
const rand = seed => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const spring = { type: 'spring', stiffness: 120, damping: 18, mass: 0.9 };

export default function PhotoScatter() {
  const stageRef = useRef(null);
  const [size, setSize] = useState({ w: 1100, h: 640 });
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(null);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && setZoom(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const mobile = size.w < 640;
  const cardW = mobile ? Math.min(150, size.w * 0.4) : Math.min(250, Math.max(170, size.w * 0.19));

  const layout = useMemo(() => {
    const cols = mobile ? 3 : 6;
    const rows = Math.ceil(PHOTOS.length / cols);
    const cellW = size.w / cols;
    const cellH = size.h / rows;
    return PHOTOS.map((p, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const h = cardW / p.ratio;
      // 흩뿌려진 위치: 격자 + 흔들림, 무대 안쪽으로 클램프
      let x = (c + 0.5) * cellW - size.w / 2 + (rand(i + 1) - 0.5) * cellW * 0.55;
      let y = (r + 0.5) * cellH - size.h / 2 + (rand(i + 31) - 0.5) * cellH * 0.45;
      const maxX = size.w / 2 - cardW / 2 - 4;
      const maxY = size.h / 2 - h / 2 - 4;
      x = Math.max(-maxX, Math.min(maxX, x));
      y = Math.max(-maxY, Math.min(maxY, y));
      return {
        scatter: { x, y, rotate: (rand(i + 7) - 0.5) * 22 },
        pile: { x: (rand(i + 11) - 0.5) * 14, y: (rand(i + 13) - 0.5) * 12, rotate: (rand(i + 17) - 0.5) * 14 },
        h
      };
    });
  }, [size, cardW, mobile]);

  return (
    <div className="scatter">
      <div
        ref={stageRef}
        className={`scatter__stage${open ? ' is-open' : ''}`}
        onClick={() => !open && setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={open ? '사진 펼쳐짐' : '클릭해서 사진 펼치기'}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setOpen(o => !o)}
      >
        {PHOTOS.map((p, i) => {
          const L = layout[i];
          const target = open ? L.scatter : L.pile;
          return (
            <motion.button
              type="button"
              key={p.src}
              className="scatter__card"
              style={{ width: cardW, height: L.h, marginLeft: -cardW / 2, marginTop: -L.h / 2, zIndex: open ? 1 + i : i }}
              initial={false}
              animate={{ ...target, scale: open ? 1 : 1.3 }}
              whileHover={open ? { scale: 1.08, rotate: 0, zIndex: 40 } : undefined}
              transition={{ ...spring, delay: open ? i * 0.035 : (PHOTOS.length - i) * 0.02 }}
              onClick={e => {
                if (!open) return;
                e.stopPropagation();
                setZoom(i);
              }}
              tabIndex={open ? 0 : -1}
            >
              <img src={`${BASE}clinic/${p.src}`} alt={p.label} loading="lazy" draggable="false" />
              <span className="scatter__label">{p.label}</span>
            </motion.button>
          );
        })}

        <AnimatePresence>
          {!open && (
            <motion.div
              className="scatter__hint"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4 }}
            >
              <span className="scatter__dot" />
              클릭해서 펼쳐보기
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            className="scatter__gather"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setOpen(false)}
          >
            다시 모으기
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoom !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
          >
            <motion.figure
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={`${BASE}clinic/${PHOTOS[zoom].src}`} alt={PHOTOS[zoom].label} />
              <figcaption>{PHOTOS[zoom].label}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
