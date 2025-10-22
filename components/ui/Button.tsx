import { clsx } from "clsx";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "rounded-full font-bold leading-[140%] whitespace-nowrap transition-all active:scale-98 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "cta-button-dark border border-[#202020] text-white",
        secondary: "cta-button-light border-2 border-white",
      },
      size: {
        sm: "px-2.5 py-1.5 md:px-4 md:py-2 text-[13px] md:text-[16px]",
        md: "px-4 py-2.5 md:px-6 md:py-3 text-[14px] md:text-base",
        lg: "px-[16px] md:px-6 py-[12px] md:py-4 text-[15px] sm:text-lg",
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
