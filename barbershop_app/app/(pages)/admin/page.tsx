'use client'; // Mark as Client Component since we use hooks and interactivity

import React, { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";
import {
  Users,
  Package,
  Scissors,
  Calendar,
  Edit,
  Trash,
  Plus,
  Search,
} from "lucide-react";
import { mockProducts, mockServices, mockClients } from "@/app/data/mockData";
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";

export default function Admin() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  
  // If not admin, redirect to home
  if (!isAdmin) {
    return redirect("/");
  }
  
  // Filter items based on search term
  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredServices = mockServices.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredClients = mockClients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Mock handlers for CRUD operations
  const handleDeleteItem = (id: string, type: string) => {
    toast.success(`${type} deleted successfully!`);
  };
  
  const handleEditItem = (id: string, type: string) => {
    toast.info(`Edit ${type} with ID: ${id}`);
  };
  
  const handleAddItem = (type: string) => {
    toast.info(`Add new ${type}`);
  };
  
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 font-serif text-barber-brown">Admin Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-8 bg-barber-cream">
            <TabsTrigger value="products" className="flex-1">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="services" className="flex-1">
              <Scissors className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
          </TabsList>
          
          <div className="flex justify-between items-center mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="pl-10 border-barber-cream"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button
              onClick={() => handleAddItem(activeTab.slice(0, -1))}
              className="bg-barber-brown hover:bg-barber-dark-brown"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab.slice(0, -1)}
            </Button>
          </div>
          
          <TabsContent value="products" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-barber-cream text-left">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Sold</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-barber-cream">
                  {filteredProducts.map((product) => (
                    <tr key={product.id.toString()}>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4">${product.price.toFixed(2)}</td>
                      <td className="p-4">{product.quantity}</td>
                      <td className="p-4">{product.soldQuantity}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditItem(product.id.toString(), "product")}
                            className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(product.id.toString(), "product")}
                            className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-barber-cream text-left">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-barber-cream">
                  {filteredServices.map((service) => (
                    <tr key={service.id.toString()}>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span>{service.name}</span>
                        </div>
                      </td>
                      <td className="p-4">${service.price.toFixed(2)}</td>
                      <td className="p-4">{service.duration} min</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditItem(service.id.toString(), "service")}
                            className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(service.id.toString(), "service")}
                            className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="clients" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-barber-cream text-left">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-barber-cream">
                  {filteredClients.map((client) => (
                    <tr key={client.id.toString()}>
                      <td className="p-4">{client.name}</td>
                      <td className="p-4">{client.email}</td>
                      <td className="p-4">{client.phone}</td>
                      <td className="p-4">{client.address}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditItem(client.id.toString(), "client")}
                            className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(client.id.toString(), "client")}
                            className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="appointments" className="mt-0">
            <div className="flex justify-center items-center p-16 bg-white rounded-lg shadow-sm">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-barber-brown mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Appointment Management</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  This section will allow you to manage all scheduled appointments, view client details, and make adjustments as needed.
                </p>
                <Button className="bg-barber-brown hover:bg-barber-dark-brown">
                  Implement Appointment Management
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}