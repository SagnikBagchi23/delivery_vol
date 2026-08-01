import { useMemo, useState, type MouseEvent } from 'react';
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

  const data = RANGE_DATA[range];

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
  const showInsight = !selected && data.insight;

  return (
    <div className="dv-page">
      <div className="dv-pill-group" role="tablist" aria-label="Time range">
        {RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            role="tab"
            aria-selected={range === r.key}
            className={`dv-pill ${range === r.key ? 'dv-pill--selected' : ''}`}
            onClick={() => handleRangeChange(r.key)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="dv-card" onClick={handleResetSelection}>
        <div className="dv-card__header">
          <span className="heading-eyebrow dv-eyebrow" data-swap-key={headerLabel}>
            {headerLabel}
          </span>
        </div>

        <div className="dv-card__body">
          <div className="dv-stat-row">
            <span className="dv-stat-label">
              <span className="dv-dot dv-dot--total" />
              Total traded volume
            </span>
            <span className="dv-stat-value" data-swap-key={totalDisplay}>
              {totalDisplay}
            </span>
          </div>
          <div className="dv-stat-row">
            <span className="dv-stat-label">
              <span className="dv-dot dv-dot--delivery" />
              Delivery volume
            </span>
            <span className="dv-stat-value" data-swap-key={deliveryDisplay}>
              {deliveryDisplay}
            </span>
          </div>

          <div className="dv-divider" />

          <div className="dv-stat-row dv-stat-row--percent">
            <span className="dv-stat-label dv-stat-label--large">Delivery percentage</span>
            <span className="dv-stat-value dv-stat-value--large" data-swap-key={percentDisplay}>
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
                    key={bar.label}
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
                    key={bar.label}
                    className={`dv-bar-label body-small ${isDimmed ? 'dv-bar-label--dimmed' : ''}`}
                  >
                    {bar.label}
                  </span>
                );
              })}
            </div>
          </div>

          <span className="dv-footer body-small">{data.footer}</span>
        </div>

        <div className={`dv-insights ${!showInsight ? 'dv-insights--disabled' : ''}`}>
          <span className="dv-insights__icon gh-standard-bulb" aria-hidden />

          <span className="heading-eyebrow dv-insights__label">INSIGHTS</span>
          {showInsight ? (
            <div className="dv-insights__item body-base">
              <span className="dv-insights__number">1</span>
              <span>{data.insight}</span>
            </div>
          ) : (
            <div className="dv-insights__item body-base dv-insights__item--empty">
              <span className="dv-insights__number">—</span>
              <span>No insight for this period</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
