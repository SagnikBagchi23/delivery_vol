import { useEffect, useRef } from 'react';
import { NumberStage, PercentRow, StatRow, parseNum, useNumberDemo } from '../shared';

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

function SlideValue({ value, className }: { value: string; className: string }) {
  const direction = useDirection(value);
  return (
    <span className={`${className} proto-slide-value proto-slide-value--${direction}`} key={value}>
      {value}
    </span>
  );
}

/**
 * Variant A — Slide
 * Axis: whole-value directional motion. The formatted string slides
 * in from below on an increase, from above on a decrease — like a
 * stock ticker. Cheapest to build, reads clearly at a glance, but
 * treats the number as one opaque block rather than showing which
 * digits actually changed.
 */
export default function Slide() {
  const { snapshot, next } = useNumberDemo();
  return (
    <NumberStage onNext={next}>
      <StatRow
        dotClass="dv-dot--total"
        label="Total traded volume"
        value={<SlideValue className="dv-stat-value body-base-heavy" value={snapshot.total} />}
      />
      <StatRow
        dotClass="dv-dot--delivery"
        label="Delivery volume"
        value={<SlideValue className="dv-stat-value body-base-heavy" value={snapshot.delivery} />}
      />
      <div className="dv-divider" />
      <PercentRow
        value={
          <SlideValue
            className="dv-stat-value dv-stat-value--large body-large-heavy"
            value={snapshot.percent}
          />
        }
      />
    </NumberStage>
  );
}
