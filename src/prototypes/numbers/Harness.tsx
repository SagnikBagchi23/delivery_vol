import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Slide from './variants/Slide';
import Odometer from './variants/Odometer';
import Flash from './variants/Flash';
import Roll from './variants/Roll';
import './prototype.css';

const VARIANTS = [
  { name: 'Slide', Component: Slide },
  { name: 'Odometer', Component: Odometer },
  { name: 'Flash', Component: Flash },
  { name: 'Roll', Component: Roll },
];

function readInitial() {
  const v = parseInt(new URLSearchParams(location.search).get('v') || '', 10);
  return v >= 1 && v <= VARIANTS.length ? v - 1 : 0;
}

export default function Harness() {
  const [current, setCurrent] = useState(readInitial);
  const [remountKey, setRemountKey] = useState(0);
  const [ready, setReady] = useState(false);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [highlightStyle, setHighlightStyle] = useState<{ width: number; left: number }>({ width: 0, left: 0 });

  function setActive(i: number) {
    if (i < 0 || i >= VARIANTS.length) return;
    setCurrent(i);
    setRemountKey((k) => k + 1);
    const url = new URL(location.href);
    url.searchParams.set('v', String(i + 1));
    history.replaceState(null, '', url);
  }

  useLayoutEffect(() => {
    const el = itemRefs.current[current];
    if (el) setHighlightStyle({ width: el.offsetWidth, left: el.offsetLeft });
  }, [current]);

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  useEffect(() => {
    function onResize() {
      const el = itemRefs.current[current];
      if (el) setHighlightStyle({ width: el.offsetWidth, left: el.offsetLeft });
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [current]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) setActive(num - 1);
      else if (e.key === 'ArrowRight') setActive((current + 1) % VARIANTS.length);
      else if (e.key === 'ArrowLeft') setActive((current - 1 + VARIANTS.length) % VARIANTS.length);
      else if (e.key === 'r' || e.key === 'R') setRemountKey((k) => k + 1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [current]);

  const Active = VARIANTS[current].Component;

  return (
    <div className="proto-harness">
      <div className="proto-stage">
        <Active key={remountKey} />
      </div>

      <nav className="proto-picker" aria-label="Prototype variants" data-ready={ready ? '' : undefined}>
        <div className="proto-picker-segments" role="tablist">
          <span
            className="proto-picker-highlight"
            aria-hidden="true"
            style={{ width: highlightStyle.width, transform: `translateX(${highlightStyle.left}px)` }}
          />
          {VARIANTS.map((v, i) => (
            <button
              key={v.name}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              role="tab"
              className="proto-picker-item"
              data-active={i === current ? '' : undefined}
              aria-current={i === current ? 'true' : undefined}
              aria-selected={i === current}
              onClick={() => setActive(i)}
            >
              {v.name}
            </button>
          ))}
        </div>
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
          onClick={() => setRemountKey((k) => k + 1)}
        >
          ↻
        </button>
      </nav>
    </div>
  );
}
