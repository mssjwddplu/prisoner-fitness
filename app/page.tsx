"use client";

import { exercises } from "@/lib/data";
import { useProgress } from "@/hooks/use-progress";
import Link from "next/link";
import { ChevronRight, Dumbbell } from "lucide-react";

export default function Home() {
  const { currentLevels, logs, isLoaded } = useProgress();

  if (!isLoaded) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">加载中...</div>;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-2 pt-8 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-primary-500" />
            囚徒健身
          </h1>
          <p className="text-zinc-400">六艺十式，记录你的每一次蜕变。</p>
        </header>

        <div className="grid gap-4">
          {exercises.map((exercise, index) => {
            const currentLevel = currentLevels[exercise.id] || 1;
            const currentStep = exercise.steps[currentLevel - 1] || exercise.steps[exercise.steps.length - 1];
            const exerciseLogs = logs.filter(
              (l) => l.exerciseId === exercise.id && l.level === currentLevel
            );
            const allExerciseLogs = logs.filter((l) => l.exerciseId === exercise.id);
            const lastLog = allExerciseLogs[0];

            return (
              <div
                key={exercise.id}
              >
                <Link
                  href={`/exercise/${exercise.id}`}
                  className="block bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-800/80 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-zinc-100">
                      {exercise.name}
                    </h2>
                    <div className="flex items-center gap-1 text-primary-500 font-medium bg-primary-500/10 px-2.5 py-1 rounded-full text-sm">
                      第 {currentLevel} 式
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-zinc-400">
                    <div>
                      <p className="text-zinc-300 font-medium mb-1">
                        {currentStep.name}
                      </p>
                      <p className="text-sm">
                        {lastLog
                          ? `上次训练: ${new Date(lastLog.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}`
                          : "尚未开始训练"}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
