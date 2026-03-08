"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { WorkoutLog } from "@/hooks/use-progress";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, isSameDay, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

interface MonthlyHeatmapProps {
  logs: WorkoutLog[];
  monthsToShow?: number;
}

export function MonthlyHeatmap({ logs, monthsToShow = 12 }: MonthlyHeatmapProps) {
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close tooltip on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveCell(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Calculate daily volume
  const dailyVolume = useMemo(() => {
    const volumeMap = new Map<string, number>();
    logs.forEach(log => {
      // log.date is an ISO string like "2026-03-08T12:00:00.000Z"
      const dateKey = format(parseISO(log.date), "yyyy-MM-dd");
      const currentVolume = volumeMap.get(dateKey) || 0;
      // Volume = total reps
      const logVolume = log.sets.reduce((sum, reps) => sum + reps, 0);
      volumeMap.set(dateKey, currentVolume + logVolume);
    });
    return volumeMap;
  }, [logs]);

  // Find max volume to calculate intensity levels
  const maxVolume = useMemo(() => {
    let max = 0;
    dailyVolume.forEach(vol => {
      if (vol > max) max = vol;
    });
    return max;
  }, [dailyVolume]);

  const getIntensityClass = (volume: number) => {
    if (volume === 0) return "bg-zinc-800/50 border-zinc-800"; // Empty day
    if (maxVolume === 0) return "bg-primary-500 border-primary-600"; // Fallback
    
    const ratio = volume / maxVolume;
    if (ratio <= 0.25) return "bg-primary-900 border-primary-800";
    if (ratio <= 0.5) return "bg-primary-700 border-primary-600";
    if (ratio <= 0.75) return "bg-primary-500 border-primary-400";
    return "bg-primary-400 border-primary-300";
  };

  // Generate months
  const months = useMemo(() => {
    const today = new Date();
    const result = [];
    for (let i = 0; i < monthsToShow; i++) {
      const monthDate = subMonths(today, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const days = eachDayOfInterval({ start, end });
      
      // Pad beginning of month to align with weekday (Mon-Sun)
      const firstDayOfWeek = getDay(start); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const emptyDaysCount = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      const emptyDays = Array(emptyDaysCount).fill(null);

      result.push({
        date: monthDate,
        days: [...emptyDays, ...days],
      });
    }
    return result;
  }, [monthsToShow]);

  return (
    <div ref={containerRef} className="space-y-6 pb-10">
      {months.map((month, index) => (
        <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-zinc-200 font-medium mb-4">
            {format(month.date, "yyyy年 M月", { locale: zhCN })}
          </h3>
          
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {['一', '二', '三', '四', '五', '六', '日'].map(day => (
              <div key={day} className="text-center text-xs text-zinc-500 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {month.days.map((day, dayIndex) => {
              if (!day) {
                return <div key={`empty-${dayIndex}`} className="aspect-square rounded-sm" />;
              }

              const dateKey = format(day, "yyyy-MM-dd");
              const volume = dailyVolume.get(dateKey) || 0;
              const isToday = isSameDay(day, new Date());
              const isActive = activeCell === dateKey;

              return (
                <div
                  key={dateKey}
                  onMouseEnter={() => setActiveCell(dateKey)}
                  onMouseLeave={() => setActiveCell(null)}
                  onTouchStart={() => setActiveCell(dateKey)}
                  className={`aspect-square rounded-[4px] border ${getIntensityClass(volume)} transition-all relative cursor-pointer ${
                    isActive 
                      ? 'z-50 ring-2 ring-zinc-400 ring-offset-1 ring-offset-zinc-900 scale-110' 
                      : isToday 
                        ? 'z-10 ring-2 ring-zinc-600 ring-offset-1 ring-offset-zinc-900 hover:ring-zinc-500' 
                        : 'hover:ring-2 hover:ring-zinc-500 hover:ring-offset-1 hover:ring-offset-zinc-900'
                  }`}
                >
                  {/* Tooltip */}
                  {isActive && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-zinc-800 text-zinc-200 text-xs px-2.5 py-1.5 rounded-md shadow-xl pointer-events-none border border-zinc-700/50 flex flex-col items-center animate-in fade-in zoom-in-95 duration-100">
                      <span className="font-medium text-zinc-100 mb-0.5">{format(day, "yyyy年M月d日")}</span>
                      <span className="text-zinc-400">{volume > 0 ? `完成 ${volume} 次` : '无训练'}</span>
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-700/50" />
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-zinc-800 -mt-[1px]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
