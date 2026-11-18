import { motion } from 'motion/react';

/* 세 개의 겹친 원 — 알아차림 · 헤아림 · 응답 */
export default function Rings({ labels, dark = false }) {
  const pos = [
    { cx: 120, cy: 120 },
    { cx: 220, cy: 120 },
    { cx: 320, cy: 120 }
  ];
  const stroke = dark ? '#E2B19C' : '#6E5C51';
  const text = dark ? '#F6F1EB' : '#2B2522';
  return (
    <svg className="rings" viewBox="0 0 440 240" role="img" aria-label={labels.join(', ')}>
      {pos.map((p, i) => (
        <g key={i}>
          <motion.circle
            cx={p.cx}
            cy={p.cy}
            r="92"
            fill={i === 1 ? (dark ? 'rgba(226,177,156,0.10)' : 'rgba(154,78,54,0.06)') : 'none'}
            stroke={i === 1 ? '#9A4E36' : stroke}
            strokeWidth={i === 1 ? 2 : 1.25}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.25 * i, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotate: -90, transformOrigin: `${p.cx}px ${p.cy}px` }}
          />
          <motion.text
            x={p.cx}
            y={p.cy + 6}
            textAnchor="middle"
            fill={i === 1 && !dark ? '#9A4E36' : text}
            className="rings__label"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 + 0.2 * i }}
          >
            {labels[i]}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}
