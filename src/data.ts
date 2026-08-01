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
  insights: string[];
  bars: BarPoint[];
}

export const RANGE_DATA: Record<RangeKey, RangeData> = {
  daily: {
    eyebrow: 'LAST 5 DAYS',
    totalDisplay: '12,82,38,608',
    deliveryDisplay: '6,32,29,991',
    percentDisplay: '49.31%',
    insights: ['Delivery percentage lowest in 5 days — day driven by traders, not investors.'],
    bars: [
      { label: '27 Jul', total: 243, delivery: 113, totalDisplay: '2,73,11,115', deliveryDisplay: '1,28,04,640', percentDisplay: '46.88%', periodLabel: '27 Jul, 2025' },
      { label: '28 Jul', total: 167, delivery: 90, totalDisplay: '1,87,69,367', deliveryDisplay: '1,01,98,386', percentDisplay: '54.34%', periodLabel: '28 Jul, 2025' },
      { label: '29 Jul', total: 307, delivery: 163, totalDisplay: '3,45,04,165', deliveryDisplay: '1,84,70,410', percentDisplay: '53.53%', periodLabel: '29 Jul, 2025' },
      { label: '30 Jul', total: 219, delivery: 114, totalDisplay: '2,46,13,721', deliveryDisplay: '1,29,17,955', percentDisplay: '52.48%', periodLabel: '30 Jul, 2025' },
      { label: '31 Jul', total: 205, delivery: 78, totalDisplay: '2,30,40,241', deliveryDisplay: '88,38,601', percentDisplay: '38.36%', periodLabel: '31 Jul, 2025' },
    ],
  },
  weekly: {
    eyebrow: 'LAST 5 WEEKS',
    totalDisplay: '88,22,89,909',
    deliveryDisplay: '36,95,33,504',
    percentDisplay: '41.88%',
    insights: [
      'Delivery percentage rising 3 weeks in a row, signalling improving participation quality across higher timeframes.',
      'Delivery percentage well above 5-week avg showing unusually high participation vs baseline serving as a good filter on breakouts/breakdowns',
    ],
    bars: [
      { label: '05 Jul', total: 125, delivery: 62, totalDisplay: '15,82,29,898', deliveryDisplay: '7,90,03,715', percentDisplay: '49.93%', periodLabel: '29 Jun-5 Jul, 2025' },
      { label: '12 Jul', total: 94, delivery: 45, totalDisplay: '11,89,88,883', deliveryDisplay: '5,73,41,406', percentDisplay: '48.19%', periodLabel: '6-12 Jul, 2025' },
      { label: '19 Jul', total: 297, delivery: 97, totalDisplay: '37,59,54,237', deliveryDisplay: '12,36,02,586', percentDisplay: '32.88%', periodLabel: '13-19 Jul, 2025' },
      { label: '26 Jul', total: 81, delivery: 37, totalDisplay: '10,25,32,974', deliveryDisplay: '4,71,47,378', percentDisplay: '45.98%', periodLabel: '20-26 Jul, 2025' },
      { label: '31 Jul', total: 100, delivery: 49, totalDisplay: '12,65,83,918', deliveryDisplay: '6,24,38,420', percentDisplay: '49.33%', periodLabel: '27-31 Jul, 2025' },
    ],
  },
  monthly: {
    eyebrow: 'LAST 5 MONTHS',
    totalDisplay: '4,71,26,18,522',
    deliveryDisplay: '1,81,04,97,885',
    percentDisplay: '38.42%',
    insights: [
      'Delivery percentage well above 5-month avg showing unusually high participation vs baseline serving as a good filter on breakouts/breakdowns.',
      'Monthly delivery share at 5-month high.',
    ],
    bars: [
      { label: 'Mar', total: 82, delivery: 28, totalDisplay: '38,68,21,540', deliveryDisplay: '13,37,57,100', percentDisplay: '34.58%', periodLabel: 'Mar 2025' },
      { label: 'Apr', total: 298, delivery: 61, totalDisplay: '1,40,57,66,086', deliveryDisplay: '29,13,99,396', percentDisplay: '20.73%', periodLabel: 'Apr 2025' },
      { label: 'May', total: 259, delivery: 130, totalDisplay: '1,22,17,89,987', deliveryDisplay: '62,10,15,106', percentDisplay: '50.83%', periodLabel: 'May 2025' },
      { label: 'Jun', total: 194, delivery: 94, totalDisplay: '91,51,63,156', deliveryDisplay: '44,90,41,692', percentDisplay: '49.07%', periodLabel: 'Jun 2025' },
      { label: 'Jul', total: 166, delivery: 66, totalDisplay: '78,30,77,752', deliveryDisplay: '31,52,84,592', percentDisplay: '40.26%', periodLabel: 'Jul 2025' },
    ],
  },
};
