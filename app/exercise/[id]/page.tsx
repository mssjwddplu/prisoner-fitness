"use client";

import { useState, use } from "react";
import { exercises } from "@/lib/data";
import { useProgress } from "@/hooks/use-progress";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2, History, Plus, Minus, Trash2, Dumbbell, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { currentLevels, logs, setLevel, addLog, deleteLog, isLoaded } = useProgress();
  const exercise = exercises.find((e) => e.id === resolvedParams.id);

  const [sets, setSets] = useState<number[]>([10]); // Default 1 set of 10
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'train' | 'records'>('train');

  if (!isLoaded) return <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">加载中...</div>;
  if (!exercise) return <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">未找到该训练</div>;

  const currentLevel = currentLevels[exercise.id] || 1;
  const currentStep = exercise.steps[currentLevel - 1] || exercise.steps[exercise.steps.length - 1];
  const exerciseLogs = logs.filter((l) => l.exerciseId === exercise.id);
  const currentLevelLogs = exerciseLogs.filter((l) => l.level === currentLevel);

  const handleLevelUp = () => {
    if (currentLevel < 10) setLevel(exercise.id, currentLevel + 1);
  };

  const handleLevelDown = () => {
    if (currentLevel > 1) setLevel(exercise.id, currentLevel - 1);
  };

  const handleAddSet = () => setSets([...sets, 10]);
  const handleRemoveSet = (index: number) => setSets(sets.filter((_, i) => i !== index));
  const handleRepChange = (index: number, delta: number) => {
    const newSets = [...sets];
    newSets[index] = Math.max(1, newSets[index] + delta);
    setSets(newSets);
  };

  const applyStandard = (standardStr: string) => {
    const match = standardStr.match(/(\d+)组，(\d+)次/);
    if (match) {
      const numSets = parseInt(match[1], 10);
      const numReps = parseInt(match[2], 10);
      setSets(Array(numSets).fill(numReps));
    }
  };

  const isStandardActive = (standardStr: string) => {
    const match = standardStr.match(/(\d+)组，(\d+)次/);
    if (!match) return false;
    const numSets = parseInt(match[1], 10);
    const numReps = parseInt(match[2], 10);
    return sets.length === numSets && sets.every((rep) => rep === numReps);
  };

  const handleSaveLog = () => {
    addLog({
      date: new Date().toISOString(),
      exerciseId: exercise.id,
      level: currentLevel,
      sets: [...sets],
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const now = new Date();
  const currentMonthLogs = exerciseLogs.filter(l => {
    const d = new Date(l.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const trainedLevelsCount = new Set(currentMonthLogs.map(l => l.level)).size;
  const totalSets = currentMonthLogs.reduce((acc, l) => acc + (l.sets || []).length, 0);
  const totalReps = currentMonthLogs.reduce((acc, l) => acc + (l.sets || []).reduce((a, b) => a + b, 0), 0);

  const dailyReps: Record<string, number> = {};
  exerciseLogs.forEach(log => {
    const d = new Date(log.date);
    if (isNaN(d.getTime())) return;
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const reps = (log.sets || []).reduce((a, b) => a + b, 0);
    dailyReps[dateStr] = (dailyReps[dateStr] || 0) + reps;
  });

  let oldestDate = now;
  if (exerciseLogs.length > 0) {
    const dates = exerciseLogs
      .map(l => new Date(l.date).getTime())
      .filter(t => !isNaN(t));
    if (dates.length > 0) {
      oldestDate = new Date(Math.min(...dates));
    }
  }

  const monthsToShow = [];
  let y = now.getFullYear();
  let m = now.getMonth();

  const oldestYear = oldestDate.getFullYear();
  const oldestMonth = oldestDate.getMonth();

  const targetDate = new Date(oldestYear, oldestMonth - 2, 1);
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();

  while (y > targetYear || (y === targetYear && m >= targetMonth)) {
    monthsToShow.push({ year: y, month: m });
    m -= 1;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 pb-24 relative">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-zinc-950 px-4 py-2 rounded-full font-medium shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          记录已保存
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-zinc-400 hover:text-zinc-100">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">{exercise.name}</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {activeTab === 'train' ? (
        <div className="max-w-2xl mx-auto p-4 space-y-8">
          {/* Level Selector */}
        <section className="flex items-center justify-between bg-zinc-900 rounded-2xl p-2 border border-zinc-800">
          <button
            onClick={handleLevelDown}
            disabled={currentLevel === 1}
            className="p-3 text-zinc-400 hover:text-zinc-100 disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="text-primary-500 font-medium text-sm mb-1">第 {currentLevel} 式</div>
            <h2 className="text-xl font-bold">{currentStep.name}</h2>
          </div>
          <button
            onClick={handleLevelUp}
            disabled={currentLevel === 10}
            className="p-3 text-zinc-400 hover:text-zinc-100 disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </section>

        {/* Standards */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>训练标准</span>
            <span className="text-xs text-zinc-500 normal-case">点击快速应用</span>
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "初级标准", value: currentStep.standard.beginner },
              { label: "中级标准", value: currentStep.standard.intermediate },
              { label: "升级标准", value: currentStep.standard.progression },
            ].map((std, idx) => {
              const active = isStandardActive(std.value);
              return (
                <button
                  key={idx}
                  onClick={() => applyStandard(std.value)}
                  className={`active:scale-95 transition-all border rounded-xl p-3 text-center flex flex-col justify-center items-center ${
                    active
                      ? "bg-primary-500/10 border-primary-500/50"
                      : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                  }`}
                >
                  <div className={`text-xs mb-1 ${active ? "text-primary-500/80" : "text-zinc-500"}`}>
                    {std.label}
                  </div>
                  <div className={`font-medium text-sm ${active ? "text-primary-500" : "text-zinc-200"}`}>
                    {std.value}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Execution Guide */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">动作指南</h3>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-300 text-sm leading-relaxed">
              {currentStep.execution}
            </p>
          </div>
        </section>

        {/* Key Points */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">动作要点</h3>
          <ul className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            {currentStep.points.map((point, i) => (
              <li key={i} className="flex gap-3 text-zinc-300 text-sm leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Logger */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">记录训练</h3>
            <button onClick={handleAddSet} className="text-sm text-primary-500 font-medium flex items-center gap-1 bg-primary-500/10 px-3 py-1.5 rounded-full active:scale-95 transition-transform">
              <Plus className="w-4 h-4" /> 添加组数
            </button>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2">
            {sets.map((reps, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b border-zinc-800/50 last:border-0">
                <div className="text-zinc-400 font-medium w-12 text-sm">第 {index + 1} 组</div>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleRepChange(index, -1)} className="p-3 bg-zinc-800 rounded-full text-zinc-300 active:scale-95 transition-transform">
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="w-12 text-center font-mono text-2xl font-semibold">{reps}</div>
                  <button onClick={() => handleRepChange(index, 1)} className="p-3 bg-zinc-800 rounded-full text-zinc-300 active:scale-95 transition-transform">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={() => handleRemoveSet(index)} 
                  disabled={sets.length === 1}
                  className="p-3 text-zinc-600 hover:text-red-400 disabled:opacity-0 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <div className="p-3 mt-2">
              <button 
                onClick={handleSaveLog}
                className="w-full bg-primary-500 hover:bg-primary-600 text-zinc-950 font-bold py-4 rounded-xl transition-colors active:scale-[0.98] text-lg shadow-lg shadow-primary-500/20"
              >
                保存记录
              </button>
            </div>
          </div>
        </section>

        {/* History */}
        {currentLevelLogs.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4" /> 历史记录 (第 {currentLevel} 式)
            </h3>
            <div className="space-y-2">
              {currentLevelLogs.map((log) => (
                <div key={log.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between group">
                  <div>
                    <div className="text-sm text-zinc-400 mb-1">
                      {new Date(log.date).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-zinc-200 font-medium">
                      {(log.sets || []).length} 组: {(log.sets || []).join(" / ")} 次
                    </div>
                  </div>
                  <button onClick={() => deleteLog(log.id)} className="p-2 text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      ) : (
        <div className="max-w-2xl mx-auto p-4 space-y-8">
          {/* Stats */}
          <section className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
              <div className="text-zinc-500 text-xs mb-1">本月练式</div>
              <div className="text-2xl font-bold text-zinc-100">{trainedLevelsCount}</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
              <div className="text-zinc-500 text-xs mb-1">本月总组数</div>
              <div className="text-2xl font-bold text-zinc-100">{totalSets}</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
              <div className="text-zinc-500 text-xs mb-1">本月总次数</div>
              <div className="text-2xl font-bold text-zinc-100">{totalReps}</div>
            </div>
          </section>

          {/* Heatmap */}
          <section className="space-y-6">
            {monthsToShow.map(({ year, month }) => {
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const startDay = new Date(year, month, 1).getDay(); // 0 = Sunday
              
              const days = [];
              for (let i = 0; i < startDay; i++) {
                days.push(null);
              }
              for (let i = 1; i <= daysInMonth; i++) {
                days.push(i);
              }

              return (
                <div key={`${year}-${month}`} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <h3 className="text-sm font-medium text-zinc-100 mb-4">
                    {year}年{month + 1}月
                  </h3>
                  <div className="grid grid-cols-7 gap-1.5">
                    {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                      <div key={day} className="text-center text-xs text-zinc-500 mb-2">{day}</div>
                    ))}
                    {days.map((day, idx) => {
                      if (day === null) return <div key={`empty-${idx}`} />;
                      
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const reps = dailyReps[dateStr] || 0;
                      
                      let colorClass = "bg-zinc-800/30 border-zinc-800/50 text-zinc-500";
                      if (reps > 0 && reps <= 20) colorClass = "bg-primary-950 border-primary-900/50 text-primary-500";
                      else if (reps > 20 && reps <= 50) colorClass = "bg-primary-900 border-primary-800/50 text-primary-400";
                      else if (reps > 50 && reps <= 100) colorClass = "bg-primary-700 border-primary-600/50 text-primary-200";
                      else if (reps > 100 && reps <= 200) colorClass = "bg-primary-600 border-primary-500/50 text-primary-100";
                      else if (reps > 200) colorClass = "bg-primary-500 border-primary-400/50 text-white";

                      return (
                        <div 
                          key={day} 
                          className={`aspect-square rounded-md border flex items-center justify-center text-xs font-medium ${colorClass}`}
                        >
                          <span className={reps > 0 ? "opacity-100" : "opacity-30"}>{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 pb-2 pt-2 z-50">
        <div className="max-w-2xl mx-auto flex">
          <button 
            onClick={() => setActiveTab('train')}
            className={`flex-1 py-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'train' ? 'text-primary-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-[10px] font-medium">训练</span>
          </button>
          <button 
            onClick={() => setActiveTab('records')}
            className={`flex-1 py-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'records' ? 'text-primary-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <CalendarDays className="w-6 h-6" />
            <span className="text-[10px] font-medium">记录</span>
          </button>
        </div>
      </div>
    </main>
  );
}
