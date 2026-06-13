/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface LoadingSkeletonProps {
  type?: "feed" | "card" | "list";
  count?: number;
}

export default function LoadingSkeleton({ type = "card", count = 3 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (type === "feed") {
    return (
      <div className="space-y-4 w-full" id="skeleton-feed-container">
        {items.map((_, i) => (
          <div
            key={i}
            id={`loading-feed-item-${i}`}
            className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 text-xs text-slate-100 flex flex-col gap-4 shadow-md animate-pulse"
          >
            {/* Top Author Row */}
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center w-full">
                <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-slate-800 rounded-md w-1/4" />
                  <div className="h-2.5 bg-slate-800/80 rounded-md w-1/3" />
                </div>
              </div>
              <div className="w-4 h-4 rounded bg-slate-800 shrink-0" />
            </div>

            {/* Post Content Lines */}
            <div className="space-y-2 mt-1">
              <div className="h-3 bg-slate-800 rounded-md w-full" />
              <div className="h-3 bg-slate-800 rounded-md w-5/6" />
              <div className="h-3 bg-slate-800 rounded-md w-4/5" />
            </div>

            {/* Tag Badges */}
            <div className="flex gap-1.5 pt-1">
              <div className="h-4 bg-slate-800 rounded-md w-12" />
              <div className="h-4 bg-slate-800 rounded-md w-16" />
              <div className="h-4 bg-slate-800 rounded-md w-14" />
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex justify-between items-center border-t border-slate-850 pt-3 mt-1">
              <div className="h-3 bg-slate-800 rounded-md w-10" />
              <div className="h-3 bg-slate-800 rounded-md w-12" />
              <div className="h-3 bg-slate-800 rounded-md w-10" />
              <div className="h-3 bg-slate-800 rounded-md w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-3 w-full" id="skeleton-list-container">
        {items.map((_, i) => (
          <div
            key={i}
            id={`loading-list-item-${i}`}
            className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-850 rounded-xl animate-pulse"
          >
            <div className="flex gap-3 items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-slate-800 rounded-md w-2/5" />
                <div className="h-2.5 bg-slate-800/80 rounded-md w-3/5" />
              </div>
            </div>
            <div className="h-7 bg-slate-800 rounded-lg w-20 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  // Default: Grid Cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full" id="skeleton-card-container">
      {items.map((_, i) => (
        <div
          key={i}
          id={`loading-card-item-${i}`}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between gap-4 animate-pulse"
        >
          {/* Top category / date row */}
          <div className="flex justify-between items-start">
            <div className="h-4 bg-slate-800 rounded-md w-16" />
            <div className="h-3 bg-slate-800 rounded-md w-12" />
          </div>

          {/* Title / Description area */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-800 rounded-md w-3/4" />
            <div className="h-3 bg-slate-800/80 rounded-md w-1/2" />
          </div>

          {/* Large text fallback placeholder */}
          <div className="h-16 bg-slate-950/60 border-y border-slate-850/60 rounded-md py-2 flex flex-col gap-1.5 justify-center px-2">
            <div className="h-2.5 bg-slate-800 rounded-md w-full" />
            <div className="h-2.5 bg-slate-800 rounded-md w-5/6" />
          </div>

          <div className="space-y-2">
            <div className="h-2.5 bg-slate-80 w-12 rounded" />
            {/* Tag line items */}
            <div className="flex flex-wrap gap-1.5">
              <div className="h-4 bg-slate-800 rounded-md w-10" />
              <div className="h-4 bg-slate-800 rounded-md w-12" />
              <div className="h-4 bg-slate-800 rounded-md w-14" />
            </div>
          </div>

          {/* Footer controls row */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-850/40">
            <div className="h-3 bg-slate-850 rounded-md w-20" />
            <div className="h-7 bg-slate-800 rounded-lg w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
