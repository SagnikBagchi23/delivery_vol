export type RangeKey = 'daily' | 'weekly' | 'monthly';

export interface BarPoint {
  label: string;
  total: number; // traded volume (absolute units, for bar height scaling)
  delivery: number; // delivery volume (absolute units)
  totalDisplay: string;
  deliveryDisplay: string;
  percentDisplay: string;
  periodLabel: string; // header label shown when this bar is drilled into
}

export interface RangeData {
  eyebrow: string;
  totalDisplay: string;
  deliveryDisplay: string;
  percentDisplay: string;
  footer: string;
  insight: string | null;
  bars: BarPoint[];
}

export const RANGE_DATA: Record<RangeKey, RangeData> = {
  daily: {
    eyebrow: 'LAST 5 TRADING DAYS',
    totalDisplay: '1,45,32,890',
    deliveryDisplay: '58,45,200',
    percentDisplay: '40.22%',
    footer: '*As of 31 Jul 2025',
    insight: 'Delivery volume rising for 3 days',
    bars: [
      { label: '25 Jul', total: 88, delivery: 27, totalDisplay: '21,85,400', deliveryDisplay: '6,52,200', percentDisplay: '29.84%', periodLabel: '25 Jul, 2025' },
      { label: '28 Jul', total: 95, delivery: 32, totalDisplay: '24,10,300', deliveryDisplay: '7,71,300', percentDisplay: '32.00%', periodLabel: '28 Jul, 2025' },
      { label: '29 Jul', total: 78, delivery: 24, totalDisplay: '19,60,800', deliveryDisplay: '5,45,200', percentDisplay: '27.81%', periodLabel: '29 Jul, 2025' },
      { label: '30 Jul', total: 80, delivery: 26, totalDisplay: '20,55,600', deliveryDisplay: '6,68,300', percentDisplay: '32.51%', periodLabel: '30 Jul, 2025' },
      { label: '31 Jul', total: 100, delivery: 36, totalDisplay: '26,80,600', deliveryDisplay: '9,15,600', percentDisplay: '34.15%', periodLabel: '31 Jul, 2025' },
    ],
  },
  weekly: {
    eyebrow: 'LAST 5 WEEKS',
    totalDisplay: '6,80,42,300',
    deliveryDisplay: '2,54,10,900',
    percentDisplay: '37.35%',
    footer: '*As of 31 Jul 2025',
    insight: 'Delivery volume rising for 3 weeks',
    bars: [
      { label: '3 Jul', total: 88, delivery: 27, totalDisplay: '1,16,40,200', deliveryDisplay: '38,50,100', percentDisplay: '33.08%', periodLabel: '28 Jun-3 Jul, 2025' },
      { label: '10 Jul', total: 82, delivery: 26, totalDisplay: '1,08,60,700', deliveryDisplay: '36,50,100', percentDisplay: '33.62%', periodLabel: '4-10 Jul, 2025' },
      { label: '17 Jul', total: 75, delivery: 24, totalDisplay: '99,40,800', deliveryDisplay: '32,10,450', percentDisplay: '32.30%', periodLabel: '11-17 Jul, 2025' },
      { label: '24 Jul', total: 98, delivery: 34, totalDisplay: '1,29,90,300', deliveryDisplay: '45,60,500', percentDisplay: '35.11%', periodLabel: '18-24 Jul, 2025' },
      { label: '31 Jul', total: 120, delivery: 44, totalDisplay: '1,58,30,100', deliveryDisplay: '58,70,900', percentDisplay: '37.08%', periodLabel: '25-31 Jul, 2025' },
    ],
  },
  monthly: {
    eyebrow: 'LAST 5 MONTHS',
    totalDisplay: '35,42,18,900',
    deliveryDisplay: '9,85,40,200',
    percentDisplay: '27.82%',
    footer: '*As of 1 Aug 2025',
    insight: 'Delivery volume rising for 3 months',
    bars: [
      { label: 'Apr', total: 100, delivery: 30, totalDisplay: '6,45,10,200', deliveryDisplay: '1,68,30,100', percentDisplay: '26.09%', periodLabel: 'Apr 2025' },
      { label: 'May', total: 90, delivery: 28, totalDisplay: '5,90,45,600', deliveryDisplay: '1,55,20,300', percentDisplay: '26.29%', periodLabel: 'May 2025' },
      { label: 'Jun', total: 75, delivery: 22, totalDisplay: '6,80,25,400', deliveryDisplay: '1,95,10,300', percentDisplay: '28.68%', periodLabel: 'Jun 2025' },
      { label: 'Jul', total: 98, delivery: 32, totalDisplay: '7,50,80,700', deliveryDisplay: '2,10,60,400', percentDisplay: '28.06%', periodLabel: 'Jul 2025' },
      { label: 'Aug*', total: 120, delivery: 42, totalDisplay: '8,75,56,900', deliveryDisplay: '2,56,19,100', percentDisplay: '29.26%', periodLabel: 'Aug 2025' },
    ],
  },
};
