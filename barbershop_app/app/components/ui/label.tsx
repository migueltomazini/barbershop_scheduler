/**
 * @file barbershop_app/app/components/ui/label.tsx
 * @description This file exports a styled Label component for form elements, with variants for color and size.
 */

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Defines the CSS classes for different label variants using CVA.
const labelVariants = cva("text-sm font-medium leading-none", {
  variants: {
    color: {
      default: "text-gray-700",
      primary: "text-barber-gold",
      destructive: "text-red-500",
    },
    size: {
      default: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    },
  },
  defaultVariants: {
    color: "default",
    size: "default",
  },
});

/**
 * @component Label
 * @description A styled label component for form inputs, supporting different colors and sizes.
 * @param {React.ComponentPropsWithoutRef<"label"> & VariantProps<typeof labelVariants>} props - Standard label attributes plus CVA variants.
 * @param {React.Ref<HTMLLabelElement>} ref - The ref to forward to the label element.
 */
const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<"label"> & VariantProps<typeof labelVariants>
>(({ className, color, size, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(labelVariants({ color, size, className }))}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
