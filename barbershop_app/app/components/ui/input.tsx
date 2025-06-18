/**
 * @file barbershop_app/app/components/ui/input.tsx
 * @description This file exports a standardized Input component for use throughout the application.
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * @component Input
 * @description A styled text input component that can be used for various forms.
 * It's a forward-ref component, allowing parent components to get a ref to the underlying HTML input element.
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - Standard HTML input attributes.
 * @param {React.Ref<HTMLInputElement>} ref - The ref to forward.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
