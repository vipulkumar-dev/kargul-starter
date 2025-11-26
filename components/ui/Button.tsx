import { clsx } from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "rounded-full font-bold leading-[140%] whitespace-nowrap transition-all active:scale-98 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "border border-[#202020] text-white",
        secondary: "border-2 border-white",
      },
      size: {
        sm: "px-2 py-1 sm:px-4 sm:py-2 text-[13px] sm:text-[14px]",
        md: "px-2 py-1 sm:px-4 sm:py-2 text-[14px] sm:text-base",
        lg: "px-2 py-1 sm:px-4 sm:py-2 text-[15px] sm:text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export default function Button({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
