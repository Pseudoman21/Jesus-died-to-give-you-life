import { useState, useRef } from 'react'
import './App.css'

import img1    from './assets/evange-cube/1.png'
import img2    from './assets/evange-cube/2.png'
import img3    from './assets/evange-cube/3.png'
import img4    from './assets/evange-cube/4.png'
import imgRose from './assets/evange-cube/5.png'
import img5    from './assets/evange-cube/6.png'
import img6    from './assets/evange-cube/7.png'

const PANELS = [
  {
    image: img1,
    ratio: '861/855',
    bg: '#0a0a0a',
    accent: '#c0392b',
    label: 'Hakbang 1 ng 7',
    tagLine: 'Ang Kasalanan',
    title: 'Nagkasala Tayo at Napalayo sa Diyos',
  },
  {
    image: img2,
    ratio: '745/1424',
    bg: '#1a1200',
    accent: '#d4a017',
    label: 'Hakbang 2 ng 7',
    tagLine: 'Ang Pag-ibig ng Diyos',
    title: 'Inibig Ka ng Diyos',
  },
  {
    image: img3,
    ratio: '1426/736',
    bg: '#2c0000',
    accent: '#e74c3c',
    label: 'Hakbang 3 ng 7',
    tagLine: 'Ang Sakripisyo',
    title: 'Si Jesus ay Namatay para sa Ating mga Kasalanan',
  },
  {
    image: img4,
    ratio: '1035/1024',
    bg: '#1e1e1e',
    accent: '#95a5a6',
    label: 'Hakbang 4 ng 7',
    tagLine: 'Sa Loob ng Libingan',
    title: 'Si Jesus ay Inilibing',
  },
  {
    image: imgRose,
    ratio: '736/1441',
    bg: '#071a07',
    accent: '#27ae60',
    label: 'Hakbang 5 ng 7',
    tagLine: 'Ang Muling Pagkabuhay',
    title: 'Si Jesus ay Muling Nabuhay!',
  },
  {
    image: img5,
    ratio: '736/1453',
    bg: '#0d0a00',
    accent: '#f39c12',
    label: 'Hakbang 6 ng 7',
    tagLine: 'Ang Tanging Daan',
    title: 'Si Jesus ang Tanging Daan',
  },
  {
    image: img6,
    ratio: '1029/1024',
    bg: '#1a0f00',
    accent: '#a0792a',
    label: 'Hakbang 7 ng 7',
    tagLine: 'Ang Iyong Desisyon',
    title: 'Maging Tagasunod ni Cristo',
  },
]

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────

function HomeScreen({ onStart }) {
  return (
    <div className="home-screen">
      <div className="home-hero">
        <img src="/header.png" alt="Jesus Died to Give You Life" />
        <div className="home-overlay">
          <p className="home-quote">
            "Naparito ako upang sila ay magkaroon ng buhay, at magkaroon nito nang sagana."
            <br /><strong>— Juan 10:10</strong>
          </p>
        </div>
      </div>
      <div className="home-actions">
        <button className="home-btn" onClick={onStart}>Share</button>
      </div>
    </div>
  )
}

// ─── PANEL SECTION ────────────────────────────────────────────────────────────

