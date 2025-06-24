/**
 * @file barbershop_app/app/components/ui/button.tsx
 * @description A customizable, accessible button component built on top of
 * class-variance-authority (CVA). Defines a set of style variants and sizes,
 * and supports rendering as a native `<button>` or forwarding to another component via `asChild`.
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

/**
 * buttonVariants
 *
 * Defines the base styles and variant-specific classes for the Button component.
 * Utilizes CVA to generate class names for the following:
 * - `variant`: controls color and background for default, destructive, outline, secondary, ghost, and link styles.
 * - `size`: controls padding, height, and border-radius for default, small, large, and icon-only buttons.
 *
 * The default variant is `default`, and the default size is `default`.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * ButtonProps
 *
 * Extends the native HTML button attributes with CVA-based variant and size props.
 *
 * @interface
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 * @extends VariantProps<typeof buttonVariants>
 * @property {boolean} [asChild=false] - When true, renders this component as its child element
 *   using Radix’s `Slot`, merging the Button’s props onto that child.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Button
 *
 * A polymorphic button component that supports:
 * - Predefined visual variants (color schemes) and sizes (padding/height)
 * - Forwarding refs to the underlying `<button>` or any custom child via `asChild`
 * - Accessible focus and disabled states out of the box
 *
 * @component
 * @param {ButtonProps} props
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref pointing to the underlying element.
 * @returns {JSX.Element}
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
