import * as React from "react";
import { onModEnterKeyboardEvent } from "@/components/onModEnterKeyboardEvent";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onModEnter?: () => void;
  ref?: React.Ref<HTMLTextAreaElement>;
}

const Textarea = ({ className, onModEnter, ref, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        "min-h-[80px] w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-base text-foreground transition-colors",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      ref={ref}
      onKeyDown={props.onKeyDown || (onModEnter ? onModEnterKeyboardEvent(onModEnter) : undefined)}
      {...props}
    />
  );
};
Textarea.displayName = "Textarea";

export { Textarea };
