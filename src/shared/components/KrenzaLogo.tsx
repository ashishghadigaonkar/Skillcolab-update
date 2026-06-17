import React from "react";

interface KrenzaLogoProps {
  className?: string;
  variant?: "full" | "icon" | "full-horizontal" | "icon-only";
  theme?: "light" | "dark";
  size?: number; // custom height/width in pixels
}

export const KrenzaLogo: React.FC<KrenzaLogoProps> = ({
  className = "",
  variant = "full",
  theme = "dark",
  size = 32
}) => {
  const textColor = theme === "dark" ? "text-white" : "text-slate-900";
  const sloganColor = theme === "dark" ? "text-[#06B6D4]" : "text-indigo-600";

  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="25 12 65 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="krenzaLeftStem" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>

          <linearGradient id="krenzaUpperBranch" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>

          <linearGradient id="krenzaLowerBranch" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {/* Left Pillar: Precise 45-degree asymmetric geometry matching high-res model */}
        <path
          d="M 42,20 
             A 12,12 0 0 0 30,32 
             V 68 
             A 12,12 0 0 0 42,80 
             L 54,68 
             V 62 
             L 42,50 
             L 54,38 
             V 20 
             H 42 
             Z"
          fill="url(#krenzaLeftStem)"
        />

        {/* Diagonal Upper Branch Capsule */}
        <path
          d="M 56,48 L 78,26"
          stroke="url(#krenzaUpperBranch)"
          strokeWidth="10.5"
          strokeLinecap="round"
        />
        {/* Upper branch elegant node connector */}
        <path
          d="M 78,26 L 83,21"
          stroke="url(#krenzaUpperBranch)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Upper branch tip bubble dot */}
        <circle cx="85" cy="19" r="4.5" fill="url(#krenzaUpperBranch)" />

        {/* Diagonal Lower Branch Capsule */}
        <path
          d="M 56,52 L 78,74"
          stroke="url(#krenzaLowerBranch)"
          strokeWidth="10.5"
          strokeLinecap="round"
        />
        {/* Lower branch elegant node connector */}
        <path
          d="M 78,74 L 83,79"
          stroke="url(#krenzaLowerBranch)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Lower branch tip bubble dot */}
        <circle cx="85" cy="81" r="4.5" fill="url(#krenzaLowerBranch)" />
      </svg>

      {variant !== "icon-only" && (
        <div className="flex flex-col justify-center select-none text-left">
          <span
            className={`font-sans font-extrabold tracking-tight leading-none ${textColor}`}
            style={{ fontSize: size * 0.52 }}
          >
            Krenza
          </span>
          {variant !== "full-horizontal" && (
            <span
              className={`font-sans font-bold tracking-[0.16em] uppercase shrink-0 ${sloganColor}`}
              style={{ fontSize: size * 0.16, marginTop: size * 0.08 }}
            >
              Connect. Build. Grow.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
