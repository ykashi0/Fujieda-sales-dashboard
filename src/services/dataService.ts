// services/dataService.ts
import type { DashboardData } from '../types';

export type Store = 'yaizu' | 'fujieda';

const DATA_URL =
  'https://script.google.com/macros/s/AKfycbzhQtj_DWZ6y4Pp3qc05K67ryxG_TacR1V7AMOQkS13qYlytfAoR-ByOEXfjYiIVcuV/exec';


// 既存の getMockData() はそのまま残してOK
export const fetchDashboardData = async (store: Store = 'yaizu'): Promise<DashboardData> => {
  try {
    const res = await fetch(`${DATA_URL}?store=${store}`, { redirect: 'follow' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
    const data = await res.json();
    if (!data.periodProgress || !data.individualMetrics || !data.monthlySalesRanking) {
      throw new Error('Unexpected JSON shape');
    }
    return data;
  } catch (e) {
    console.error('Failed to fetch or parse live data. Falling back to mock data.', e);
    return getMockData();
  }
};