function PanelSection() {
  const [panel, setPanel]           = useState(0)
  const [panelKey, setPanelKey]     = useState(0)
  const [leaving, setLeaving]       = useState(false)
  const [nextPanelIdx, setNextPanelIdx] = useState(null)
  const exitClassRef  = useRef('leave-left')
  const enterClassRef = useRef('enter-right')
  const touchX        = useRef(0)

  const cur   = PANELS[panel]
  const total = PANELS.length

  const [rw, rh] = cur.ratio.split('/').map(Number)
  const isLandscape = rw / rh > 1.5

  const animClass  = leaving ? exitClassRef.current : enterClassRef.current
  const useXHalves = animClass.includes('-x-')

  function getTransitionClasses(from, to) {
    const isNext = to > from
    let style
    if (isNext) {
      if (from === 0 || from === 3) style = 'x-split'
      else if (from === 5) style = 'x-fold'
      else style = 'y'
    } else {
      if (to === 0 || to === 3) style = 'x-split'
      else if (to === 5) style = 'x-fold'
      else style = 'y'
    }
    const exitClass = isNext
      ? (style === 'x-split' ? 'leave-x-split' : style === 'x-open' ? 'leave-x-open' : style === 'x-fold' ? 'leave-x-fold' : 'leave-left')
      : 'leave-right'
    const enterClass = isNext
      ? 'enter-instant'
      : (style === 'x-split' ? 'enter-x-split' : style === 'x-open' ? 'enter-x-close' : style === 'x-fold' ? 'enter-x-unfold' : 'enter-left')
    return { exitClass, enterClass }
  }

  function go(dir) {
    if (leaving) return
    const next = dir === 'next' ? panel + 1 : panel - 1
    if (next < 0 || next >= total) return
    const { exitClass, enterClass } = getTransitionClasses(panel, next)
    exitClassRef.current = exitClass
    enterClassRef.current = enterClass
    setNextPanelIdx(next)
    setLeaving(true)
    setTimeout(() => {
      setPanel(next)
      setPanelKey(k => k + 1)
      setLeaving(false)
      setNextPanelIdx(null)
    }, dir === 'next' ? 700 : 320)
  }

  function handleTouchStart(e) { touchX.current = e.touches[0].clientX }
  function handleTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - touchX.current
    if (dx < -40) go('next')
    else if (dx > 40) go('prev')
  }

  return (
    <section
      className="panel-section"
      style={{ background: cur.bg }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="section-inner">
        <div className="panel-header">
          <span className="section-label" style={{ color: cur.accent }}>{cur.label}</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${((panel + 1) / total) * 100}%`, background: cur.accent }} />
          </div>
        </div>
      </div>

      <div className={`card-stage${isLandscape ? ' card-stage--landscape' : ''}`}>
        {leaving && nextPanelIdx !== null && (
          <div className="image-card image-card--behind">
            <img src={PANELS[nextPanelIdx].image} alt="" />
          </div>
        )}
        <div
          key={panelKey}
          className={`image-card ${animClass}`}
          style={{ aspectRatio: cur.ratio }}
        >
          {useXHalves ? (<>
            <div className="card-half card-half--top" aria-hidden="true">
              <div className="half-front">
                <img src={cur.image} alt="" className="panel-img" />
              </div>
              <div className="half-side" />
            </div>
            <div className="card-half card-half--bottom">
              <div className="half-front">
                <img src={cur.image} alt={cur.title} className="panel-img" />
              </div>
              <div className="half-side" />
            </div>
          </>) : (<>
            <div className="card-half card-half--left" aria-hidden="true">
              <div className="half-front">
                <img src={cur.image} alt="" className="panel-img" />
              </div>
              <div className="half-side" />
            </div>
            <div className="card-half card-half--right">
              <div className="half-front">
                <img src={cur.image} alt={cur.title} className="panel-img" />
              </div>
              <div className="half-side" />
            </div>
          </>)}

        </div>
      </div>

      <div className="section-inner">
        <div className="dot-nav">
          {PANELS.map((p, i) => (
            <button
              key={i}
              className={`dot ${i === panel ? 'active' : ''} ${i < panel ? 'past' : ''}`}
              style={i === panel ? { background: cur.accent } : {}}
              onClick={() => {
                if (i === panel || leaving) return
                const { exitClass, enterClass } = getTransitionClasses(panel, i)
                exitClassRef.current = exitClass
                enterClassRef.current = enterClass
                setNextPanelIdx(i)
                setLeaving(true)
                setTimeout(() => {
                  setPanel(i)
                  setPanelKey(k => k + 1)
                  setLeaving(false)
                  setNextPanelIdx(null)
                }, i > panel ? 700 : 320)
              }}
              aria-label={`Panel ${i + 1}`}
            />
          ))}
        </div>

        <div className="arrow-controls">
          <button
            className="arrow-btn"
            onClick={() => go('prev')}
            disabled={panel === 0 || leaving}
            style={{ borderColor: panel === 0 ? '#333' : cur.accent, color: panel === 0 ? '#444' : cur.accent }}
            aria-label="Nakaraang larawan"
          >
            ‹
          </button>
          <span className="panel-counter" style={{ color: cur.accent }}>
            {panel + 1} / {total}
          </span>
          <button
            className="arrow-btn"
            onClick={() => go('next')}
            disabled={panel === total - 1 || leaving}
            style={{ borderColor: panel === total - 1 ? '#333' : cur.accent, color: panel === total - 1 ? '#444' : cur.accent }}
            aria-label="Susunod na larawan"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState('home')

  return phase === 'home'
    ? <HomeScreen onStart={() => setPhase('journey')} />
    : <PanelSection />
}
