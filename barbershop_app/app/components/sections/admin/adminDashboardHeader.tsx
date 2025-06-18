/**
 * @file barbershop_app/app/components/sections/admin/adminDashboardHeader.tsx
 * @description This file contains the AdminDashboardHeader component, which renders the main header for the admin dashboard,
 * including the title, navigation tabs, a search bar, and an "Add New" button.
 */

"use client";

import React from "react";
import { TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Users,
  Package,
  Scissors,
  Calendar as CalendarIconLucide,
  Search,
  PlusCircle,
} from "lucide-react";

/**
 * @interface AdminDashboardHeaderProps
 * @description Defines the properties for the AdminDashboardHeader component.
 * @property {string} activeTab - The currently active tab identifier (e.g., 'products', 'services').
 * @property {string} searchTerm - The current value of the search input.
 * @property {(value: string) => void} onSearchTermChange - Callback function to handle changes in the search term.
 * @property {() => void} onAddItem - Callback function to trigger the "Add New Item" action.
 */
interface AdminDashboardHeaderProps {
  activeTab: string;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onAddItem: () => void;
}

/**
 * @component AdminDashboardHeader
 * @description Renders the header section for the admin dashboard. This includes the main title,
 * navigation tabs for different management sections, a search input, and a button to add new items.
 * @param {AdminDashboardHeaderProps} props - The props for the component.
 */
export function AdminDashboardHeader({
  activeTab,
  searchTerm,
  onSearchTermChange,
  onAddItem,
}: AdminDashboardHeaderProps) {
  // Determines if the "Add New" button should be displayed based on the active tab.
  // This functionality is only available for 'products' and 'services'.
  const isAddable = ["products", "services"].includes(activeTab);

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 font-serif text-barber-brown">
        Admin Dashboard
      </h1>

      {/* Navigation tabs for switching between different management areas. */}
      <TabsList className="w-full mb-8 bg-barber-cream grid grid-cols-2 md:grid-cols-4">
        <TabsTrigger
          value="products"
          className="flex-1 data-[state=active]:bg-barber-brown data-[state=active]:text-white"
        >
          <Package className="h-4 w-4 mr-2" /> Products
        </TabsTrigger>
        <TabsTrigger
          value="services"
          className="flex-1 data-[state=active]:bg-barber-brown data-[state=active]:text-white"
        >
          <Scissors className="h-4 w-4 mr-2" /> Services
        </TabsTrigger>
        <TabsTrigger
          value="clients"
          className="flex-1 data-[state=active]:bg-barber-brown data-[state=active]:text-white"
        >
          <Users className="h-4 w-4 mr-2" /> Clients
        </TabsTrigger>
        <TabsTrigger
          value="appointments"
          className="flex-1 data-[state=active]:bg-barber-brown data-[state=active]:text-white"
        >
          <CalendarIconLucide className="h-4 w-4 mr-2" /> Appointments
        </TabsTrigger>
      </TabsList>

      {/* Container for search input and the "Add New" button. */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Search input field with a search icon. */}
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            type="text"
            placeholder={`Search in ${activeTab}...`}
            className="pl-10 border-barber-cream w-full"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>

        {/* Conditionally renders the "Add New" button if the current tab supports it. */}
        {isAddable && (
          <Button
            onClick={onAddItem}
            className="text-white w-full sm:w-auto bg-barber-brown hover:bg-barber-dark-brown"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </Button>
        )}
      </div>
    </>
  );
}
