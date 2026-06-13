import React from "react";
import { colors } from "../../app/theme/colors";
import { radius } from "../../app/theme/radius";
import { shadows } from "../../app/theme/shadows";

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold cursor-pointer transition-all duration-150 active:scale-98 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/20",
    secondary: "bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-800/80",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-md",
    ghost: "bg-transparent hover:bg-slate-900 text-slate-300"
  };

  const sizes = {
    sm: "px-2.5 py-1 text-[11px] rounded-lg",
    md: "px-4 py-2 text-xs rounded-xl",
    lg: "px-6 py-3 text-sm rounded-xl"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-sans">{label}</label>}
      <input 
        className={`w-full bg-slate-950 border ${error ? "border-red-500" : "border-slate-800 focus:border-indigo-500"} rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 font-sans focus:outline-none transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-[10px] text-red-400 font-medium">{error}</span>}
    </div>
  );
};

// --- TEXTAREA ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export const Textarea: React.FC<TextareaProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-sans">{label}</label>}
      <textarea 
        className={`w-full bg-slate-950 border ${error ? "border-red-500" : "border-slate-800 focus:border-indigo-500"} rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 font-sans focus:outline-none transition-all resize-none min-h-[80px] ${className}`}
        {...props}
      />
      {error && <span className="text-[10px] text-red-400 font-medium">{error}</span>}
    </div>
  );
};

// --- CARD ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}
export const Card: React.FC<CardProps> = ({ children, hoverable = false, className = "", ...props }) => {
  return (
    <div 
      className={`bg-slate-900 border border-slate-850 p-4 md:p-5 rounded-2xl text-xs text-slate-200 transition-all ${hoverable ? "hover:border-slate-800 hover:shadow-lg hover:shadow-slate-950/40" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// --- BADGE ---
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "success" | "warning" | "danger" | "neutral";
}
export const Badge: React.FC<BadgeProps> = ({ children, variant = "neutral", className = "", ...props }) => {
  const styles = {
    brand: "bg-indigo-950/30 text-indigo-300 border border-indigo-500/20",
    success: "bg-emerald-950/30 text-emerald-300 border border-emerald-500/20",
    warning: "bg-amber-950/30 text-amber-300 border border-amber-500/20",
    danger: "bg-red-950/30 text-red-300 border border-red-500/20",
    neutral: "bg-slate-800 text-slate-300 border border-slate-750"
  };

  return (
    <span 
      className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold inline-flex items-center gap-0.5 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// --- AVATAR ---
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}
export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback = "U", size = "md", className = "" }) => {
  const sizes = {
    sm: "w-6 h-6 text-[9px]",
    md: "w-9 h-9 text-xs",
    lg: "w-12 h-12 text-sm"
  };

  const defaultImg = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80";

  return (
    <div className={`relative flex-shrink-0 rounded-full border border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center ${sizes[size]} ${className}`}>
      <img 
        src={src || defaultImg} 
        alt={alt || "User Avatar"} 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-850 rounded-2xl w-full max-w-md p-5 shadow-2xl z-10 animate-in fade-in zoom-in duration-150">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-850">
          <h3 className="font-sans font-bold text-slate-100 text-sm tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer text-xs p-1 font-bold">✕</button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};

// --- SKELETON ---
export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return <div className={`animate-pulse bg-slate-800 rounded-xl ${className}`} />;
};
