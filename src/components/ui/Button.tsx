import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-hover shadow-sm",
  secondary: "bg-surface text-text border border-border hover:bg-surface-hover active:bg-surface-active",
  ghost: "text-text-secondary hover:bg-surface-hover active:bg-surface-active",
  danger: "bg-danger text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
  outline: "border border-primary text-primary hover:bg-primary-light active:bg-primary-light",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-9 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-6 text-base gap-2.5 rounded-lg",
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 w-8 rounded-md",
  md: "h-9 w-9 rounded-lg",
  lg: "h-11 w-11 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      icon,
      loading,
      fullWidth,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const isIconOnly = icon && !children;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin shrink-0"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="8"
              cy="8"
              r="6"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M14 8a6 6 0 01-1.08 3.38l-.87.5A7 7 0 1015 8h-1z"
            />
          </svg>
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
