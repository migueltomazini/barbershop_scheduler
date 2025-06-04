"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth, MockUserWithPassword } from "@/app/contexts/AuthContext";

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

import { ProductType, ServiceType, Client, Appointment } from "@/app/types";

const API_BASE_URL = "http://localhost:3001";

// Helper function to capitalize the first letter of a status string
const capitalizeStatus = (
  status: Appointment["status"]
): Appointment["status"] => {
  if (!status) return "pending";
  const capitalized = status.charAt(0).toUpperCase() + status.slice(1);
  if (
    ["Scheduled", "Completed", "Cancelled", "Pending"].includes(capitalized)
  ) {
    return capitalized as Appointment["status"];
  }
  return "pending";
};

// Helper function to convert a status string to lowercase
const decapitalizeStatus = (
  status: Appointment["status"]
): Appointment["status"] => {
  if (!status) return "pending";
  const lower = status.toLowerCase();
  if (["scheduled", "completed", "cancelled", "pending"].includes(lower)) {
    return lower as Appointment["status"];
  }
  return "pending";
};

export default function AdminPage() {
  const { isAdmin, user, mockUsers: allAuthUsers } = useAuth();
  const router = useRouter();

  // State variables for managing different types of data
  const [products, setProducts] = useState<ProductType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // State variables for UI control and data fetching status
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");

  // State variables for product editing modal
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );

  // State variables for service editing modal
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(
    null
  );

  // State variables for client editing modal
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // State variables for appointment editing modal
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] =
    useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  // Effect to redirect non-admin users
  useEffect(() => {
    if (user !== undefined && !isAdmin) {
      toast.error("Access Denied. Redirecting to home page.");
      router.push("/");
    }
  }, [isAdmin, user, router]);

  // Callback to fetch all administrative data (products, services, appointments, clients)
  const fetchData = useCallback(async () => {
    if (!isAdmin && user !== undefined) {
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    setError(null);
    try {
      const [productsRes, servicesRes, appointmentsResFromAPI] =
        await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/services`),
          fetch(`${API_BASE_URL}/appointments`),
        ]);

      if (!productsRes.ok) throw new Error("Failed to fetch products");
      const productsData = await productsRes.json();
      setProducts(
        productsData.map((p: Record<string, unknown>) => ({
          ...p,
          type: "product",
        })) as ProductType[]
      );

      if (!servicesRes.ok) throw new Error("Failed to fetch services");
      const servicesData = await servicesRes.json();
      setServices(
        servicesData.map((s: { duration: string; [key: string]: unknown }) => ({
          ...s,
          duration: parseInt(s.duration, 10) || 0,
          type: "service",
        })) as ServiceType[]
      );

      if (!appointmentsResFromAPI.ok)
        throw new Error("Failed to fetch appointments");
      const appointmentsData = await appointmentsResFromAPI.json();
      setAppointments(
        appointmentsData.map(
          (a: {
            id: string | string;
            clientId: string | number;
            clientName?: string;
            serviceId: string | number;
            serviceName?: string;
            date: string;
            time?: string;
            status?: string;
            [key: string]: unknown;
          }): Appointment => ({
            id: a.id,
            clientId: Number(a.clientId),
            clientName: a.clientName || `Client ID: ${a.clientId}`,
            serviceId: Number(a.serviceId),
            serviceName: a.serviceName || `Service ID: ${a.serviceId}`,
            date: a.date,
            time: a.time || "",
            status:
              (a.status?.toLowerCase() as Appointment["status"]) || "scheduled",
          })
        )
      );

      if (allAuthUsers) {
        const manageableUsers = allAuthUsers.map(
          (u: MockUserWithPassword): Client => {
            const { password: _password, ...clientData } = u;
            void _password;
            return {
              ...clientData,
              id: String(clientData.id),
              name: clientData.name || `User ${clientData.id}`,
              email: clientData.email,
              phone: clientData.phone || "",
              role:
                clientData.role === "admin" || clientData.role === "client"
                  ? clientData.role
                  : "client",
              address: clientData.address || "",
            } as Client;
          }
        );
        setClients(manageableUsers);
      } else {
        console.warn(
          "Client data (allAuthUsers) not available from AuthContext."
        );
        setClients([]);
      }
    } catch (err: unknown) {
      let message = "Failed to load data. Check if json-server is running.";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin, allAuthUsers, user]);

  // Effect to trigger data fetching when admin status changes or on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchData();
    } else if (user !== undefined && !isAdmin) {
      setLoadingData(false);
    }
  }, [fetchData, isAdmin, user]);

  // Helper function for filtering items by name, email, or role
  const filterByNameOrEmail = (
    item: { name: string; email?: string; role?: string },
    term: string
  ) =>
    item.name.toLowerCase().includes(term.toLowerCase()) ||
    (item.email && item.email.toLowerCase().includes(term.toLowerCase())) ||
    (item.role && item.role.toLowerCase().includes(term.toLowerCase()));

  // Filtered lists for each tab based on search term
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredClients = clients.filter((c) =>
    filterByNameOrEmail(c, searchTerm)
  );

  // Filters appointments based on various fields
  const filteredAppointments = appointments.filter((a: Appointment) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      String(a.id).includes(lowerSearchTerm) ||
      String(a.clientId).includes(lowerSearchTerm) ||
      (a.clientName && a.clientName.toLowerCase().includes(lowerSearchTerm)) ||
      String(a.serviceId).includes(lowerSearchTerm) ||
      (a.serviceName &&
        a.serviceName.toLowerCase().includes(lowerSearchTerm)) ||
      a.date.includes(searchTerm) ||
      a.status.includes(lowerSearchTerm)
    );
  });

  // Transforms appointment data for the AppointmentManagementTab component
  const appointmentsForTab: Appointment[] = filteredAppointments.map(
    (appt: Appointment): Appointment => {
      return {
        id: appt.id,
        clientId: appt.clientId,
        clientName: appt.clientName || `Client ID: ${appt.clientId}`,
        serviceId: appt.serviceId,
        serviceName: appt.serviceName || `Service ID: ${appt.serviceId}`,
        date: appt.date,
        time: appt.time || "N/A",
        status: capitalizeStatus(appt.status),
      };
    }
  );

  // Generic function to make API requests
  const makeApiRequest = async (
    endpoint: string,
    method: string,
    body?: unknown,
    successMessage?: string
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : {},
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(
          errorData.message || `Failed to ${method.toLowerCase()} item`
        );
      }
      if (successMessage) toast.success(successMessage);
      return method !== "DELETE" ? await response.json() : true;
    } catch (err: unknown) {
      let message = `Error performing action.`;
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      toast.error(message);
    }
  };

  // --- Product Handlers ---
  const handleOpenEditProductModal = (product: ProductType) => {
    setEditingProduct(product);
    setIsEditProductModalOpen(true);
  };
  const handleSaveProductStock = async (
    productId: number,
    newStock: number,
    newPrice: number,
    currentSoldQuantity?: number
  ) => {
    const payloadForApi = {
      price: newPrice,
      quantity: newStock,
      soldQuantity: currentSoldQuantity || 0,
    };
    try {
      const updatedProductFromApi = await makeApiRequest(
        `/products/${productId}`,
        "PATCH",
        payloadForApi,
        "Product updated successfully!"
      );
      if (updatedProductFromApi) {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId ? { ...p, ...updatedProductFromApi } : p
          )
        );
        setEditingProduct(null);
        setIsEditProductModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to save product stock/price:", error);
    }
  };
  const handleDeleteProduct = async (productId: number) => {
    if (!confirm(`Are you sure you want to delete this product?`)) return;
    await makeApiRequest(
      `/products/${productId}`,
      "DELETE",
      undefined,
      "Product deleted successfully!"
    );
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // --- Service Handlers ---
  const handleOpenEditServiceModal = (service: ServiceType) => {
    setEditingService(service);
    setIsEditServiceModalOpen(true);
  };
  const handleSaveService = async (
    serviceId: number,
    serviceData: Partial<ServiceType>
  ) => {
    const serviceToUpdate = services.find((s) => s.id === serviceId);
    if (!serviceToUpdate) return;
    const dataToSave = {
      ...serviceToUpdate,
      ...serviceData,
      duration:
        Number(serviceData.duration) || Number(serviceToUpdate.duration),
      type: "service" as const,
    };
    const updatedService = await makeApiRequest(
      `/services/${serviceId}`,
      "PATCH",
      dataToSave,
      "Service updated successfully!"
    );
    if (updatedService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === updatedService.id
            ? {
                ...updatedService,
                type: "service",
                duration: Number(updatedService.duration),
              }
            : s
        )
      );
      setEditingService(null);
      setIsEditServiceModalOpen(false);
    }
  };
  const handleDeleteService = async (serviceId: number) => {
    if (!confirm(`Are you sure you want to delete this service?`)) return;
    await makeApiRequest(
      `/services/${serviceId}`,
      "DELETE",
      undefined,
      "Service deleted successfully!"
    );
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  // --- Client Handlers ---
  const handleOpenEditClientModal = (client: Client) => {
    setEditingClient(client);
    setIsEditClientModalOpen(true);
  };
  const handleSaveClient = async (
    clientId: string,
    clientData: Partial<Client>
  ) => {
    setClients((prevClients) =>
      prevClients.map((c) => {
        if (c.id === clientId) {
          const newRole = clientData.role || c.role;
          return {
            ...c,
            ...clientData,
            role: newRole,
          } as Client;
        }
        return c;
      })
    );
    const updatedClientName =
      clientData.name || clients.find((cl) => cl.id === clientId)?.name;
    toast.success(
      `Client "${updatedClientName}" details (including type/role) updated locally (simulated).`
    );
    setEditingClient(null);
    setIsEditClientModalOpen(false);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm(`Are you sure you want to delete this client?`)) return;
    toast.info(`Client ${clientId} removed from local view (simulated).`);
    setClients((prev) => prev.filter((c) => c.id !== clientId));
  };

  // --- Appointment Handlers ---
  const handleOpenEditAppointmentModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsEditAppointmentModalOpen(true);
  };

  const handleSaveAppointment = async (
    appointmentIdFromModal: number | string,
    dataFromModal: Partial<Appointment>
  ) => {
    if (
      !dataFromModal.date ||
      !dataFromModal.time ||
      dataFromModal.time === "N/A" ||
      !dataFromModal.status ||
      dataFromModal.clientId === undefined ||
      dataFromModal.serviceId === undefined
    ) {
      toast.error(
        "Valid date, time, status, client ID, and service ID are required."
      );
      return;
    }

    const dataToSaveForApi = {
      clientId: Number(dataFromModal.clientId),
      clientName: dataFromModal.clientName,
      serviceId: Number(dataFromModal.serviceId),
      serviceName: dataFromModal.serviceName,
      date: dataFromModal.date,
      time: dataFromModal.time,
      status: decapitalizeStatus(dataFromModal.status),
    };

    let method: "POST" | "PATCH";
    let endpoint: string;

    const existingAppointment = appointments.find(
      (a) => String(a.id) === String(appointmentIdFromModal)
    );

    if (
      existingAppointment &&
      !String(appointmentIdFromModal).startsWith("new-")
    ) {
      method = "PATCH";
      endpoint = `/appointments/${appointmentIdFromModal}`;
    } else {
      method = "POST";
      endpoint = "/appointments";
    }

    try {
      const savedAppointmentApi = await makeApiRequest(
        endpoint,
        method,
        dataToSaveForApi,
        `Appointment ${method === "POST" ? "created" : "updated"} successfully!`
      );

      if (savedAppointmentApi) {
        const finalSavedAppointment: Appointment = {
          id: savedAppointmentApi.id,
          clientId: Number(savedAppointmentApi.clientId),
          clientName:
            savedAppointmentApi.clientName ||
            `Client ID: ${savedAppointmentApi.clientId}`,
          serviceId: Number(savedAppointmentApi.serviceId),
          serviceName:
            savedAppointmentApi.serviceName ||
            `Service ID: ${savedAppointmentApi.serviceId}`,
          date: savedAppointmentApi.date,
          time: savedAppointmentApi.time || "",
          status:
            (savedAppointmentApi.status?.toLowerCase() as Appointment["status"]) ||
            "scheduled",
        };

        if (method === "POST") {
          setAppointments((prev) => [...prev, finalSavedAppointment]);
        } else {
          setAppointments((prev) =>
            prev.map((a) =>
              a.id === finalSavedAppointment.id ? finalSavedAppointment : a
            )
          );
        }
        setIsEditAppointmentModalOpen(false);
        setEditingAppointment(null);
      }
    } catch (error) {
      console.error("Failed to save appointment:", error);
    }
  };

  const handleDeleteAppointment = async (appointmentId: number | string) => {
    if (
      !confirm(`Are you sure you want to delete this appointment?`)
    )
      return;
    await makeApiRequest(
      `/appointments/${appointmentId}`,
      "DELETE",
      undefined,
      "Appointment deleted successfully!"
    );
    setAppointments((prev) =>
      prev.filter((a) => String(a.id) !== String(appointmentId))
    );
  };

  // Handles adding new items based on the active tab
  const handleGlobalAddItem = () => {
    const singularTabName =
      activeTab.endsWith("s") && activeTab !== "status"
        ? activeTab.slice(0, -1)
        : activeTab;

    if (singularTabName === "appointment") {
      const defaultClient = clients.length > 0 ? clients[0] : null;
      const defaultService = services.length > 0 ? services[0] : null;

      const newAppointmentShell: Appointment = {
        id: `new-${Date.now()}`,
        clientId: Number(defaultClient ? String(defaultClient.id) : ""),
        clientName: defaultClient ? defaultClient.name : "Select Client",
        serviceId: defaultService ? defaultService.id : 0,
        serviceName: defaultService ? defaultService.name : "Select Service",
        date: new Date().toISOString().split("T")[0],
        time: "12:00",
        status: "scheduled",
      };
      setEditingAppointment(newAppointmentShell);
      setIsEditAppointmentModalOpen(true);
    } else {
      toast.info(
        `Placeholder: Add new ${singularTabName}. Implement form/modal.`
      );
    }
  };

  // --- Loading and Error States ---
  if (loadingData && user === undefined) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Initializing dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }
  if (loadingData && isAdmin) {
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
  if (user !== undefined && !isAdmin && !loadingData) {
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
  if (!isAdmin && user !== undefined) {
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
          <AdminDashboardHeader
            activeTab={activeTab}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onAddItem={handleGlobalAddItem}
          />
          <TabsContent value="products" className="mt-0">
            <ProductManagementTab
              products={filteredProducts}
              onEdit={handleOpenEditProductModal}
              onDelete={handleDeleteProduct}
            />
          </TabsContent>
          <TabsContent value="services" className="mt-0">
            <ServiceManagementTab
              services={filteredServices}
              onEdit={handleOpenEditServiceModal}
              onDelete={handleDeleteService}
            />
          </TabsContent>
          <TabsContent value="clients" className="mt-0">
            <ClientManagementTab
              clients={filteredClients}
              onEdit={handleOpenEditClientModal}
              onDelete={handleDeleteClient}
            />
          </TabsContent>
          <TabsContent value="appointments" className="mt-0">
            <AppointmentManagementTab
              appointments={appointmentsForTab}
              onEdit={handleOpenEditAppointmentModal}
              onDelete={handleDeleteAppointment}
            />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Modals for editing different data types */}
      <EditProductModal
        isOpen={isEditProductModalOpen}
        onOpenChange={setIsEditProductModalOpen}
        product={editingProduct}
        onSave={handleSaveProductStock}
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
