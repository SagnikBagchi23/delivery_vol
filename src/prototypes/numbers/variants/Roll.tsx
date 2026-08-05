import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { NumberStage, PercentRow, StatRow, parseNum, useNumberDemo } from '../shared';

const STAGGER_MS = 10;
const BASE_DURATION_MS = 140;
const MS_PER_STEP = 8;
const MAX_DURATION_MS = 200;

function useDirection(display: string) {
  const prevRef = useRef<number | null>(null);
  const numeric = parseNum(display);
  const prev = prevRef.current;

  useEffect(() => {
    prevRef.current = numeric;
  });

  if (prev === null || numeric === prev) return 'flat';
  return numeric > prev ? 'up' : 'down';
}

// Builds the run of digits a wheel passes through going from oldDigit to
// newDigit, always moving in the overall value's direction (e.g. if the
// value went down, every digit rolls downward too — 4 -> 3 is a direct
// one-step roll down, not a lap up through 5..9..0..1..2..3). Wraps at
// 0/9 only when the direction forces it. Returns null when there's
// nothing to roll.
function buildDigitRun(oldChar: string | undefined, newChar: string, direction: 'up' | 'down' | 'flat') {
  if (!oldChar || !/[0-9]/.test(oldChar) || !/[0-9]/.test(newChar)) return null;
  if (oldChar === newChar || direction === 'flat') return null;

  const start = parseInt(oldChar, 10);
  const end = parseInt(newChar, 10);
  const run = [start];
  let cur = start;
  const step = direction === 'up' ? 1 : -1;
  while (cur !== end) {
    cur = (cur + step + 10) % 10;
    run.push(cur);
  }
  return run;
}

function RollColumn({
  oldChar,
  newChar,
  direction,
  delay,
}: {
  oldChar: string | undefined;
  newChar: string;
  direction: 'up' | 'down' | 'flat';
  delay: number;
}) {
  const run = useMemo(() => buildDigitRun(oldChar, newChar, direction), [oldChar, newChar, direction]);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!run) return;
    setSettled(false);
    const raf = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(raf);
  }, [run]);

  if (!run) {
    return <span className="proto-roll-col proto-roll-col--static">{newChar}</span>;
  }

  const steps = run.length - 1;
  const duration = Math.min(MAX_DURATION_MS, BASE_DURATION_MS + steps * MS_PER_STEP);

  return (
    <span className="proto-roll-col">
      <span
        className="proto-roll-strip"
        style={
          {
            transform: `translateY(${settled ? -steps * 1.2 : 0}em)`,
            transitionDuration: `${duration}ms`,
            transitionDelay: `${delay}ms`,
          } as CSSProperties
        }
      >
        {run.map((digit, i) => (
          <span className="proto-roll-digit" key={i}>
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

function RollValue({ value, className }: { value: string; className: string }) {
  const direction = useDirection(value);
  const prevValueRef = useRef<string | null>(null);
  const prevValue = prevValueRef.current;

  useEffect(() => {
    prevValueRef.current = value;
  });

  const chars = value.split('');
  const prevChars = prevValue ? prevValue.split('') : [];

  return (
    <span className={`${className} proto-roll-value`} key={value}>
      {chars.map((ch, i) => {
        const fromRight = chars.length - 1 - i;
        const prevCh = prevChars[prevChars.length - 1 - fromRight];
        return (
          <RollColumn
            key={i}
            oldChar={prevCh}
            newChar={ch}
            direction={direction}
            delay={fromRight * STAGGER_MS}
          />
        );
      })}
    </span>
  );
}

/**
 * Variant D — Rolling Counter
 * Axis: each digit is a wheel that physically scrolls through every
 * intermediate value on its way to the new one (8 -> 9 -> 0 -> 1),
 * like a mechanical odometer or slot-machine reel. Staggered from the
 * units place outward so the roll reads left-to-right as it settles.
 * Heavier and more literal than the fade-based Odometer variant —
 * best reserved for a hero counter the user is meant to watch tick,
 * not a glanced-at stat.
 */
export default function Roll() {
  const { snapshot, next } = useNumberDemo();
  return (
    <NumberStage onNext={next}>
      <StatRow
        dotClass="dv-dot--total"
        label="Total traded volume"
        value={<RollValue className="dv-stat-value body-base-heavy" value={snapshot.total} />}
      />
      <StatRow
        dotClass="dv-dot--delivery"
        label="Delivery volume"
        value={<RollValue className="dv-stat-value body-base-heavy" value={snapshot.delivery} />}
      />
      <div className="dv-divider" />
      <PercentRow
        value={
          <RollValue
            className="dv-stat-value dv-stat-value--large body-large-heavy"
            value={snapshot.percent}
          />
        }
      />
    </NumberStage>
  );
}
