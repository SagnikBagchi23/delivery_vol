import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { RANGE_DATA, type RangeKey } from './data';
import './widget.css';

const RANGES: { key: RangeKey; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

const MAX_BAR_HEIGHT = 120;

export default function DeliveryVolumeWidget() {
  const [range, setRange] = useState<RangeKey>('weekly');
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

  return (
    <div className="dv-page">
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
          <span className="heading-eyebrow dv-eyebrow" key={headerLabel}>
            {headerLabel}
          </span>
        </div>

        <div className="dv-card__body">
          <div className="dv-stat-row">
            <span className="dv-stat-label body-base">
              <span className="dv-dot dv-dot--total" />
              Total traded volume
            </span>
            <span className="dv-stat-value body-base-heavy" key={totalDisplay}>
              {totalDisplay}
            </span>
          </div>
          <div className="dv-stat-row">
            <span className="dv-stat-label body-base">
              <span className="dv-dot dv-dot--delivery" />
              Delivery volume
            </span>
            <span className="dv-stat-value body-base-heavy" key={deliveryDisplay}>
              {deliveryDisplay}
            </span>
          </div>

          <div className="dv-divider" />

          <div className="dv-stat-row dv-stat-row--percent">
            <span className="dv-stat-label dv-stat-label--large body-large">Delivery percentage</span>
            <span className="dv-stat-value dv-stat-value--large body-large-heavy" key={percentDisplay}>
              {percentDisplay}
            </span>
          </div>

          <div className="dv-chart">
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
                    className={`dv-bar-group ${isDimmed ? 'dv-bar-group--dimmed' : ''}`}
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
