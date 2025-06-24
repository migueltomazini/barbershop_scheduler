/**
 * @file barbershop_app/app/components/sections/admin/AdminDashboardClient.tsx
 * @description
 * This file exports the AdminDashboardClient component, a comprehensive admin panel for managing
 * products, services, clients, and appointments in the barbershop app. It features tabbed navigation,
 * search filtering, modals for editing/creating entities, and integrates server-side actions for CRUD operations.
 * 
 * The component is a Client Component using React state and effects, and leverages server actions for data persistence.
 */

"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/app/components/ui/tabs";
import { AdminDashboardHeader } from "./adminDashboardHeader";
import { ProductManagementTab } from "./productManagementTab";
import { ServiceManagementTab } from "./serviceManagementTab";
import { ClientManagementTab } from "./clientManagementTab";
import { AppointmentManagementTab } from "./appointmentManagementTab";
import { EditProductModal } from "./editProductModal";
import { EditServiceModal } from "./editServiceModal";
import { EditClientModal } from "./editClientModal";
import { EditAppointmentModal } from "./editAppointmentModal";
import { ProductType, ServiceType, User, Appointment } from "@/app/types";

// Import all server actions for CRUD operations
import { 
  saveProduct, deleteProduct,
  saveService, deleteService,
  updateUser, deleteUser,
  updateAppointment, deleteAppointment
} from "@/app/actions/adminActions";

interface AdminDashboardClientProps {
  initialProducts: ProductType[];
  initialServices: ServiceType[];
  initialClients: User[];
  initialAppointments: Appointment[];
}

/**
 * AdminDashboardClient component
 * 
 * @param initialProducts - Array of product objects initially loaded from the server
 * @param initialServices - Array of service objects initially loaded from the server
 * @param initialClients - Array of client user objects initially loaded from the server
 * @param initialAppointments - Array of appointment objects initially loaded from the server
 * 
 * @returns JSX.Element rendering the admin dashboard with tabs for managing all entities
 */
export default function AdminDashboardClient({
  initialProducts,
  initialServices,
  initialClients,
  initialAppointments,
}: AdminDashboardClientProps) {
  // UI state for active tab and search input
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states and current item being edited
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  /**
   * Opens the appropriate modal for editing or creating an item
   * @param item - The item to edit, or null to create new
   * @param type - The type of item: 'product', 'service', 'client', or 'appointment'
   */
  const openModal = (item: any, type: string) => {
    setEditingItem(item);
    if (type === 'product') setIsProductModalOpen(true);
    if (type === 'service') setIsServiceModalOpen(true);
    if (type === 'client') setIsClientModalOpen(true);
    if (type === 'appointment') setIsAppointmentModalOpen(true);
  };

  /**
   * Helper to open modal for creating a new item in the current tab
   * @param type - The active tab key (plural form), e.g. 'products'
   */
  const openNewModal = (type: string) => {
    // Convert plural tab key to singular type: 'products' -> 'product'
    openModal(null, type.slice(0, -1));
  };

  /**
   * Handles saving a product by calling the corresponding server action
   * @param data - Partial product data to save or create
   */
  const handleSaveProduct = async (data: Partial<ProductType>) => {
    const result = await saveProduct(data);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    setIsProductModalOpen(false);
  };

  /**
   * Handles saving a service by calling the corresponding server action
   * @param data - Partial service data to save or create
   */
  const handleSaveService = async (data: Partial<ServiceType>) => {
    const result = await saveService(data);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    setIsServiceModalOpen(false);
  };

  /**
   * Handles updating a client user by calling the corresponding server action
   * @param id - User ID to update
   * @param data - Partial user data to update
   */
  const handleSaveClient = async (id: string, data: Partial<User>) => {
    const result = await updateUser(id, data);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    setIsClientModalOpen(false);
  };

  /**
   * Handles updating an appointment by calling the corresponding server action
   * @param id - Appointment ID to update
   * @param data - Partial appointment data to update
   */
  const handleSaveAppointment = async (id: string, data: Partial<Appointment>) => {
    const result = await updateAppointment(id, data);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    setIsAppointmentModalOpen(false);
  };

  /**
   * Handles deleting an item by type using server actions, with confirmation
   * @param id - ID of the item to delete
   * @param type - Item type: 'product', 'service', 'client', or 'appointment'
   */
  const handleDelete = async (id: string, type: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    let result;
    if (type === 'product') result = await deleteProduct(id);
    if (type === 'service') result = await deleteService(id);
    if (type === 'client') result = await deleteUser(id);
    if (type === 'appointment') result = await deleteAppointment(id);

    if (result?.success) toast.success(result.message);
    else toast.error(result?.message || "Action failed.");
  };

  // Normalize search term for filtering
  const lowerSearchTerm = searchTerm.toLowerCase();

  // Filtered lists for each tab based on search term
  const filteredProducts = initialProducts.filter(p =>
    p.name.toLowerCase().includes(lowerSearchTerm)
  );

  const filteredServices = initialServices.filter(s =>
    s.name.toLowerCase().includes(lowerSearchTerm)
  );

  const filteredClients = initialClients.filter(c =>
    c.name.toLowerCase().includes(lowerSearchTerm) ||
    c.email.toLowerCase().includes(lowerSearchTerm)
  );

  const filteredAppointments = initialAppointments.filter(a =>
    (a as any).user?.name.toLowerCase().includes(lowerSearchTerm) ||
    (a as any).service?.name.toLowerCase().includes(lowerSearchTerm)
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={value => {
        setActiveTab(value);
        setSearchTerm("");
      }}
    >
      <AdminDashboardHeader
        activeTab={activeTab}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onAddItem={() => openNewModal(activeTab)}
      />

      {/* Products management tab */}
      <TabsContent value="products">
        <ProductManagementTab
          products={filteredProducts}
          onEdit={item => openModal(item, 'product')}
          onDelete={id => handleDelete(id, 'product')}
        />
      </TabsContent>

      {/* Services management tab */}
      <TabsContent value="services">
        <ServiceManagementTab
          services={filteredServices}
          onEdit={item => openModal(item, 'service')}
          onDelete={id => handleDelete(id, 'service')}
        />
      </TabsContent>

      {/* Clients management tab */}
      <TabsContent value="clients">
        <ClientManagementTab
          clients={filteredClients}
          onEdit={item => openModal(item, 'client')}
          onDelete={id => handleDelete(id, 'client')}
        />
      </TabsContent>

      {/* Appointments management tab */}
      <TabsContent value="appointments">
        <AppointmentManagementTab
          appointments={filteredAppointments}
          onEdit={item => openModal(item, 'appointment')}
          onDelete={id => handleDelete(id, 'appointment')}
        />
      </TabsContent>

      {/* Edit modals for each entity */}
      <EditProductModal
        isOpen={isProductModalOpen}
        onOpenChange={setIsProductModalOpen}
        product={editingItem}
        onSave={handleSaveProduct}
      />
      <EditServiceModal
        isOpen={isServiceModalOpen}
        onOpenChange={setIsServiceModalOpen}
        service={editingItem}
        onSave={handleSaveService}
      />
      <EditClientModal
        isOpen={isClientModalOpen}
        onOpenChange={setIsClientModalOpen}
        client={editingItem}
        onSave={handleSaveClient}
      />
      <EditAppointmentModal
        isOpen={isAppointmentModalOpen}
        onOpenChange={setIsAppointmentModalOpen}
        appointment={editingItem}
        onSave={handleSaveAppointment}
      />
    </Tabs>
  );
}
