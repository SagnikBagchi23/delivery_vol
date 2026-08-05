import { useState, type ReactNode } from 'react';
import '../../widget.css';

export interface Snapshot {
  total: string;
  delivery: string;
  percent: string;
}

// A sequence of realistic value sets with mixed up/down deltas so every
// variant can be exercised in both directions by repeatedly hitting "next".
export const SNAPSHOTS: Snapshot[] = [
  { total: '88,22,89,909', delivery: '36,95,33,504', percent: '41.88%' },
  { total: '1,25,82,38,608', delivery: '63,29,91,120', percent: '50.31%' },
  { total: '37,59,54,237', delivery: '12,36,02,586', percent: '32.88%' },
  { total: '10,25,32,974', delivery: '4,71,47,378', percent: '45.98%' },
  { total: '4,71,26,18,522', delivery: '1,81,04,97,885', percent: '38.42%' },
  { total: '78,30,77,752', delivery: '31,52,84,592', percent: '40.26%' },
];

export function parseNum(display: string) {
  return parseFloat(display.replace(/[^0-9.-]/g, ''));
}

export function useNumberDemo() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % SNAPSHOTS.length);
  return { snapshot: SNAPSHOTS[index], next };
}

export function NumberStage({ onNext, children }: { onNext: () => void; children: ReactNode }) {
  return (
    <div className="dv-page">
      <div className="proto-device">
        <div className="proto-device__statusbar">
          <span className="proto-device__time">9:41</span>
          <div className="proto-device__icons">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
              <rect x="0.5" y="0.5" width="15" height="9" rx="2" stroke="currentColor" />
              <rect x="16.5" y="3" width="1.5" height="4" rx="0.75" fill="currentColor" />
              <rect x="2" y="2" width="12" height="6" rx="1" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className="dv-card dv-card--numbers-only">
          <div className="dv-card__body">{children}</div>
        </div>
        <div className="proto-device__home" aria-hidden="true" />
      </div>
      <button type="button" className="proto-num-next" onClick={onNext}>
        Shuffle values →
      </button>
    </div>
  );
}

export function StatRow({ dotClass, label, value }: { dotClass: string; label: string; value: ReactNode }) {
  return (
    <div className="dv-stat-row">
      <span className="dv-stat-label body-base">
        <span className={`dv-dot ${dotClass}`} />
        {label}
      </span>
      {value}
    </div>
  );
}

export function PercentRow({ value }: { value: ReactNode }) {
  return (
    <div className="dv-stat-row dv-stat-row--percent">
      <span className="dv-stat-label dv-stat-label--large body-large">Delivery percentage</span>
      {value}
    </div>
  );
}
