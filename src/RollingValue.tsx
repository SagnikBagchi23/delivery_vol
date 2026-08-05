import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

const STAGGER_MS = 10;
const BASE_DURATION_MS = 140;
const MS_PER_STEP = 8;
const MAX_DURATION_MS = 200;

type Direction = 'up' | 'down' | 'flat';

// Builds the run of digits a wheel passes through going from oldDigit to
// newDigit, always moving in the overall value's direction (e.g. if the
// value went down, every digit rolls downward too — 4 -> 3 is a direct
// one-step roll down, not a lap up through 5..9..0..1..2..3). Wraps at
// 0/9 only when the direction forces it. Returns null when there's
// nothing to roll.
function buildDigitRun(oldChar: string | undefined, newChar: string, direction: Direction) {
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

// Renders one run of digits and drives it from 0 to its target offset. Keyed
// fresh per run by the caller so a new digit change always starts from a
// clean, just-mounted "0" position instead of inheriting whatever transform
// state a previous run left behind — that stale state is what let some
// columns snap straight to the final digit instead of rolling.
function RollStrip({
  run,
  steps,
  duration,
  delay,
}: {
  run: number[];
  steps: number;
  duration: number;
  delay: number;
}) {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    // Double rAF: the first guarantees the initial (unsettled) transform has
    // actually painted before we change it, so the browser has something to
    // transition from instead of collapsing both states into one frame.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setSettled(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <span
      className="dv-roll-strip"
      style={
        {
          transform: `translateY(${settled ? -steps * 1.2 : 0}em)`,
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
        } as CSSProperties
      }
    >
      {run.map((digit, i) => (
        <span className="dv-roll-digit" key={i}>
          {digit}
        </span>
      ))}
    </span>
  );
}

function RollColumn({
  oldChar,
  newChar,
  direction,
  delay,
}: {
  oldChar: string | undefined;
  newChar: string;
  direction: Direction;
  delay: number;
}) {
  const run = useMemo(() => buildDigitRun(oldChar, newChar, direction), [oldChar, newChar, direction]);

  // A fresh generation number per actual digit change, so RollStrip always
  // remounts (rather than reusing an already-settled instance and having to
  // reset its transform mid-flight, which reads as a snap/reverse instead of
  // a roll). Content-equal runs (e.g. two separate "8 -> 9" changes in a row)
  // must still remount, so this can't just key off the run's own values.
  const genRef = useRef(0);
  const lastTargetRef = useRef<string | null>(null);
  if (run && lastTargetRef.current !== newChar) {
    genRef.current += 1;
  }
  lastTargetRef.current = newChar;

  if (!run) {
    return <span className="dv-roll-col dv-roll-col--static">{newChar}</span>;
  }

  const steps = run.length - 1;
  const duration = Math.min(MAX_DURATION_MS, BASE_DURATION_MS + steps * MS_PER_STEP);

  return (
    <span className="dv-roll-col">
      <RollStrip key={genRef.current} run={run} steps={steps} duration={duration} delay={delay} />
    </span>
  );
}

export function RollingValue({
  value,
  direction,
  className,
}: {
  value: string;
  direction: Direction;
  className: string;
}) {
  // Capture the previous value during render (not in an effect). Doing it in
  // an effect races with sibling effects elsewhere in the tree (e.g. the
  // insights fallback effect) that trigger another render right after commit
  // but before paint — by then the effect would've already advanced
  // prevValueRef to the *new* value, making oldChar === newChar and killing
  // the roll before it's ever visible. Mutating the ref during render is
  // safe here because it's idempotent: it only updates when `value` actually
  // changes, so extra re-renders with the same value are no-ops.
  const lastSeenValueRef = useRef<string | null>(null);
  const prevValueRef = useRef<string | null>(null);
  if (lastSeenValueRef.current !== value) {
    prevValueRef.current = lastSeenValueRef.current;
    lastSeenValueRef.current = value;
  }
  const prevValue = prevValueRef.current;

  const chars = value.split('');
  const prevChars = prevValue ? prevValue.split('') : [];

  // Pair digits by place value (counting only digits, right to left) rather
  // than raw character index, so a comma shifting position when the number
  // gains/loses a group (e.g. "8,608" -> "18,522") doesn't break the
  // alignment and leave every digit rolling against a comma.
  const prevDigitsFromRight: string[] = [];
  for (let i = prevChars.length - 1; i >= 0; i -= 1) {
    if (/[0-9]/.test(prevChars[i])) prevDigitsFromRight.push(prevChars[i]);
  }

  let digitIndex = -1;
  const digitFromRightForIndex: (number | null)[] = new Array(chars.length).fill(null);
  for (let i = chars.length - 1; i >= 0; i -= 1) {
    if (/[0-9]/.test(chars[i])) {
      digitIndex += 1;
      digitFromRightForIndex[i] = digitIndex;
    }
  }

  return (
    <span className={`${className} dv-roll-value`}>
      {chars.map((ch, i) => {
        const fromRight = chars.length - 1 - i;
        const digitPos = digitFromRightForIndex[i];
        const prevCh = digitPos === null ? undefined : prevDigitsFromRight[digitPos];
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
