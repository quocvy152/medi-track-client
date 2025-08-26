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
  "w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

export function SocialButton({ provider, onClick, children, className = "" }: SocialButtonProps) {
  const styles = "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500";

  const iconSrc = provider === "google"
    ? "/images/social/google.png"
    : "/images/social/facebook.png";

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      <Image src={iconSrc} alt={`${provider} logo`} width={provider === 'google' ? 18 : 24} height={provider === 'google' ? 18 : 24} />
      <span>{children}</span>
    </button>
  );
}

export default SocialButton; 