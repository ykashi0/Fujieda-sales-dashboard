import React from 'react';

interface Props {
  title: string;
  className?: string;
}

export default function Memo({ title, className }: Props) {
  return (
    <div className={`bg-slate-800/60 border border-slate-700 rounded-2xl p-4 lg:p-6 ${className || ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-slate-100">{title}</h2>
      </div>
      <textarea
        className="w-full h-48 bg-slate-900/40 border border-slate-700 rounded-xl p-2 text-slate-100 placeholder-slate-500 resize-none"
        placeholder="メモを入力..."
      />
    </div>
  );
}
