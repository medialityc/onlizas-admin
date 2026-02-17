import React from "react";

type Card = {
  title: string;
  value: string | number;
  subtitle?: string;
};

function Value({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-400">
      {children}
    </div>
  );
}

export default function SummaryCards({ cards }: { cards: Card[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => (
        <div
          key={`${c.title}-${idx}`}
          className="p-4 bg-gradient-to-br from-white/80 to-gray-50/60 dark:from-gray-900/80 dark:to-gray-800/70 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {c.title}
              </div>
              <Value>{c.value}</Value>
              {c.subtitle && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {c.subtitle}
                </div>
              )}
            </div>
            <div className="ml-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-sm">
                {/* placeholder icon: first letter */}
                <span className="font-semibold">{c.title.charAt(0)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
