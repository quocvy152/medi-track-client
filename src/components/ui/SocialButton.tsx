"use client";

import Image from "next/image";
import React from "react";

type Provider = "google" | "facebook";

export interface SocialButtonProps {
  provider: Provider;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const base =
  "w-full inline-flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";

export function SocialButton({ provider, onClick, children, className = "" }: SocialButtonProps) {
  const styles = provider === "google"
    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:ring-cyan-500/50 shadow-sm hover:shadow-md"
    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:ring-cyan-500/50 shadow-sm hover:shadow-md";

  const iconSrc = provider === "google"
    ? "/images/social/google.png"
    : "/images/social/facebook.png";

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      <Image 
        src={iconSrc} 
        alt={`${provider} logo`} 
        width={provider === 'google' ? 20 : 20} 
        height={provider === 'google' ? 20 : 20}
        className="object-contain"
      />
      <span>{children}</span>
    </button>
  );
}

export default SocialButton; 