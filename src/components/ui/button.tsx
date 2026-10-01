import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:brightness-105 hover:shadow-lg hover:shadow-primary/30 border border-primary/20",
        destructive:
          "bg-gradient-to-b from-destructive to-destructive/90 text-destructive-foreground shadow-md shadow-destructive/20 hover:brightness-105 border border-destructive/20",
        outline:
          "border border-border/80 bg-card/70 backdrop-blur-md shadow-2xs hover:bg-secondary/80 hover:text-foreground hover:border-primary/40",
        secondary:
          "bg-secondary/80 backdrop-blur-md text-secondary-foreground shadow-2xs hover:bg-secondary hover:brightness-105 border border-border/50",
        ghost: "hover:bg-secondary/70 hover:text-foreground active:bg-secondary/90",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          "bg-card/65 backdrop-blur-xl border border-white/20 dark:border-white/10 text-foreground shadow-md hover:bg-card/80 hover:border-primary/50",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8.5 rounded-lg px-3.5 text-xs",
        lg: "h-11 rounded-2xl px-7 text-base font-bold",
        icon: "h-9.5 w-9.5 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
