// app/components/sections/admin/AdminDashboardClient.tsx
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

// Importa TODAS as actions que vamos usar
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

export default function AdminDashboardClient({
  initialProducts,
  initialServices,
  initialClients,
  initialAppointments,
}: AdminDashboardClientProps) {
  // Estados para UI: aba ativa e termo de busca
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para os modais e item em edição
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Funções para abrir os modais
  const openModal = (item: any, type: string) => {
    setEditingItem(item);
    if (type === 'product') setIsProductModalOpen(true);
    if (type === 'service') setIsServiceModalOpen(true);
    if (type === 'client') setIsClientModalOpen(true);
    if (type === 'appointment') setIsAppointmentModalOpen(true);
  };

  const openNewModal = (type: string) => {
    openModal(null, type.slice(0, -1)); // ex: 'products' -> 'product'
  };

  // Funções de "Salvar" que agora chamam as Server Actions
  const handleSaveProduct = async (data: Partial<ProductType>) => {
    const result = await saveProduct(data);
    if (result.success) toast.success(result.message); else toast.error(result.message);
    setIsProductModalOpen(false);
  };
  const handleSaveService = async (data: Partial<ServiceType>) => {
    const result = await saveService(data);
    if (result.success) toast.success(result.message); else toast.error(result.message);
    setIsServiceModalOpen(false);
  };
  const handleSaveClient = async (id: string, data: Partial<User>) => {
    const result = await updateUser(id, data);
    if (result.success) toast.success(result.message); else toast.error(result.message);
    setIsClientModalOpen(false);
  };
  const handleSaveAppointment = async (id: string, data: Partial<Appointment>) => {
    const result = await updateAppointment(id, data);
    if (result.success) toast.success(result.message); else toast.error(result.message);
    setIsAppointmentModalOpen(false);
  };

  // Função de "Deletar" que chama a Server Action
  const handleDelete = async (id: string, type: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    let result;
    if (type === 'product') result = await deleteProduct(id);
    if (type === 'service') result = await deleteService(id);
    if (type === 'client') result = await deleteUser(id);
    if (type === 'appointment') result = await deleteAppointment(id);
    
    if (result?.success) toast.success(result.message); else toast.error(result?.message || "Action failed.");
  };

  // Lógica de filtragem
  const lowerSearchTerm = searchTerm.toLowerCase();
  const filteredProducts = initialProducts.filter(p => p.name.toLowerCase().includes(lowerSearchTerm));
  const filteredServices = initialServices.filter(s => s.name.toLowerCase().includes(lowerSearchTerm));
  const filteredClients = initialClients.filter(c => c.name.toLowerCase().includes(lowerSearchTerm) || c.email.toLowerCase().includes(lowerSearchTerm));
  const filteredAppointments = initialAppointments.filter(a => (a as any).user?.name.toLowerCase().includes(lowerSearchTerm) || (a as any).service?.name.toLowerCase().includes(lowerSearchTerm));

  return (
    <Tabs value={activeTab} onValueChange={value => { setActiveTab(value); setSearchTerm(""); }}>
      <AdminDashboardHeader
        activeTab={activeTab}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onAddItem={() => openNewModal(activeTab)}
      />
      <TabsContent value="products">
        <ProductManagementTab products={filteredProducts} onEdit={item => openModal(item, 'product')} onDelete={id => handleDelete(id, 'product')} />
      </TabsContent>
      <TabsContent value="services">
        <ServiceManagementTab services={filteredServices} onEdit={item => openModal(item, 'service')} onDelete={id => handleDelete(id, 'service')} />
      </TabsContent>
      <TabsContent value="clients">
        <ClientManagementTab clients={filteredClients} onEdit={item => openModal(item, 'client')} onDelete={id => handleDelete(id, 'client')} />
      </TabsContent>
      <TabsContent value="appointments">
        <AppointmentManagementTab appointments={filteredAppointments} onEdit={item => openModal(item, 'appointment')} onDelete={id => handleDelete(id, 'appointment')} />
      </TabsContent>

      {/* Modais */}
      <EditProductModal isOpen={isProductModalOpen} onOpenChange={setIsProductModalOpen} product={editingItem} onSave={handleSaveProduct} />
      <EditServiceModal isOpen={isServiceModalOpen} onOpenChange={setIsServiceModalOpen} service={editingItem} onSave={handleSaveService} />
      <EditClientModal isOpen={isClientModalOpen} onOpenChange={setIsClientModalOpen} client={editingItem} onSave={handleSaveClient} />
      <EditAppointmentModal isOpen={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen} appointment={editingItem} onSave={handleSaveAppointment} />
    </Tabs>
  );
}