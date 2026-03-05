import { forwardRef, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

const base =
  "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-full";
const variants = {
  primary:
    "bg-black text-white hover:bg-[#1D1D1F] active:scale-[0.98] shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
  secondary: "border border-[#1D1D1F] text-[#1D1D1F] hover:bg-[#F5F5F7]",
  ghost: "text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]",
};
const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-12 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, asChild, children, ...props }, ref) => {
    const cls = cn(base, variants[variant], sizes[size], className);
    if (asChild && isValidElement(children)) {
      return cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn((children.props as { className?: string }).className, cls),
      });
    }
    return (
      <button ref={ref} className={cls} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
