// app/(pages)/admin/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/app/contexts/AuthContext";

// ... (other imports remain the same)
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import { AdminDashboardHeader } from "@/app/components/sections/admin/adminDashboardHeader";
import { ClientManagementTab } from "@/app/components/sections/admin/clientManagementTab";
import { EditClientModal } from "@/app/components/sections/admin/editClientModal";
// ... (the rest of your component imports)
import { ProductType, ServiceType, Client, Appointment, User } from "@/app/types";
import { Tabs, TabsContent } from "@/app/components/ui/tabs";
import { AppointmentManagementTab } from "@/app/components/sections/admin/appointmentManagementTab";
import { EditAppointmentModal } from "@/app/components/sections/admin/editAppointmentModal";
import { EditProductModal } from "@/app/components/sections/admin/editProductModal";
import { EditServiceModal } from "@/app/components/sections/admin/editServiceModal";
import { ProductManagementTab } from "@/app/components/sections/admin/productManagementTab";
import { ServiceManagementTab } from "@/app/components/sections/admin/serviceManagementTab";


const API_BASE_URL = "http://localhost:3001";

// ... (helper functions decapitalizeStatus remain the same)
const decapitalizeStatus = (status: string): Appointment["status"] => {
    const lower = status.toLowerCase();
    if (["scheduled", "completed", "cancelled", "pending"].includes(lower)) {
      return lower as Appointment["status"];
    }
    return "pending";
};

