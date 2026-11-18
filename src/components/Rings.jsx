import { useEffect, useRef, useState } from 'react';

/* 세 개의 겹친 원 — 알아차림 · 헤아림 · 응답
   원은 순수 SVG + CSS 전환으로 그린다. (iOS 사파리·카카오톡 인앱 브라우저 등
   WebKit에서 원 요소에 JS 애니메이션을 걸면 그려지지 않는 문제가 있어서) */
const R = 92;
const C = Math.ceil(2 * Math.PI * R);

export default function Rings({ labels, dark = false }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    // 관찰이 늦게 오더라도 원이 안 보이는 일은 없도록 안전장치
    const t = setTimeout(() => setShown(true), 4000);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  const pos = [120, 220, 320];
  const stroke = dark ? '#E2B19C' : '#6E5C51';
  const text = dark ? '#F6F1EB' : '#2B2522';

  return (
    <div ref={ref} className={`rings${shown ? ' is-shown' : ''}`}>
      <svg viewBox="0 0 440 240" role="img" aria-label={labels.join(', ')}>
        {pos.map((cx, i) => (
          <circle
            key={`c${i}`}
            className="rings__circle"
            cx={cx}
            cy={120}
            r={R}
            fill={i === 1 ? (dark ? 'rgba(226,177,156,0.10)' : 'rgba(154,78,54,0.06)') : 'none'}
            stroke={i === 1 ? '#9A4E36' : stroke}
            strokeWidth={i === 1 ? 2 : 1.25}
            strokeDasharray={C}
            transform={`rotate(-90 ${cx} 120)`}
            style={{ '--c': C, transitionDelay: `${0.25 * i}s` }}
          />
        ))}
        {pos.map((cx, i) => (
          <text
            key={`t${i}`}
            x={cx}
            y={126}
            textAnchor="middle"
            fill={i === 1 && !dark ? '#9A4E36' : text}
            className="rings__label"
            style={{ transitionDelay: `${0.8 + 0.2 * i}s` }}
          >
            {labels[i]}
          </text>
        ))}
      </svg>
    </div>
  );
}
