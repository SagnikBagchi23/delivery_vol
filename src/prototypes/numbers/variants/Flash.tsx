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

function FlashValue({ value, className }: { value: string; className: string }) {
  const direction = useDirection(value);
  return (
    <span className="proto-flash-wrap">
      {direction !== 'flat' && (
        <span className={`proto-flash-glow proto-flash-glow--${direction}`} key={`${value}-glow`} aria-hidden />
      )}
      <span className={`${className} proto-flash-value`} key={value}>
        {value}
      </span>
    </span>
  );
}

/**
 * Variant C — Flash Crossfade
 * Axis: no positional movement at all. The number crossfades in place
 * (blur-masked per Emil's technique for smoothing a swap) while a soft
 * colored glow flashes behind it and decays over 600ms — green-leaning
 * for up, red-leaning for down. Calmest of the three, reads as "value
 * changed, here's the direction" without anything sliding around dense
 * data UI. Costs a bit of clarity versus Slide since the cue is a color
 * flash rather than motion, which color-blind users may read less easily.
 */
export default function Flash() {
  const { snapshot, next } = useNumberDemo();
  return (
    <NumberStage onNext={next}>
      <StatRow
        dotClass="dv-dot--total"
        label="Total traded volume"
        value={<FlashValue className="dv-stat-value body-base-heavy" value={snapshot.total} />}
      />
      <StatRow
        dotClass="dv-dot--delivery"
        label="Delivery volume"
        value={<FlashValue className="dv-stat-value body-base-heavy" value={snapshot.delivery} />}
      />
      <div className="dv-divider" />
      <PercentRow
        value={
          <FlashValue
            className="dv-stat-value dv-stat-value--large body-large-heavy"
            value={snapshot.percent}
          />
        }
      />
    </NumberStage>
  );
}
