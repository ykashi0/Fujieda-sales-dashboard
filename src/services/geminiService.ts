// services/geminiService.ts
import type { DashboardData } from '../types';

// ★ AIアドバイス用 GAS の WebアプリURL
const GEMINI_URL = 'https://script.google.com/macros/s/AKfycbx6wfgUVqRvH7KjVA5ZvOY1X9XmB-695DPB9atP5oTjQainukPyS7YP4VyBDN-jBTrFkw/exec';

export async function getAIAdvice(
  metrics: DashboardData['individuaMetrics'],
  periodProgress: DashboardData['periodProgress'],
  dailyRanking: DashboardData['dailySalesRanking'],
  storeName?: string
): Promise<string[]> {
  try {
    const payload = { metrics, periodProgress, dailyRanking, storeName };

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: JSON.stringify(payload) })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI advice fetch failed: ${res.status} ${res.statusText} - ${text}`);
    }

    const json = await res.json() as { advice?: string[], error?: string, details?: unknown };

    if (json.error) {
      throw new Error(`AIアドバイスの取得に失敗しました: ${json.error}`);
    }

    return json.advice ?? [];
  } catch (err: any) {
    console.error("getAIAdvice error:", err);
    return [`エラー: ${err.message}`];
  }
}
