// components/AIAdvice.tsx
import React, { useEffect, useState } from 'react';
import type { DashboardData } from '../types';
import { getAIAdvice } from '../services/geminiService';

type Props = {
  title: string;
  icon?: React.ReactNode;
  metrics: DashboardData['individualMetrics'];
  periodProgress: DashboardData['periodProgress'];
  dailyRanking: DashboardData['dailySalesRanking'];
  className?: string;
  storeName?: string; // 任意
};

export default function AIAdvice({ title, icon, metrics, periodProgress, dailyRanking, className, storeName }: Props) {
  const [advice, setAdvice] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const a = await getAIAdvice(metrics, periodProgress, dailyRanking, storeName);
        if (!cancelled) setAdvice(a);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? 'AIアドバイスの取得に失敗しました');
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [metrics, periodProgress, dailyRanking, storeName]);

  return (
    <div className={`bg-slate-800/60 border border-slate-700 rounded-2xl p-4 lg:p-6 ${className || ''}`}>
      <div className="flex items-center gap-3 mb-4">
        {icon}<h2 className="text-xl font-bold text-slate-100">{title}</h2>
      </div>
      {loading && <p className="text-slate-400">AIが分析中…</p>}
      {err && <p className="text-red-400">エラー: {err}</p>}
      {!loading && !err && advice.length === 0 && <p className="text-slate-400">表示できるアドバイスがありません。</p>}
      <ul className="list-disc list-inside space-y-2 text-slate-100">
        {advice.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
