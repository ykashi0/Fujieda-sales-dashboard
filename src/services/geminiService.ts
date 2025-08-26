// services/geminiService.ts
import type { DashboardData } from '../types';

// ★ AIアドバイス用 GAS の WebアプリURL を入れてください
const GEMINI_URL = 'https://script.google.com/macros/s/AKfycbxvQiOmSNC58WHZUd2HjhfM4uIl_vbfG-qrHZsCwsMHnOBA6IQtet023l4p4aehFVbr7Q/exec';

export async function getAIAdvice(
  metrics: DashboardData['individualMetrics'],
  periodProgress: DashboardData['periodProgress'],
  dailyRanking: DashboardData['dailySalesRanking'],
  storeName?: string // 任意：GASに店名を伝えたい場合
): Promise<string[]> {
  const payload = { metrics, periodProgress, dailyRanking, storeName };
  const url = `${GEMINI_URL}?data=${encodeURIComponent(JSON.stringify(payload))}`;

  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI advice fetch failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const json = await res.json() as { advice?: string[], error?: string, details?: unknown };
  if (json.error) {
    // GAS 側からのエラーをそのままUIに出すのは避け、簡潔な文言に
    throw new Error('AIアドバイスの取得に失敗しました。しばらく経ってから再実行してください。');
  }
  return json.advice ?? [];
}
