import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

import SplitText from './components/reactbits/SplitText.jsx';
import BlurText from './components/reactbits/BlurText.jsx';
import ScrollReveal from './components/reactbits/ScrollReveal.jsx';
import ScrollFloat from './components/reactbits/ScrollFloat.jsx';
import CountUp from './components/reactbits/CountUp.jsx';
import ShinyText from './components/reactbits/ShinyText.jsx';
import DecryptedText from './components/reactbits/DecryptedText.jsx';
import AnimatedContent from './components/reactbits/AnimatedContent.jsx';
import SpotlightCard from './components/reactbits/SpotlightCard.jsx';
import Threads from './components/reactbits/Threads.jsx';

import Rings from './components/Rings.jsx';
import PhotoScatter from './components/PhotoScatter.jsx';
import { IconTool, IconChat, IconWarning, IconPlay } from './components/Icons.jsx';

const CHAPTERS = [
  { id: 'intro', label: '세심함' },
  { id: 'problem', label: '문제' },
  { id: 'background', label: '배경' },
  { id: 'solution', label: '솔루션' },
  { id: 'research', label: '연구' }
];

const ease = [0.22, 1, 0.36, 1];

/* 스크롤 중에는 WebGL 배경을 잠시 멈춰서 스크롤이 끊기지 않게 한다 */
let scrollingNow = false;
const scrollSubs = new Set();
if (typeof window !== 'undefined') {
  let t = 0;
  window.addEventListener(
    'scroll',
    () => {
      if (!scrollingNow) {
        scrollingNow = true;
        scrollSubs.forEach(fn => fn(true));
      }
      clearTimeout(t);
      t = setTimeout(() => {
        scrollingNow = false;
        scrollSubs.forEach(fn => fn(false));
      }, 180);
    },
    { passive: true }
  );
}
function useScrolling() {
  const [v, setV] = useState(scrollingNow);
  useEffect(() => {
    scrollSubs.add(setV);
    return () => scrollSubs.delete(setV);
  }, []);
  return v;
}
const CalmThreads = props => {
  const scrolling = useScrolling();
  return <Threads {...props} paused={scrolling} />;
};


