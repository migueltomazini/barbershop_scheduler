/**
 * @file barbershop_app/app/(pages)/admin/page.tsx
 * @description This file contains the main component for the Admin Dashboard page. It handles data fetching for all
 * administrative entities (products, services, clients, appointments), manages state for the active tab and modals,
 * and orchestrates all CRUD (Create, Read, Update, Delete) operations.
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/app/contexts/AuthContext";

import { Tabs, TabsContent } from "@/app/components/ui/tabs";
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import { AdminDashboardHeader } from "@/app/components/sections/admin/adminDashboardHeader";
import { AppointmentManagementTab } from "@/app/components/sections/admin/appointmentManagementTab";
import { ClientManagementTab } from "@/app/components/sections/admin/clientManagementTab";
import { EditAppointmentModal } from "@/app/components/sections/admin/editAppointmentModal";
import { EditClientModal } from "@/app/components/sections/admin/editClientModal";
import { EditProductModal } from "@/app/components/sections/admin/editProductModal";
import { EditServiceModal } from "@/app/components/sections/admin/editServiceModal";
import { ProductManagementTab } from "@/app/components/sections/admin/productManagementTab";
import { ServiceManagementTab } from "@/app/components/sections/admin/serviceManagementTab";

import {
  ProductType,
  ServiceType,
  Client,
  Appointment,
  User,
} from "@/app/types";

// The base URL for the JSON server API.
const API_BASE_URL = "http://localhost:3001";

/**
 * @function decapitalizeStatus
 * @description Converts a capitalized status string (e.g., "Scheduled") to its lowercase equivalent for API consistency.
 * @param {string} status - The status string to convert.
 * @returns {Appointment["status"]} The lowercase status, defaulting to "scheduled" if invalid.
 */
const decapitalizeStatus = (status: string): Appointment["status"] => {
  const lower = status.toLowerCase();
  if (["scheduled", "completed", "cancelled", "pending"].includes(lower)) {
    return lower as Appointment["status"];
  }
  return "scheduled"; // Fallback status
};

