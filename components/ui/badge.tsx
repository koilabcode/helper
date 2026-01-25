import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        dark: "border-transparent bg-primary text-primary-foreground",
        bright: "border-transparent bg-accent text-accent-foreground",
        success: "border-green-400/50 bg-green-500/10 text-green-400",
        "success-light": "border-green-400/50 bg-green-500/10 text-green-400",
        destructive: "border-red-400/50 bg-red-500/10 text-red-400",
        warning: "border-yellow-400/50 bg-yellow-500/10 text-yellow-400",
        gray: "border-gray-400/50 bg-gray-500/10 text-gray-400",
        outline: "border-border text-foreground",
      },
      size: {
        default: "text-xs",
        sm: "text-xxs px-1.5 py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
