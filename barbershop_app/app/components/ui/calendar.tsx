/**
 * @file barbershop_app/app/components/ui/calendar.tsx
 * @description This file exports a styled Calendar component built on top of the 'react-day-picker' library.
 * It provides a themed and accessible date picker for the application.
 */

"use client";

import * as React from "react";
import { DayPicker, DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/app/components/ui/button";
import "react-day-picker/dist/style.css"; // Import base styles for react-day-picker

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * @component Calendar
 * @description A styled calendar component for date selection, with custom icons and theme-aligned classes.
 * @param {CalendarProps} props - The props for the `react-day-picker` component.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      // A comprehensive set of class names to style every part of the calendar
      // according to the application's theme.
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      // Custom components to replace the default navigation arrows with Lucide icons.
      components={
        {
          IconLeft: ({
            className,
            ...props
          }: React.SVGProps<SVGSVGElement>) => (
            <ChevronLeft className={cn("size-4", className)} {...props} />
          ),
          IconRight: ({
            className,
            ...props
          }: React.SVGProps<SVGSVGElement>) => (
            <ChevronRight className={cn("size-4", className)} {...props} />
          ),
        } as unknown as Partial<DayPickerProps["components"]>
      }
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
