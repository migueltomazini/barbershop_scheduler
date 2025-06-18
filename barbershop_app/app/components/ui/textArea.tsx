/**
 * @file barbershop_app/app/components/ui/textarea.tsx
 * @description This file exports a standardized Textarea component for multi-line text input.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// Use 'type' instead of 'interface' to extend HTML attributes and avoid the empty interface error.
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * @component Textarea
 * @description A styled multi-line text input component. It is a forward-ref component, allowing parent
 * components to get a ref to the underlying HTML textarea element.
 * @param {TextareaProps} props - Standard HTML textarea attributes.
 * @param {React.Ref<HTMLTextAreaElement>} ref - The ref to forward.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
