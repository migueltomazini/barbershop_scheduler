import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils"; // Assumindo que você ainda tem essa função utilitária

// Definindo as variantes de estilo para o Label
const labelVariants = cva(
  "text-sm font-medium leading-none", // Estilo base
  {
    variants: {
      // Exemplo de uma nova variante para cor
      color: {
        default: "text-gray-700",
        primary: "text-barber-gold", // Supondo que "barber-gold" seja uma cor no seu tailwind.config.js
        destructive: "text-red-500",
      },
      // Exemplo de uma nova variante para tamanho
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
  }
);

// O componente Label em si
const Label = React.forwardRef<
  HTMLLabelElement, // O ref agora é para um elemento HTML label
  React.ComponentPropsWithoutRef<"label"> & // As props são as de um elemento HTML label
    VariantProps<typeof labelVariants> // Inclui as props das variantes
>(({ className, color, size, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(labelVariants({ color, size, className }))} // Aplica as variantes e classes adicionais
    {...props}
  />
));

Label.displayName = "Label"; // Mantém o displayName para depuração

export { Label };