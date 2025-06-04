"use client";

import React from "react";
// Imports specific UI components: TabsList and TabsTrigger
import { TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import {
  Users,
  Package,
  Scissors,
  Calendar as CalendarIconLucide,
  Search,
} from "lucide-react";

// Defines the props for the AdminDashboardHeader component
interface AdminDashboardHeaderProps {
  activeTab: string;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onAddItem: () => void;
}

// AdminDashboardHeader functional component
export function AdminDashboardHeader({
  activeTab,
  searchTerm,
  onSearchTermChange,
}: AdminDashboardHeaderProps) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 font-serif text-barber-brown">
        Admin Dashboard
      </h1>

      {/* TabsList for navigating between different management sections */}
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

      {/* Search input and Add Item button section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
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
      </div>
    </>
  );
}
