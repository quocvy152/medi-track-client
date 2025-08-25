import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md" | "lg";
};

const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<string, string> = {
	primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
	secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400",
	ghost: "bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-300",
};

const sizes: Record<string, string> = {
	sm: "h-8 px-3 text-sm",
	md: "h-10 px-4 text-sm",
	lg: "h-12 px-5 text-base",
};

export function Button({ className = "", variant = "primary", size = "md", ...props }: ButtonProps) {
	const variantClass = variants[variant] ?? variants.primary;
	const sizeClass = sizes[size] ?? sizes.md;
	return (
		<button className={`${base} ${variantClass} ${sizeClass} ${className}`} {...props} />
	);
}

export default Button; 