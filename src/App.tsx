import React, { useState, useEffect } from 'react';
import GoalProgress from './components/GoalProgress.tsx';
import IndividualMetrics from './components/IndividualMetrics.tsx';
import SalesRanking from './components/SalesRanking.tsx';
import AIAdvice from './components/AIAdvice.tsx';
import { TargetIcon, ChartBarIcon, UsersIcon, SparklesIcon } from './constants.tsx';
import { fetchDashboardData, type Store } from './services/dataService.ts';
import type { DashboardData } from './types.ts';

const App: React.FC = () => {
  // ★ 追加：店舗 state（初期は焼津にしています。藤枝から始めたければ 'fujieda' に）
  const [store, setStore] = useState<Store>('yaizu');

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // store が変わるたびにデータを取り直す
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      // 初回のみ全画面ローダーを表示
      if (!data) setLoading(true);
      try {
        const dashboardData = await fetchDashboardData(store); // ★ 変更：store を渡す
        if (!cancelled) {
          setData(dashboardData);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError('データの読み込みに失敗しました。');
          console.error(err);
        }
      } finally {
        if (!cancelled && loading) setLoading(false);
      }
    };

    loadData();

    // 5分おきに自動更新。店舗が変わったら新しく張り直す
    const intervalId = setInterval(loadData, 300000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [store]); // ★ 変更：store 依存に

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-slate-400 text-lg">データを読み込んでいます...</span>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-center">
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">エラー</h2>
          <p className="text-slate-300">{error || 'データを表示できませんでした。'}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8 font-sans">
      {/* ★ 追加：右上に軽いバナーで店舗セレクター */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2">
        <span className="text-slate-300 text-sm">店舗</span>
        <select
          className="bg-slate-900 text-slate-100 text-sm rounded-md px-2 py-1 outline-none"
          value={store}
          onChange={(e) => setStore(e.target.value as Store)}
        >
          <option value="yaizu">焼津</option>
          <option value="fujieda">藤枝</option>
        </select>
      </div>

      {error && (
        <div className="absolute top-16 right-4 bg-red-800/80 text-white p-3 rounded-lg shadow-lg z-40">
          <p>データの自動更新に失敗しました。古いデータが表示されている可能性があります。</p>
        </div>
      )}

      <header className="mb-8 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          実績ダッシュボード
        </h1>
        <p className="text-slate-400 mt-2">昨日までの実績サマリー（{store === 'yaizu' ? '焼津' : '藤枝'}）</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-5 auto-rows-min gap-6 lg:gap-8">
        <div className="lg:col-span-3">
          <GoalProgress
            title="本日の目標 & 期間進捗"
            icon={<TargetIcon />}
            dailyTarget={data.dailyTarget}
            periodProgress={data.periodProgress}
          />
        </div>

        <div className="lg:col-span-2 lg:row-span-3">
          <IndividualMetrics
            title="個別数値"
            icon={<ChartBarIcon />}
            data={data.individualMetrics}
            className="h-full"
          />
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <SalesRanking title="月間ランキング" icon={<UsersIcon />} data={data.monthlySalesRanking} />
          <SalesRanking title="Dailyランキング" icon={<UsersIcon />} data={data.dailySalesRanking} />
        </div>

        <div className="lg:col-span-3">
          <AIAdvice
            title="AI アドバイス"
            icon={<SparklesIcon />}
            metrics={data.individualMetrics}
            periodProgress={data.periodProgress}
            dailyRanking={data.dailySalesRanking}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
