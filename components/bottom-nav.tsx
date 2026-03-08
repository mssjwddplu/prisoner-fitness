"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, BarChart2 } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  if (pathname?.startsWith('/exercise/')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-50 h-16">
      <div className="flex items-center justify-around h-full max-w-2xl mx-auto px-4">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            pathname === "/" ? "text-primary-500" : "text-zinc-500 hover:text-zinc-400"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">训练</span>
        </Link>
        <Link
          href="/history"
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            pathname === "/history" ? "text-primary-500" : "text-zinc-500 hover:text-zinc-400"
          }`}
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-medium">历史</span>
        </Link>
        <Link
          href="/stats"
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            pathname === "/stats" ? "text-primary-500" : "text-zinc-500 hover:text-zinc-400"
          }`}
        >
          <BarChart2 className="w-6 h-6" />
          <span className="text-[10px] font-medium">统计</span>
        </Link>
      </div>
    </div>
  );
}
