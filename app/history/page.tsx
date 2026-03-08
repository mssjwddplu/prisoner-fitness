"use client";

import { useProgress } from "@/hooks/use-progress";
import { exercises } from "@/lib/data";
import { History, Calendar } from "lucide-react";

export default function HistoryPage() {
  const { logs, isLoaded } = useProgress();

  if (!isLoaded) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">加载中...</div>;
  }

  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-2 pt-8 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
            <History className="w-8 h-8 text-primary-500" />
            训练历史
          </h1>
          <p className="text-zinc-400">回顾你的每一次努力。</p>
        </header>

        {sortedLogs.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <Calendar className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400">暂无训练记录，开始你的第一次训练吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedLogs.map((log) => {
              const exercise = exercises.find((e) => e.id === log.exerciseId);
              const step = exercise?.steps.find((s) => s.level === log.level);

              return (
                <div key={log.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-zinc-100">{exercise?.name}</h3>
                      <span className="text-xs font-medium text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full">
                        第 {log.level} 式
                      </span>
                    </div>
                    <span className="text-sm text-zinc-500">
                      {new Date(log.date).toLocaleDateString("zh-CN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-zinc-300 mb-3">{step?.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {log.sets.map((set, i) => (
                      <div key={i} className="bg-zinc-800 px-3 py-1.5 rounded-lg text-sm">
                        <span className="text-zinc-400 mr-1">组 {i + 1}:</span>
                        <span className="font-medium text-zinc-200">{set} 次</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
