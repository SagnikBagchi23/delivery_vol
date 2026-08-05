import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { RANGE_DATA, type RangeKey } from './data';
import { RollingValue } from './RollingValue';
import './widget.css';

const RANGES: { key: RangeKey; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

const MAX_BAR_HEIGHT = 120;

// "LAST 5 WEEKS" -> { prefix: "LAST 5 ", word: "WEEKS" }
function splitEyebrow(eyebrow: string) {
  const idx = eyebrow.lastIndexOf(' ');
  return { prefix: eyebrow.slice(0, idx + 1), word: eyebrow.slice(idx + 1) };
}

function parseDisplayNumber(display: string) {
  return parseFloat(display.replace(/[^0-9.-]/g, ''));
}

// Tracks whether a formatted numeric string went up, down, or stayed flat
// versus its previous value, so the UI can animate the change directionally.
//
// Updates the "previous" ref during render rather than in an effect. A
// sibling effect elsewhere in the tree (the insights fallback) can trigger a
// second render right after commit but before paint; if the previous value
// were captured in an effect, that second render would see it already
// advanced to the new value, read the change as "flat", and suppress the
// roll animation before it's ever visible. Mutating the ref during render is
// safe because it's idempotent — it only advances when `numeric` changes, so
// extra re-renders with the same value are no-ops.
function useValueDirection(display: string) {
  const numeric = parseDisplayNumber(display);
  const lastSeenRef = useRef<number | null>(null);
  const prevRef = useRef<number | null>(null);
  if (lastSeenRef.current !== numeric) {
    prevRef.current = lastSeenRef.current;
    lastSeenRef.current = numeric;
  }
  const prevNumeric = prevRef.current;

  if (prevNumeric === null || numeric === prevNumeric) return 'flat';
  return numeric > prevNumeric ? 'up' : 'down';
}

export default function DeliveryVolumeWidget() {
  const [range, setRange] = useState<RangeKey>('daily');
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [lastInsights, setLastInsights] = useState<string[]>([]);

  const data = RANGE_DATA[range];

  useEffect(() => {
    if (data.insights.length > 0) setLastInsights(data.insights);
  }, [data.insights]);

  const hasInsights = data.insights.length > 0;
  const insightsToShow = hasInsights ? data.insights : lastInsights;

  const maxValue = useMemo(
    () => Math.max(...data.bars.map((b) => b.total)),
    [data],
  );

  const selected = selectedBar !== null ? data.bars[selectedBar] : null;

  function handleRangeChange(key: RangeKey) {
    setRange(key);
    setSelectedBar(null);
  }

  function handleBarClick(e: MouseEvent, index: number) {
    e.stopPropagation();
    setSelectedBar((prev) => (prev === index ? null : index));
  }

  function handleResetSelection() {
    setSelectedBar(null);
  }

  const headerLabel = selected ? selected.periodLabel : data.eyebrow;
  const totalDisplay = selected ? selected.totalDisplay : data.totalDisplay;
  const deliveryDisplay = selected ? selected.deliveryDisplay : data.deliveryDisplay;
  const percentDisplay = selected ? selected.percentDisplay : data.percentDisplay;
  const dimInsight = selected || !hasInsights;

  const totalDirection = useValueDirection(totalDisplay);
  const deliveryDirection = useValueDirection(deliveryDisplay);
  const percentDirection = useValueDirection(percentDisplay);

  return (
    <div className="dv-page">
      <h2 className="heading-base dv-page-title">Delivery volume percentage</h2>
      <div className="dv-pill-group" role="tablist" aria-label="Time range">
        {RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            role="tab"
            aria-selected={range === r.key}
            className={`dv-pill body-small-heavy ${range === r.key ? 'dv-pill--selected' : ''}`}
            onClick={() => handleRangeChange(r.key)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="dv-card" onClick={handleResetSelection}>
        <div className="dv-card__header">
          {selected ? (
            <span className="heading-eyebrow dv-eyebrow" key={headerLabel}>
              {headerLabel}
            </span>
          ) : (
            (() => {
              const { prefix, word } = splitEyebrow(headerLabel);
              return (
                <span className="heading-eyebrow dv-eyebrow">
                  {prefix}
                  <span className="dv-eyebrow__word" key={word}>
                    {word}
                  </span>
                </span>
              );
            })()
          )}
        </div>

        <div className="dv-card__body">
          <div className="dv-stat-row">
            <span className="dv-stat-label body-base">
              <span className="dv-dot dv-dot--total" />
              Total traded volume
            </span>
            <RollingValue
              className="dv-stat-value body-base-heavy"
              value={totalDisplay}
              direction={totalDirection}
            />
          </div>
          <div className="dv-stat-row">
            <span className="dv-stat-label body-base">
              <span className="dv-dot dv-dot--delivery" />
              Delivery volume
            </span>
            <RollingValue
              className="dv-stat-value body-base-heavy"
              value={deliveryDisplay}
              direction={deliveryDirection}
            />
          </div>

          <div className="dv-divider" />

          <div className="dv-stat-row dv-stat-row--percent">
            <span className="dv-stat-label dv-stat-label--large body-large">Delivery percentage</span>
            <RollingValue
              className="dv-stat-value dv-stat-value--large body-large-heavy"
              value={percentDisplay}
              direction={percentDirection}
            />
          </div>

          <div className="dv-chart dv-chart--fluid">
            <div className="dv-chart-bars">
              {data.bars.map((bar, i) => {
                const isSelected = selectedBar === i;
                const isDimmed = selectedBar !== null && !isSelected;
                const totalHeight = (bar.total / maxValue) * MAX_BAR_HEIGHT;
                const deliveryHeight = (bar.delivery / maxValue) * MAX_BAR_HEIGHT;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`dv-bar-group ${isDimmed ? 'dv-bar-group--dimmed' : ''} ${isSelected ? 'dv-bar-group--selected' : ''}`}
                    onClick={(e) => handleBarClick(e, i)}
                    aria-pressed={isSelected}
                    aria-label={`${bar.label}: ${bar.percentDisplay} delivery`}
                  >
                    <div className="dv-bar-pair" style={{ height: MAX_BAR_HEIGHT }}>
                      <span
                        className="dv-bar dv-bar--total"
                        style={{ height: totalHeight }}
                      />
                      <span
                        className="dv-bar dv-bar--delivery"
                        style={{ height: deliveryHeight }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="dv-chart-labels">
              {data.bars.map((bar, i) => {
                const isDimmed = selectedBar !== null && selectedBar !== i;
                return (
                  <span
                    key={i}
                    className={`dv-bar-label body-small ${isDimmed ? 'dv-bar-label--dimmed' : ''}`}
                  >
                    {bar.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {insightsToShow.length > 0 && (
          <div className="dv-insights-wrap">
            <div className={`dv-insights ${dimInsight ? 'dv-insights--disabled' : ''}`}>
              <span className="dv-insights__icon gh-standard-bulb" aria-hidden />

              <span className="heading-eyebrow dv-insights__label">INSIGHTS</span>
              {insightsToShow.map((text, i) => (
                <div className="dv-insights__item body-base" key={text}>
                  <span className="heading-eyebrow dv-insights__number">{i + 1}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
