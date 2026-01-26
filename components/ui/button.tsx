import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        destructive_outlined:
          "border border-destructive text-destructive hover:bg-destructive/10",
        outlined: "border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        outlined_subtle: "border border-border text-foreground hover:bg-secondary",
        subtle: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        bare: "text-primary hover:text-primary/80 p-0 h-auto",
        link: "text-primary underline-offset-4 hover:underline",
        bright: "bg-accent text-accent-foreground hover:bg-accent/90",
        sidebar:
          "hover:bg-sidebar-accent hover:text-sidebar-foreground data-[desktop=false]:hover:bg-accent data-[desktop=false]:hover:text-foreground",
        "sidebar-subtle":
          "bg-sidebar-accent text-sidebar-foreground data-[desktop=false]:bg-accent data-[desktop=false]:text-foreground hover:bg-sidebar-accent/80 data-[desktop=false]:hover:bg-accent/80",
        "sidebar-link":
          "text-sidebar-foreground hover:text-sidebar-foreground/80 hover:bg-transparent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        default: "h-9 rounded-md px-4 py-2",
        lg: "h-10 rounded-md px-6",
      },
      iconOnly: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        size: "sm",
        iconOnly: true,
        className: "size-8 px-0",
      },
      {
        size: "default",
        iconOnly: true,
        className: "size-9 px-0",
      },
      {
        size: "lg",
        iconOnly: true,
        className: "size-10 px-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      iconOnly: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  desktop?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export const Button = ({
  className,
  variant,
  size,
  iconOnly,
  asChild = false,
  desktop,
  tabIndex,
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, iconOnly, className }))}
      ref={ref}
      tabIndex={tabIndex}
      data-desktop={desktop}
      {...props}
    />
  );
};

Button.displayName = "Button";
