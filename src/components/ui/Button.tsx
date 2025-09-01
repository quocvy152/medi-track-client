import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
variant?: "primary" | "secondary" | "ghost";
size?: "sm" | "md" | "lg";
loading?: boolean;
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

// Loading spinner component
const LoadingSpinner = () => (
<svg
className="animate-spin -ml-1 mr-2 h-4 w-4"
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24"
>
<circle
className="opacity-25"
cx="12"
cy="12"
r="10"
stroke="currentColor"
strokeWidth="4"
></circle>
<path
className="opacity-75"
fill="currentColor"
d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
></path>
</svg>
);

export function Button({ 
className = "", 
variant = "primary", 
size = "md", 
loading = false,
disabled,
children,
...props 
}: ButtonProps) {
const variantClass = variants[variant] ?? variants.primary;
const sizeClass = sizes[size] ?? sizes.md;

return (
<button 
className={`${base} ${variantClass} ${sizeClass} ${className}`} 
disabled={disabled || loading}
{...props}
>
{loading && <LoadingSpinner />}
{children}
</button>
);
}

export default Button;
