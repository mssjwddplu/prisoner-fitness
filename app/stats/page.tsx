"use client";

import { useProgress } from "@/hooks/use-progress";
import { BarChart2, CalendarDays, Download } from "lucide-react";
import { MonthlyHeatmap } from "@/components/monthly-heatmap";
import { exercises } from "@/lib/data";

export default function StatsPage() {
  const { logs, isLoaded } = useProgress();

  if (!isLoaded) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">加载中...</div>;
  }

  const totalDays = new Set(
    logs.map((log) => {
      try {
        const d = new Date(log.date);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      } catch {
        return log.date.split("T")[0];
      }
    })
  ).size;
  const totalSets = logs.reduce((acc, log) => acc + log.sets.length, 0);
  const totalReps = logs.reduce(
    (acc, log) => acc + log.sets.reduce((sum, set) => sum + set, 0),
    0
  );

  const handleDownloadCSV = () => {
    if (logs.length === 0) return;

    const headers = ["日期", "时间", "训练项目", "等级", "组数", "总次数", "各组详情"];
    
    const rows = logs.map(log => {
      const exerciseName = exercises.find(e => e.id === log.exerciseId)?.name || log.exerciseId;
      const dateObj = new Date(log.date);
      
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;
      
      const totalReps = log.sets.reduce((sum, reps) => sum + reps, 0);
      const setsDetail = log.sets.join(' / ');
      
      return [
        dateStr,
        timeStr,
        exerciseName,
        `第${log.level}式`,
        log.sets.length,
        totalReps,
        setsDetail
      ].map(field => `"${field}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    link.setAttribute('download', `囚徒健身_训练记录_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-2 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
              <BarChart2 className="w-8 h-8 text-primary-500" />
              数据统计
            </h1>
            <button
              onClick={handleDownloadCSV}
              disabled={logs.length === 0}
              className="p-2 text-zinc-400 hover:text-primary-500 hover:bg-zinc-900 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="下载训练记录"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
          <p className="text-zinc-400">你的汗水，数据看得见。</p>
        </header>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <p className="text-zinc-500 text-sm mb-1">总天数</p>
            <p className="text-2xl font-bold text-primary-500">{totalDays}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <p className="text-zinc-500 text-sm mb-1">总组数</p>
            <p className="text-2xl font-bold text-primary-500">{totalSets}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <p className="text-zinc-500 text-sm mb-1">总次数</p>
            <p className="text-2xl font-bold text-primary-500">{totalReps}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-zinc-400" />
            训练热力图
          </h2>
          <MonthlyHeatmap logs={logs} monthsToShow={12} />
        </div>
      </div>
    </main>
  );
}
