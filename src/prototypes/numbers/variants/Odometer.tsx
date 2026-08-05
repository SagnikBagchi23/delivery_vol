import { useEffect, useRef, type CSSProperties } from 'react';
import { NumberStage, PercentRow, StatRow, parseNum, useNumberDemo } from '../shared';

const STAGGER_MS = 22;

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

function OdometerValue({ value, className }: { value: string; className: string }) {
  const direction = useDirection(value);
  const chars = value.split('');

  return (
    <span className={`${className} proto-odo-value`} key={value}>
      {chars.map((ch, i) => {
        // Stagger from the rightmost (units/least-significant) column outward.
        const delay = (chars.length - 1 - i) * STAGGER_MS;
        const isDigit = /[0-9]/.test(ch);
        const modifier = direction === 'flat' ? 'fade' : isDigit ? direction : 'fade';
        return (
          <span
            className="proto-odo-col"
            key={`${value}-${i}`}
            style={{ '--proto-odo-delay': `${delay}ms` } as CSSProperties}
          >
            <span className={`proto-odo-digit proto-odo-digit--${modifier}`}>{ch}</span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * Variant B — Odometer
 * Axis: per-digit staggered roll, mechanical-counter feel. Each digit
 * rolls in on its own, staggered outward from the units place, direction
 * matched to the value's overall delta; punctuation just fades (rolling
 * a comma reads as broken). Most literal "the numbers are counting" feel,
 * but it's the busiest of the three and only worth it if the numbers are
 * a hero element users watch tick, not a glanced-at stat.
 */
export default function Odometer() {
  const { snapshot, next } = useNumberDemo();
  return (
    <NumberStage onNext={next}>
      <StatRow
        dotClass="dv-dot--total"
        label="Total traded volume"
        value={<OdometerValue className="dv-stat-value body-base-heavy" value={snapshot.total} />}
      />
      <StatRow
        dotClass="dv-dot--delivery"
        label="Delivery volume"
        value={<OdometerValue className="dv-stat-value body-base-heavy" value={snapshot.delivery} />}
      />
      <div className="dv-divider" />
      <PercentRow
        value={
          <OdometerValue
            className="dv-stat-value dv-stat-value--large body-large-heavy"
            value={snapshot.percent}
          />
        }
      />
    </NumberStage>
  );
}