export default function AdminPage() {
  const { isAdmin, user, updateUserContext } = useAuth(); // Get updateUserContext
  const router = useRouter();

  // State variables
  const [products, setProducts] = useState<ProductType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]); // Store all users
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // ... (other state variables remain the same)
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [editingClient, setEditingClient] = useState<User | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // ... (useEffect for redirecting non-admins remains the same)
  useEffect(() => {
    if (user !== undefined && !isAdmin) {
      toast.error("Access Denied. Redirecting to home page.");
      router.push("/");
    }
  }, [isAdmin, user, router]);

  // Callback to fetch all administrative data
  const fetchData = useCallback(async () => {
    if (!isAdmin && user !== undefined) {
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    setError(null);
    try {
      const [productsRes, servicesRes, appointmentsRes, usersRes] = await Promise.all([
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
      const message = err instanceof Error ? err.message : "Failed to load data.";
      setError(message);
      toast.error(message);
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin, user]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    } else if (user !== undefined && !isAdmin) {
      setLoadingData(false);
    }
  }, [fetchData, isAdmin, user]);

  // ... (makeApiRequest function remains the same)
  const makeApiRequest = async (endpoint: string, method: "POST" | "PATCH" | "DELETE" | "PUT", body?: unknown) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return method !== "DELETE" ? await response.json() : true;
  };

  // --- Modal Openers ---
  const handleOpenEditModal = (item: any, type: string) => {
    switch (type) {
      // ... (cases for product, service, appointment)
      case "product": setEditingProduct(item); setIsEditProductModalOpen(true); break;
      case "service": setEditingService(item); setIsEditServiceModalOpen(true); break;
      case "appointment": setEditingAppointment(item); setIsEditAppointmentModalOpen(true); break;
      case "client":
        setEditingClient(item);
        setIsEditClientModalOpen(true);
        break;
      default: break;
    }
  };
  
  // ... (handleOpenNewItemModal remains the same)
  const handleOpenNewItemModal = (type: string) => {
    switch (type) {
      case 'products': setEditingProduct(null); setIsEditProductModalOpen(true); break;
      case 'services': setEditingService(null); setIsEditServiceModalOpen(true); break;
      default: toast.info(`Add new ${type.slice(0, -1)} functionality not implemented yet.`); break;
    }
  };

  // --- Handlers ---
  // ... (handleSaveProduct, handleSaveService, handleSaveAppointment remain the same)
  const handleSaveProduct = async (productData: Omit<ProductType, "type">) => {
    const { id, ...data } = productData;
    const isNew = !id;
    try {
      const savedProduct = await makeApiRequest(isNew ? "/products" : `/products/${id}`, isNew ? "POST" : "PUT", { ...data, type: 'product' });
      toast.success(`Product ${isNew ? 'created' : 'updated'} successfully!`);
      fetchData(); // Refetch all data to ensure consistency
      setIsEditProductModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save product.');
    }
  };
  const handleSaveService = async (serviceData: Partial<ServiceType>) => {
    const { id, ...data } = serviceData;
    const isNew = !id;
    try {
      const savedService = await makeApiRequest(isNew ? "/services" : `/services/${id}`, isNew ? "POST" : "PUT", { ...data, type: 'service' });
      toast.success(`Service ${isNew ? 'created' : 'updated'} successfully!`);
      fetchData();
      setIsEditServiceModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save service.');
    }
  };
  const handleSaveAppointment = async (appointmentId: string, data: Partial<Appointment>) => {
    const dataToSave = { ...data, status: decapitalizeStatus(data.status!) };
    try {
      await makeApiRequest(`/appointments/${appointmentId}`, "PATCH", dataToSave);
      toast.success("Appointment updated successfully!");
      fetchData();
      setIsEditAppointmentModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save appointment.');
    }
  };
  
  const handleSaveClient = async (userId: string, userData: Partial<User>) => {
    try {
      const updatedUser = await makeApiRequest(`/users/${userId}`, "PATCH", userData);
      toast.success(`User details for "${userData.name}" updated.`);
      
      // Update the local state for all users
      setAllUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...updatedUser } : u));
      
      // Crucially, update the AuthContext if the modified user is the one logged in
      updateUserContext(updatedUser);
      
      setIsEditClientModalOpen(false);
    } catch (e: any) {
       toast.error(e.message || 'Failed to save user.');
    }
  };

  const handleDeleteItem = async (id: string, type: string) => {
    const endpointMap: { [key: string]: string } = {
      product: 'products', service: 'services', appointment: 'appointments', client: 'users'
    };
    const endpoint = endpointMap[type];
    if (user?.id === id) {
      toast.error("You cannot delete your own user account.");
      return;
    }
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      await makeApiRequest(`/${endpoint}/${id}`, "DELETE");
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      fetchData(); // Refetch data
    } catch(e: any) {
      toast.error(e.message || `Failed to delete ${type}.`);
    }
  };
  
  // Filtering logic
  const lowerSearchTerm = searchTerm.toLowerCase();
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(lowerSearchTerm));
  const filteredServices = services.filter(s => s.name.toLowerCase().includes(lowerSearchTerm));
  const filteredClients = allUsers.filter(c => c.name.toLowerCase().includes(lowerSearchTerm) || c.email.toLowerCase().includes(lowerSearchTerm));
  const filteredAppointments = appointments.filter(a => 
      a.clientName?.toLowerCase().includes(lowerSearchTerm) ||
      a.serviceName?.toLowerCase().includes(lowerSearchTerm) ||
      a.date.includes(lowerSearchTerm) ||
      a.status.toLowerCase().includes(lowerSearchTerm)
  );

  // ... (Loading, Error, and Return JSX remains largely the same)
  if (loadingData) { return <div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow flex items-center justify-center"><p>Loading administrative data...</p></main><Footer /></div>; }
  if (user !== undefined && !isAdmin) { return <div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow flex items-center justify-center"><p>Access Denied.</p></main><Footer /></div>; }
  if (error) { return <div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow flex items-center justify-center"><p>Error: {error}</p></main><Footer /></div>; }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex-grow">
        <Tabs value={activeTab} onValueChange={value => { setActiveTab(value); setSearchTerm(""); }} className="w-full">
          <AdminDashboardHeader activeTab={activeTab} searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onAddItem={() => handleOpenNewItemModal(activeTab)}/>
          <TabsContent value="products" className="mt-0">
            <ProductManagementTab products={filteredProducts} onEdit={product => handleOpenEditModal(product, 'product')} onDelete={productId => handleDeleteItem(productId, 'product')}/>
          </TabsContent>
          <TabsContent value="services" className="mt-0">
            <ServiceManagementTab services={filteredServices} onEdit={service => handleOpenEditModal(service, 'service')} onDelete={serviceId => handleDeleteItem(serviceId, 'service')}/>
          </TabsContent>
          <TabsContent value="clients" className="mt-0">
            <ClientManagementTab clients={filteredClients as Client[]} onEdit={client => handleOpenEditModal(client, 'client')} onDelete={clientId => handleDeleteItem(clientId, 'client')}/>
          </TabsContent>
          <TabsContent value="appointments" className="mt-0">
            <AppointmentManagementTab appointments={filteredAppointments} onEdit={appointment => handleOpenEditModal(appointment, 'appointment')} onDelete={appointmentId => handleDeleteItem(appointmentId, 'appointment')}/>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      <EditProductModal isOpen={isEditProductModalOpen} onOpenChange={setIsEditProductModalOpen} product={editingProduct} onSave={handleSaveProduct}/>
      <EditServiceModal isOpen={isEditServiceModalOpen} onOpenChange={setIsEditServiceModalOpen} service={editingService} onSave={handleSaveService}/>
      <EditClientModal isOpen={isEditClientModalOpen} onOpenChange={setIsEditClientModalOpen} client={editingClient} onSave={handleSaveClient}/>
      <EditAppointmentModal isOpen={isEditAppointmentModalOpen} onOpenChange={setIsEditAppointmentModalOpen} appointment={editingAppointment} onSave={handleSaveAppointment}/>
    </div>
  );
}