const Reveal = ({ children, delay = 0, y = 32, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-12% 0px' }}
    transition={{ duration: 0.9, ease, delay }}
  >
    {children}
  </motion.div>
);

const Eyebrow = ({ children, light }) => (
  <Reveal y={12}>
    <p className={`eyebrow${light ? ' eyebrow--light' : ''}`}>{children}</p>
  </Reveal>
);

function useActiveChapter() {
  const [active, setActive] = useState('intro');
  useEffect(() => {
    const els = document.querySelectorAll('[data-chapter]');
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.dataset.chapter);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function TopBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const active = useActiveChapter();
  return (
    <header className="topbar">
      <motion.div className="topbar__progress" style={{ scaleX }} />
      <a className="topbar__mark" href="#top">
        <span className="topbar__dot" />
        Attentiveness
      </a>
      <nav className="topbar__nav">
        {CHAPTERS.map((c, i) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={active === c.id ? 'is-active' : ''}
            onClick={e => {
              const el = document.getElementById(c.id);
              if (!el) return;
              e.preventDefault();
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <span className="num">0{i + 1}</span>
            {c.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

/* ───────────────── 01 · HERO ───────────────── */
function Hero() {
  return (
    <section className="hero" id="top" data-chapter="intro">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__blob hero__blob--3" />
        <div className="hero__grain" />
      </div>
      <div className="hero__inner">
        <h1 className="hero__title">
          <SplitText text="AI가 먼저 듣고," tag="span" className="hero__line" splitType="chars" delay={60} duration={1.1} trigger="load" textAlign="left" />
          <SplitText text="사람이 상담한다." tag="span" className="hero__line hero__line--accent" splitType="chars" delay={60} duration={1.1} trigger="load" textAlign="left" />
        </h1>
        <motion.p
          className="hero__lead"
          initial={{ opacity: 0, filter: 'blur(10px)', y: 12 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1.2, delay: 1.1, ease }}
        >
          뷰티·의료 분야 상담 과정에서 AI가 듣고,{' '}
          <br />
          사람이 상담하는 것이 어떻게 고객을 위한 세심함이 되는가
        </motion.p>
        <motion.div
          className="hero__rings"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.6, ease }}
        >
          <Rings labels={['알아차림', '헤아림', '응답']} />
        </motion.div>
      </div>
      <motion.div className="scrollcue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <span>scroll</span>
        <i />
      </motion.div>
    </section>
  );
}

/* ───────────────── DEFINE ───────────────── */
function Define() {
  return (
    <section className="sec define">
      <div className="wrap">
        <Eyebrow>내가 말하는 세심함이란?</Eyebrow>
        <div className="define__word">
          <ShinyText text="Attentiveness" color="#2B2522" shineColor="#E2B19C" speed={3.2} trigger="loop" />
        </div>
        <ScrollReveal
          baseOpacity={0.12}
          enableBlur
          blurStrength={6}
          baseRotation={0}
          containerClassName="define__statement"
          textClassName="define__statement-text"
        >
          {'세심함이란 상대가 말하지 않은 필요·불편을\n미리 알아차리고, 헤아리고, 응답하는 것이다.'}
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ───────────────── STEPS ───────────────── */
const STEPS = [
  { n: '01', ko: '알아차림', en: 'NOTICE', body: ['상대가 말하지 않은', '필요나 불편을 감지한다'] },
  { n: '02', ko: '헤아림', en: 'INTERPRET', body: ['그것이 상대에게 어떤 의미인지', '상대의 입장에서 이해한다'] },
  { n: '03', ko: '응답', en: 'RESPOND', body: ['그 이해 바탕으로', '구체적인 형태로 전달한다'] }
];

function Steps() {
  return (
    <section className="sec steps">
      <div className="wrap">
        <Eyebrow>세심함의 세 단계</Eyebrow>
        <h2 className="h2">
          <BlurText text="알아차리고, 헤아리고, 응답한다" animateBy="words" delay={160} direction="top" />
        </h2>
        <div className="steps__grid">
          <motion.div
            className="steps__line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 1.6, ease }}
          />
          {STEPS.map((s, i) => (
            <AnimatedContent key={s.n} distance={60} delay={0.15 * i} duration={0.9} blur={8}>
              <SpotlightCard theme="light" spotlightColor="rgba(154, 78, 54, 0.22)" className="card step">
                <span className="step__n">{s.n}</span>
                <span className="step__en">{s.en}</span>
                <h3 className="step__ko">{s.ko}</h3>
                <p className="step__body">
                  {s.body[0]}
                  <br />
                  {s.body[1]}
                </p>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── STANDARD ───────────────── */
const TILES = ['무언가를 해주는 것', '과하지 않게 해주는 것', '무언가를 하지 않는 것'];

function Standard() {
  return (
    <section className="sec standard">
      <div className="wrap">
        <Eyebrow>세심함의 기준</Eyebrow>
        <h2 className="h2 h2--big">
          <Reveal>세심함의 기준은 내가 아니라</Reveal>
          <Reveal delay={0.15}>
            <span className="hl">상대에게</span> 있다
          </Reveal>
        </h2>
        <Reveal delay={0.25}>
          <p className="lead">따라서 세심함은 제공하는 사람이 판단할 수 없고, 받아들이는 사람의 몫이다.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="standard__line">예를 들어, 이 모두가 세심함이다</p>
        </Reveal>
        <div className="tiles">
          {TILES.map((t, i) => (
            <AnimatedContent key={t} distance={40} delay={0.12 * i} scale={0.96}>
              <div className={`tile tile--${i + 1}`}>
                <span className="tile__n">0{i + 1}</span>
                <p>{t}</p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── DESIGN → VALUE ───────────────── */
const FLOW3 = [
  { en: 'ATTENTIVENESS', ko: '세심함', body: ['말하지 않은 필요·불편을', '알아차리고, 헤아리고, 응답하는 것'] },
  { en: 'DESIGN', ko: '디자인', body: ['세심함을 감각적으로 인지할 수 있는 형태로 옮기는 일'] },
  { en: 'HIGH VALUE', ko: '고부가가치', body: ['고객이 서비스나 프로덕트를 통해 느끼는', '효용 가치의 극대화'] }
];

function DesignValue() {
  return (
    <section className="sec design">
      <div className="wrap">
        <Eyebrow>디자인과 고부가가치</Eyebrow>
        <h2 className="h2">
          <Reveal>디자인은 세심함을 감각적으로 인지할 수 있는 형태로</Reveal>
          <Reveal delay={0.12}>옮기는 일이며, 이는 고부가가치로 이어진다</Reveal>
        </h2>
        <div className="flow3">
          {FLOW3.map((f, i) => (
            <div className="flow3__cell" key={f.en}>
              <motion.div
                className={`flow3__node flow3__node--${i + 1}`}
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.9, ease, delay: 0.35 * i }}
              >
                <span className="flow3__en">{f.en}</span>
                <h3>{f.ko}</h3>
                <p>
                  {f.body.map((line, k) => (
                    <span key={k}>
                      {k > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </p>
              </motion.div>
              {i < FLOW3.length - 1 && (
                <svg className="flow3__arrow" viewBox="0 0 60 24" aria-hidden="true">
                  <motion.path
                    d="M2 12 H54 M44 3 L56 12 L44 21"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: '-15% 0px' }}
                    transition={{ duration: 0.8, ease, delay: 0.35 * i + 0.4 }}
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="punch">고객은 그 가치를 디테일한 요소들 속에서 체감한다.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────── TOPIC (accent) ───────────────── */
function Topic() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['8%', '-18%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-14%', '10%']);
  return (
    <section className="sec topic" ref={ref}>
      <div className="topic__marquee" aria-hidden="true">
        <motion.span style={{ x: x1 }}>LISTEN · RESPOND · LISTEN · RESPOND ·</motion.span>
        <motion.span style={{ x: x2 }}>AI 듣기 · 사람 응답 · AI 듣기 · 사람 응답 ·</motion.span>
      </div>
      <div className="wrap topic__inner">
        <Eyebrow light>연구 주제</Eyebrow>
        <Reveal>
          <p className="topic__pre">뷰티·의료 분야 상담 과정에서</p>
        </Reveal>
        <h2 className="topic__title">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=40%"
            scrollEnd="bottom bottom-=30%"
            stagger={0.03}
            textClassName="topic__float"
          >
            AI가 먼저 듣고,
          </ScrollFloat>
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=40%"
            scrollEnd="bottom bottom-=30%"
            stagger={0.03}
            textClassName="topic__float"
          >
            사람이 상담하는 것이
          </ScrollFloat>
        </h2>
        <Reveal delay={0.2}>
          <p className="topic__post">어떻게 고객을 위한 세심함이 되는가</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────── PROBLEM ───────────────── */
const CHIPS = ['탈모·두피', '체형·비만', '피부 콤플렉스', '여성 건강', '비용 부담', '이전 시술의 불만·부작용'];

function Problem() {
  return (
    <section className="sec problem" id="problem" data-chapter="problem">
      <div className="wrap">
        <Eyebrow>문제 · 현장에서 발견한 문제</Eyebrow>
        <h2 className="h2">
          <Reveal>뷰티·의료 상담에서 고객은 본인의 민망한 상태를</Reveal>
          <Reveal delay={0.12}>
            <span className="hl">말하기 어려워한다</span>
          </Reveal>
        </h2>
        <div className="problem__grid">
          <Reveal className="field">
            <span className="tag">현장</span>
            <h3>
              다과목 뷰티·웰니스 클리닉(병원)
              <br />
              전체 운영 중
            </h3>
            <ul>
              <li>고객 경험 고도화</li>
              <li>공간 설계</li>
              <li>고객관리 시스템 설계·구축</li>
            </ul>
          </Reveal>
          <div className="chips">
            <Reveal y={10}>
              <p className="chips__label">말하기 어려운 고민</p>
            </Reveal>
            <div className="chips__cloud">
              {CHIPS.map((c, i) => (
                <motion.span
                  key={c}
                  className="chip"
                  initial={{ opacity: 0, y: 24, scale: 0.85 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.7, ease, delay: 0.08 * i }}
                >
                  <motion.span
                    className="chip__float"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3.2 + (i % 3) * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                  >
                    {c}
                  </motion.span>
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── FIELD PHOTOS ───────────────── */
function Field() {
  return (
    <section className="sec field-photos" data-chapter="problem">
      <div className="wrap">
        <Eyebrow>현장</Eyebrow>
        <h2 className="h2">
          <Reveal>다과목 뷰티·웰니스 클리닉</Reveal>
          <Reveal delay={0.12}>
            <span className="field-photos__sub">B1층부터 5층까지</span>
          </Reveal>
        </h2>
        <PhotoScatter />
      </div>
    </section>
  );
}

function Counselor() {
  return (
    <section className="sec counselor">
      <div className="wrap">
        <Eyebrow>문제 · 상담실장에 따라 갈리는 성과</Eyebrow>
        <h2 className="h2">
          <BlurText text="실적의 차이는 고객의 고민을 이끌어내는가에서 나뉜다" animateBy="words" delay={90} />
        </h2>
        <div className="versus">
          <AnimatedContent distance={80} direction="horizontal" reverse duration={1}>
            <div className="versus__card versus__card--good">
              <span className="versus__label">실적이 좋은 상담실장</span>
              <p>
                고객의 고민을 <strong>이끌어낸다</strong>
              </p>
              <div className="bubbles" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </div>
          </AnimatedContent>
          <AnimatedContent distance={80} direction="horizontal" duration={1}>
            <div className="versus__card versus__card--bad">
              <span className="versus__label">실적이 좋지 않은 상담실장</span>
              <p>
                고객의 고민을 <strong>이끌어내지 못한다</strong>
              </p>
              <div className="bubbles bubbles--empty" aria-hidden="true">
                <i />
              </div>
            </div>
          </AnimatedContent>
        </div>
        <Reveal delay={0.1}>
          <div className="callout">
            그리고 이 과정에서 형성된 <strong>감정적 라포</strong>는 병원이 아닌,{' '}
            <strong className="accent">해당 상담실장에게 귀속</strong>된다.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const SILENCE = [
  { Icon: IconTool, t: '맞지 않는 시술 결정', b: ['고객의 실제 기대와', '다른 상담과 시술'] },
  { Icon: IconChat, t: '뒤늦은 불만과 이탈', b: ['말하지 못한 아쉬움이', '리뷰와 재방문 포기로 드러남'] },
  { Icon: IconWarning, t: '안전 문제', b: ['복용 약이나 부작용 이력을', '숨기면 시술 안전이 흔들림'] }
];

function Silence() {
  return (
    <section className="sec silence">
      <div className="wrap">
        <Eyebrow>문제</Eyebrow>
        <h2 className="h2 h2--big">
          <BlurText text="말하지 못하면 생기는 일" animateBy="letters" delay={45} direction="bottom" />
        </h2>
        <div className="silence__grid">
          {SILENCE.map(({ Icon, t, b }, i) => (
            <AnimatedContent key={t} distance={50} delay={0.14 * i} blur={6}>
              <SpotlightCard theme="light" spotlightColor="rgba(154, 78, 54, 0.18)" className="card silence__card">
                <div className="silence__icon">
                  <Icon />
                </div>
                <h3>{t}</h3>
                <p>
                  {b[0]}
                  <br />
                  {b[1]}
                </p>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── VIDEO SLOT (single placeholder) ───────────────── */
const VIDEO_SRC = `${import.meta.env.BASE_URL}video/attentiveness.mp4`;
const VIDEO_POSTER = `${import.meta.env.BASE_URL}video/poster.jpg`;

function VideoSlot() {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    v.play().catch(() => {});
  };
  return (
    <section className="sec video" id="video" data-chapter="problem">
      <div className="wrap">
        <Eyebrow>처음 보는 사람에게 말한다는 것</Eyebrow>
        <Reveal>
          <div className="video__frame">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              poster={VIDEO_POSTER}
              preload="metadata"
              playsInline
              controls={started}
              onPlay={() => setStarted(true)}
            />
            {!started && (
              <button type="button" className="video__cover" onClick={play} aria-label="영상 재생">
                <span className="video__play">
                  <IconPlay />
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────── BACKGROUND (dark) ───────────────── */
function Disclosure() {
  return (
    <section className="sec dark disclosure" id="background" data-chapter="background">
      <div className="dark__bg" aria-hidden="true">
        <CalmThreads color={[0.89, 0.69, 0.61]} amplitude={1.2} distance={0.3} lineCount={45} opacity={0.55} speed={0.35} />
      </div>
      <div className="wrap disclosure__inner">
        <Eyebrow light>배경 · 사람들은 AI 앞에서 속마음을 더 털어놓는다</Eyebrow>
        <blockquote className="quote">
          <BlurText
            text="“AI는 나를 판단하지 않는다”는 믿음 때문에,"
            animateBy="words"
            delay={110}
            className="quote__line"
          />
          <BlurText
            text="소비자는 민감한 정보를 사람보다 AI에게 더 드러낸다."
            animateBy="words"
            delay={110}
            className="quote__line"
          />
        </blockquote>
        <Reveal delay={0.4}>
          <p className="cite">
            Kim, T. W., Jiang, L., Duhachek, A., Lee, H., &amp; Garvey, A. (2022). Do you mind if I ask you a personal
            question? How AI service agents alter consumer self-disclosure. <em>Journal of Service Research</em>, 25(4),
            649–666.
          </p>
        </Reveal>
        <Reveal delay={0.5}>
          <span className="pill">트렌드 · AI에게 속마음을 털어놓는다</span>
        </Reveal>
      </div>
    </section>
  );
}

function Empathy() {
  return (
    <section className="sec empathy">
      <div className="wrap">
        <Eyebrow>배경 · 하지만</Eyebrow>
        <h2 className="h2 h2--big">
          <Reveal>
            AI의 공감은 <span className="hl">덜 믿는다</span>
          </Reveal>
        </h2>
        <div className="empathy__grid">
          <AnimatedContent distance={60} blur={6}>
            <div className="stat">
              <div className="stat__big">
                <CountUp to={79.7} decimals={1} duration={2.2} suffix="%" />
              </div>
              <p className="stat__main">
                대화 전에 챗봇임을 밝히자
                <br />
                구매율이 79.7% 넘게 감소했다
              </p>
              <p className="stat__sub">
                고객이 챗봇을 덜 유능하고
                <br />
                덜 공감적이라고 지각했기 때문
              </p>
              <p className="stat__src">Luo 외(2019), Marketing Science · 6,200여 명 현장 실험</p>
            </div>
          </AnimatedContent>
          <AnimatedContent distance={60} blur={6} delay={0.15}>
            <div className="stat">
              <div className="stat__big stat__big--text">
                <DecryptedText
                  text="‘흉내 낸 공감’"
                  animateOn="view"
                  sequential
                  revealDirection="start"
                  speed={70}
                  useOriginalCharsOnly={false}
                  characters="공감흉내진심가짜말투표정위로"
                />
              </div>
              <p className="stat__main">
                AI임이 공개되면, 같은 공감 표현도
                <br />
                ‘흉내 낸 공감’으로 해석되어 신뢰가 깨진다
              </p>
              <p className="stat__src">Hao, 생성형 AI의 서비스 회복 메시지 실험 (XJTLU)</p>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── SOLUTION ───────────────── */
function Solution() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const leftX = useTransform(scrollYProgress, [0, 1], [-120, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [120, 0]);
  return (
    <section className="sec dark solution" id="solution" data-chapter="solution" ref={ref}>
      <div className="dark__bg dark__bg--soft" aria-hidden="true">
        <CalmThreads color={[0.24, 0.42, 0.45]} accentColor={[0.89, 0.69, 0.61]} amplitude={0.9} distance={0.2} lineCount={40} opacity={0.4} speed={0.25} angle={-15} />
      </div>
      <div className="wrap solution__inner">
        <Eyebrow light>솔루션</Eyebrow>
        <Reveal>
          <p className="solution__pre">속마음은 AI에게 더 털어놓지만, 공감과 신뢰는 사람에게서 더 받는다.</p>
        </Reveal>
        <div className="duo" aria-hidden="true">
          <motion.div className="duo__ring duo__ring--ai" style={{ x: leftX }}>
            <span>AI</span>
            <b>듣기</b>
          </motion.div>
          <motion.div className="duo__ring duo__ring--human" style={{ x: rightX }}>
            <span>사람</span>
            <b>공감</b>
          </motion.div>
        </div>
        <h2 className="solution__title">
          <SplitText text="AI가 먼저 듣고," tag="span" className="solution__line" splitType="chars" delay={50} />
          <SplitText text="사람이 상담한다." tag="span" className="solution__line solution__line--peach" splitType="chars" delay={50} />
        </h2>
      </div>
    </section>
  );
}

const FLOW = [
  { phase: '받기 1', who: 'ai', whoLabel: 'AI', t: 'AI 사전 상담을 원하는 고객만 이용' },
  {
    phase: '받기 2',
    who: 'ai',
    whoLabel: 'AI',
    t: 'AI 상담 진행',
    sub: ['흔한 고민은 선택지로', '가벼운 질문부터 무거운 질문으로']
  },
  { phase: '받기 3', who: 'mix', whoLabel: 'AI · 고객', t: 'AI와 상담한 내용을 상담사에게 어디까지 전달할지 고객이 결정' },
  { phase: '전하기', who: 'ai', whoLabel: 'AI', t: 'AI는 상담 직전에 고객이 결정한 만큼만 전달' },
  { phase: '응답하기', who: 'human', whoLabel: '사람', t: '상담사·시술자가 이어받아 대화' }
];

function Flow() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 22 });
  return (
    <section className="sec flow">
      <div className="wrap">
        <Eyebrow>솔루션 · 상담 흐름</Eyebrow>
        <h2 className="h2">
          <BlurText text="고객이 고르고, 고객이 정한 만큼만 전한다" animateBy="words" delay={110} />
        </h2>
        <div className="timeline" ref={ref}>
          <div className="timeline__rail">
            <motion.div className="timeline__fill" style={{ scaleY }} />
          </div>
          {FLOW.map((f, i) => (
            <motion.div
              key={f.phase}
              className={`tl tl--${f.who}`}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-25% 0px' }}
              transition={{ duration: 0.8, ease }}
            >
              <span className="tl__dot" />
              <div className="tl__meta">
                <span className="tl__phase">{f.phase}</span>
                <span className={`who who--${f.who}`}>{f.whoLabel}</span>
              </div>
              <p className="tl__t">{f.t}</p>
              {f.sub && (
                <ul className="tl__sub">
                  {f.sub.map(s => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
        <Reveal>
          <p className="scope">
            <span className="scope__x">진료 영역 ✕</span>
            <span className="scope__o">상담 영역 ○</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────── RESEARCH ───────────────── */
function RQ() {
  return (
    <section className="sec rq" id="research" data-chapter="research">
      <div className="wrap">
        <Eyebrow>연구 질문</Eyebrow>
        <h2 className="h2">
          <BlurText text="Research Questions" animateBy="letters" delay={30} />
        </h2>
        <div className="rq__list">
          {[
            <>
              고객은 어떤 고민을 혹은 어떤 상황에서 <strong>사람에게 말하길 원하고</strong>, 반대로{' '}
              <strong>왜 말하지 못하는가</strong>
            </>,
            <>
              고객이 선택한 AI 사전 상담은 고객의 <strong>민감한 고민을 더 털어놓게 하는가</strong>
            </>,
            <>
              사람이 이어받아 응답하는 방식에 따라 <strong>세심함과 진정성</strong>을 다르게 느끼는가,
              <br />
              그리고 그 <strong>감정의 귀속</strong>은 어떻게 달라지는가
            </>
          ].map((q, i) => (
            <AnimatedContent key={i} distance={40} delay={0.1 * i}>
              <div className="rq__item">
                <span className="rq__n">RQ{i + 1}</span>
                <p>{q}</p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}

const HYPO = [
  {
    n: 'H1',
    q: (
      <>
        고객이 선택한 AI 사전 상담에서 대면 상담만 할 때보다 <strong>민감한 고민을 더 많이 털어놓는다</strong>
      </>
    )
  },
  {
    n: 'H2',
    q: (
      <>
        AI가 받은 내용을 사람이 이어받아 상담할 때, AI가 혼자 상담할 때보다 <strong>진정성 있다고 느낀다</strong>
      </>
    )
  },
  {
    n: 'H3',
    q: (
      <>
        응답 방식에 따라 결과가 달라진다. 출처를 밝히고 고객에게 주도권을 줄 때{' '}
        <strong>진정성을 가장 높게 느낀다</strong>
      </>
    )
  },
  {
    n: 'H4',
    q: (
      <>
        이렇게 시작된 세심함은 특정 직원보다 <strong>브랜드에 귀속된다</strong>
      </>
    )
  }
];

function Hypotheses() {
  return (
    <section className="sec hypo">
      <div className="wrap">
        <Eyebrow>가설</Eyebrow>
        <h2 className="h2">
          <BlurText text="Hypotheses" animateBy="letters" delay={30} />
        </h2>
      </div>
      <div className="wrap hstack">
        {HYPO.map((h, i) => (
          <div key={h.n} className="hstack__slot" style={{ top: `calc(var(--stack-top) + ${i * 22}px)` }}>
            <div className={`hcard hcard--${i + 1}`}>
              <span className="hcard__n">{h.n}</span>
              <p className="hcard__q">{h.q}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────── CLOSING ───────────────── */
function Closing() {
  return (
    <section className="sec dark closing">
      <div className="dark__bg" aria-hidden="true">
        <CalmThreads color={[0.89, 0.69, 0.61]} amplitude={1.6} distance={0.35} lineCount={50} opacity={0.5} speed={0.3} angle={10} />
      </div>
      <div className="wrap closing__inner">
        <Eyebrow light>세심함(Attentiveness)</Eyebrow>
        <h2 className="closing__title">
          <SplitText text="세심함의 기준은" tag="span" className="closing__line" splitType="chars" delay={55} />
          <SplitText text="상대에게 있다" tag="span" className="closing__line closing__line--peach" splitType="chars" delay={55} />
        </h2>
        <Reveal delay={0.3} className="closing__rings">
          <Rings labels={['알아차림', '헤아림', '응답']} dark />
        </Reveal>
      </div>
      <footer className="foot">
        <span>AI가 먼저 듣고, 사람이 상담한다.</span>
        <span>Collection Building &amp; Design Management · 2026</span>
      </footer>
    </section>
  );
}

export default function App() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <Define />
        <Steps />
        <Standard />
        <DesignValue />
        <Topic />
        <VideoSlot />
        <Problem />
        <Field />
        <Counselor />
        <Silence />
        <Disclosure />
        <Empathy />
        <Solution />
        <Flow />
        <RQ />
        <Hypotheses />
        <Closing />
      </main>
    </>
  );
}
