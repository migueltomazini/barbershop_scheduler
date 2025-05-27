import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Defines label style variants
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

// Label component
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