export default function AdminPage() {
  const { isAdmin, user, updateUserContext } = useAuth();
  const router = useRouter();

  // State for storing fetched data
  const [products, setProducts] = useState<ProductType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // State for UI and data loading management
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");

  // State for controlling modal visibility
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] =
    useState(false);

  // State for holding the item currently being edited
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );
  const [editingService, setEditingService] = useState<ServiceType | null>(
    null
  );
  const [editingClient, setEditingClient] = useState<User | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  // Effect to enforce admin-only access to this page.
  useEffect(() => {
    if (user !== undefined && !isAdmin) {
      toast.error("Access Denied. Redirecting to home page.");
      router.push("/");
    }
  }, [isAdmin, user, router]);

  // Fetches all necessary data for the admin dashboard.
  const fetchData = useCallback(async () => {
    if (!isAdmin && user !== undefined) {
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    setError(null);
    try {
      // Fetch all resources in parallel for better performance.
      const [productsRes, servicesRes, appointmentsRes, usersRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/services`),
          fetch(`${API_BASE_URL}/appointments`),
          fetch(`${API_BASE_URL}/users`),
        ]);

      if (!productsRes.ok) throw new Error("Failed to fetch products");
      setProducts(await productsRes.json());
      if (!servicesRes.ok) throw new Error("Failed to fetch services");
      setServices(await servicesRes.json());
      if (!appointmentsRes.ok) throw new Error("Failed to fetch appointments");
      setAppointments(await appointmentsRes.json());
      if (!usersRes.ok) throw new Error("Failed to fetch users");
      setAllUsers(await usersRes.json());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load data.";
      setError(message);
      toast.error(message);
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin, user]);

  // Initial data fetch when the component mounts or user status changes.
  useEffect(() => {
    if (isAdmin) {
      fetchData();
    } else if (user !== undefined && !isAdmin) {
      setLoadingData(false);
    }
  }, [fetchData, isAdmin, user]);

  /**
   * @function makeApiRequest
   * @description A generic helper to perform API requests (POST, PATCH, DELETE, PUT).
   * @param {string} endpoint - The API endpoint (e.g., '/products/1').
   * @param {'POST' | 'PATCH' | 'DELETE' | 'PUT'} method - The HTTP method.
   * @param {unknown} [body] - The request body for POST, PATCH, PUT.
   * @returns {Promise<any>} The response data or true for DELETE.
   */
  const makeApiRequest = async (
    endpoint: string,
    method: "POST" | "PATCH" | "DELETE" | "PUT",
    body?: unknown
  ) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return method !== "DELETE" ? await response.json() : true;
  };

  /**
   * @function handleOpenEditModal
   * @description Opens the appropriate modal and sets the item to be edited.
   * @param {ProductType | ServiceType | User | Appointment} item - The item to edit.
   * @param {string} type - The type of the item ('product', 'service', etc.).
   */
  const handleOpenEditModal = (
    item: ProductType | ServiceType | User | Appointment,
    type: string
  ) => {
    switch (type) {
      case "product":
        setEditingProduct(item as ProductType);
        setIsEditProductModalOpen(true);
        break;
      case "service":
        setEditingService(item as ServiceType);
        setIsEditServiceModalOpen(true);
        break;
      case "appointment":
        setEditingAppointment(item as Appointment);
        setIsEditAppointmentModalOpen(true);
        break;
      case "client":
        setEditingClient(item as User);
        setIsEditClientModalOpen(true);
        break;
      default:
        break;
    }
  };

  /**
   * @function handleOpenNewItemModal
   * @description Opens the appropriate modal for creating a new item.
   * @param {string} type - The type of item to create (e.g., 'products').
   */
  const handleOpenNewItemModal = (type: string) => {
    switch (type) {
      case "products":
        setEditingProduct(null);
        setIsEditProductModalOpen(true);
        break;
      case "services":
        setEditingService(null);
        setIsEditServiceModalOpen(true);
        break;
      default:
        toast.info(
          `Add new ${type.slice(0, -1)} functionality not implemented yet.`
        );
        break;
    }
  };

  // Handlers for saving changes (Create and Update operations)
  const handleSaveProduct = async (productData: Omit<ProductType, "type">) => {
    const { id, ...data } = productData;
    const isNew = !id;
    try {
      await makeApiRequest(
        isNew ? "/products" : `/products/${id}`,
        isNew ? "POST" : "PUT",
        { ...data, type: "product" }
      );
      toast.success(`Product ${isNew ? "created" : "updated"} successfully!`);
      fetchData();
      setIsEditProductModalOpen(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save product.");
    }
  };

  const handleSaveService = async (serviceData: Partial<ServiceType>) => {
    const { id, ...data } = serviceData;
    const isNew = !id;
    try {
      await makeApiRequest(
        isNew ? "/services" : `/services/${id}`,
        isNew ? "POST" : "PUT",
        { ...data, type: "service" }
      );
      toast.success(`Service ${isNew ? "created" : "updated"} successfully!`);
      fetchData();
      setIsEditServiceModalOpen(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save service.");
    }
  };

  const handleSaveAppointment = async (
    appointmentId: string,
    data: Partial<Appointment>
  ) => {
    const dataToSave = { ...data, status: decapitalizeStatus(data.status!) };
    try {
      await makeApiRequest(
        `/appointments/${appointmentId}`,
        "PATCH",
        dataToSave
      );
      toast.success("Appointment updated successfully!");
      fetchData();
      setIsEditAppointmentModalOpen(false);
    } catch (e: unknown) {
      toast.error(
        e instanceof Error ? e.message : "Failed to save appointment."
      );
    }
  };

  const handleSaveClient = async (userId: string, userData: Partial<User>) => {
    try {
      const updatedUser = await makeApiRequest(
        `/users/${userId}`,
        "PATCH",
        userData
      );
      toast.success(`User details for "${userData.name}" updated.`);
      setAllUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updatedUser } : u))
      );
      // If the admin is editing their own profile, update the context
      if (user?.id === userId) {
        updateUserContext(updatedUser);
      }
      setIsEditClientModalOpen(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save user.");
    }
  };

  /**
   * @function handleDeleteItem
   * @description Handles the deletion of an item after confirmation.
   * @param {string} id - The ID of the item to delete.
   * @param {string} type - The type of the item ('product', 'client', etc.).
   */
  const handleDeleteItem = async (id: string, type: string) => {
    const endpointMap: { [key: string]: string } = {
      product: "products",
      service: "services",
      appointment: "appointments",
      client: "users",
    };
    const endpoint = endpointMap[type];

    // Prevent admin from deleting their own account from the list.
    if (type === "client" && user?.id === id) {
      toast.error("You cannot delete your own user account.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete this ${type}? This action cannot be undone.`
      )
    )
      return;

    try {
      await makeApiRequest(`/${endpoint}/${id}`, "DELETE");
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`
      );
      fetchData(); // Refresh data after deletion
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : `Failed to delete ${type}.`);
    }
  };

  // Filtering logic based on the search term for each tab
  const lowerSearchTerm = searchTerm.toLowerCase();
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(lowerSearchTerm)
  );
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(lowerSearchTerm)
  );
  const filteredClients = allUsers.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerSearchTerm) ||
      c.email.toLowerCase().includes(lowerSearchTerm)
  );
  const filteredAppointments = appointments.filter(
    (a) =>
      a.clientName?.toLowerCase().includes(lowerSearchTerm) ||
      a.serviceName?.toLowerCase().includes(lowerSearchTerm) ||
      a.date.includes(lowerSearchTerm) ||
      a.status.toLowerCase().includes(lowerSearchTerm)
  );

  // Conditional rendering for loading, access denied, and error states.
  if (loadingData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading administrative data...</p>
        </main>
        <Footer />
      </div>
    );
  }
  if (user !== undefined && !isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Access Denied.</p>
        </main>
        <Footer />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex-grow">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setSearchTerm("");
          }}
          className="w-full"
        >
          {/* Header containing tabs, search bar, and add button */}
          <AdminDashboardHeader
            activeTab={activeTab}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onAddItem={() => handleOpenNewItemModal(activeTab)}
          />

          {/* Content for each tab */}
          <TabsContent value="products" className="mt-0">
            <ProductManagementTab
              products={filteredProducts}
              onEdit={(product) => handleOpenEditModal(product, "product")}
              onDelete={(productId) => handleDeleteItem(productId, "product")}
            />
          </TabsContent>
          <TabsContent value="services" className="mt-0">
            <ServiceManagementTab
              services={filteredServices}
              onEdit={(service) => handleOpenEditModal(service, "service")}
              onDelete={(serviceId) => handleDeleteItem(serviceId, "service")}
            />
          </TabsContent>
          <TabsContent value="clients" className="mt-0">
            <ClientManagementTab
              clients={filteredClients as Client[]}
              onEdit={(client) => handleOpenEditModal(client, "client")}
              onDelete={(clientId) => handleDeleteItem(clientId, "client")}
            />
          </TabsContent>
          <TabsContent value="appointments" className="mt-0">
            <AppointmentManagementTab
              appointments={filteredAppointments}
              onEdit={(appointment) =>
                handleOpenEditModal(appointment, "appointment")
              }
              onDelete={(appointmentId) =>
                handleDeleteItem(appointmentId, "appointment")
              }
            />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Modals for editing and creating items */}
      <EditProductModal
        isOpen={isEditProductModalOpen}
        onOpenChange={setIsEditProductModalOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
      <EditServiceModal
        isOpen={isEditServiceModalOpen}
        onOpenChange={setIsEditServiceModalOpen}
        service={editingService}
        onSave={handleSaveService}
      />
      <EditClientModal
        isOpen={isEditClientModalOpen}
        onOpenChange={setIsEditClientModalOpen}
        client={editingClient}
        onSave={handleSaveClient}
      />
      <EditAppointmentModal
        isOpen={isEditAppointmentModalOpen}
        onOpenChange={setIsEditAppointmentModalOpen}
        appointment={editingAppointment}
        onSave={handleSaveAppointment}
      />
    </div>
  );
}
