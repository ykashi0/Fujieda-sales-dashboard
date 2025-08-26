// services/geminiService.ts
import type { DashboardData } from '../types';

// ★ AIアドバイス用 GAS の WebアプリURL
const GEMINI_URL = 'https://script.google.com/macros/s/AKfycbwJCGZ8Su4Whg2zJc4oIzyOHYO0XcNQw1ykhh-2vcc5vxVTERwTt0btAKMpRm0UpVc5PA/exec';

export async function getAIAdvice(
  metrics: DashboardData['individualMetrics'],
  periodProgress: DashboardData['periodProgress'],
  dailyRanking: DashboardData['dailySalesRanking'],
  storeName?: string
): Promise<string[]> {
  try {
    const payload = { metrics, periodProgress, dailyRanking, storeName };

    // 🚨 GET リクエストに変更！
    const url = `${GEMINI_URL}?data=${encodeURIComponent(JSON.stringify(payload))}`;
    const res = await fetch(url, { method: 'GET' });

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
