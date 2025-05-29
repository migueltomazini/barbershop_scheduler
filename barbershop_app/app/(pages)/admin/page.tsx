// app/(pages)/admin/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format, parseISO } from "date-fns"; // For date formatting

import { useAuth, MockUserWithPassword } from "@/app/contexts/AuthContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/app/components/ui/dialog";

import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";

import {
  Users,
  Package,
  Scissors,
  Calendar as CalendarIconLucide,
  Edit,
  Trash,
  Plus,
  Search,
} from "lucide-react";

// --- TYPE DEFINITIONS ---
interface ProductType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  soldQuantity?: number;
  image?: string;
  description?: string;
}

interface ServiceType {
  id: number;
  name: string;
  price: number;
  duration: string;
  description?: string;
  icon?: string;
  image?: string;
}

interface ClientType {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "admin";
  address?: string;
}

interface AppointmentType {
  id: number | string;
  clientId: string;
  clientName?: string;
  serviceId: number;
  serviceName?: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "Pending";
  notes?: string;
}

const API_BASE_URL = "http://localhost:3001";

export default function Admin() {
  // Correct component name
  const { isAdmin, user, mockUsers: allAuthUsers } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );
  const [newStock, setNewStock] = useState<number>(0);

  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(
    null
  );
  const [serviceForm, setServiceForm] = useState<Partial<ServiceType>>({
    name: "",
    price: 0,
    duration: "",
  });

  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientType | null>(null);
  const [clientForm, setClientForm] = useState<Partial<ClientType>>({});

  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] =
    useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<AppointmentType | null>(null);
  const [appointmentForm, setAppointmentForm] = useState<
    Partial<AppointmentType>
  >({});

  useEffect(() => {
    if (user !== undefined) {
      if (!isAdmin) {
        toast.error("Access Denied. Redirecting to home page.");
        router.push("/");
      }
    }
  }, [isAdmin, user, router]);

  const fetchData = useCallback(async () => {
    if (!isAdmin) {
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    setError(null);
    try {
      const [productsRes, servicesRes, appointmentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/services`),
        fetch(`${API_BASE_URL}/appointments`),
      ]);

      if (!productsRes.ok) throw new Error("Failed to fetch products");
      setProducts(await productsRes.json());
      if (!servicesRes.ok) throw new Error("Failed to fetch services");
      setServices(await servicesRes.json());
      if (!appointmentsRes.ok) throw new Error("Failed to fetch appointments"); // Check appointments response
      setAppointments(await appointmentsRes.json());

      if (allAuthUsers) {
        const clientUsers = allAuthUsers
          .filter((u: MockUserWithPassword) => u.role === "client")
          .map((u: MockUserWithPassword) => {
            const { password, ...clientData } = u;
            return clientData as ClientType;
          });
        setClients(clientUsers);
      } else {
        console.warn(
          "Client data (allAuthUsers) not available from AuthContext."
        );
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to load data. Ensure json-server is running.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin, allAuthUsers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filterByName = (item: { name: string }, term: string) =>
    item.name.toLowerCase().includes(term.toLowerCase());
  const filteredProducts = products.filter((p) => filterByName(p, searchTerm));
  const filteredServices = services.filter((s) => filterByName(s, searchTerm));
  const filteredClients = clients.filter(
    (c) =>
      filterByName(c, searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredAppointments = appointments.filter(
    (a) =>
      (a.clientName &&
        a.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.serviceName &&
        a.serviceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      a.date.includes(searchTerm)
  );

  const makeApiRequest = async (
    endpoint: string,
    method: string,
    body?: any,
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
    } catch (err: any) {
      toast.error(err.message || `Error performing action.`);
      throw err;
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
  const handleOpenEditProductModal = (product: ProductType) => {
    setEditingProduct(product);
    setNewStock(product.quantity);
    setIsEditProductModalOpen(true);
  };
  const handleSaveProductStock = async () => {
    if (!editingProduct) return;
    const updatedProduct = await makeApiRequest(
      `/products/${editingProduct.id}`,
      "PATCH",
      { quantity: newStock, soldQuantity: editingProduct.soldQuantity || 0 },
      "Product stock updated successfully!"
    );
    if (updatedProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setIsEditProductModalOpen(false);
      setEditingProduct(null);
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
  const handleOpenEditServiceModal = (service: ServiceType) => {
    setEditingService(service);
    setServiceForm({
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description,
    });
    setIsEditServiceModalOpen(true);
  };
  const handleServiceFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };
  const handleSaveService = async () => {
    if (
      !editingService ||
      !serviceForm.name ||
      serviceForm.price == null ||
      !serviceForm.duration
    ) {
      toast.error("Please fill all required service fields.");
      return;
    }
    const serviceDataToSave: Partial<ServiceType> = {
      name: serviceForm.name,
      price: Number(serviceForm.price),
      duration: serviceForm.duration,
      description: serviceForm.description || "",
    };
    const updatedService = await makeApiRequest(
      `/services/${editingService.id}`,
      "PATCH",
      serviceDataToSave,
      "Service updated successfully!"
    );
    if (updatedService) {
      setServices((prev) =>
        prev.map((s) => (s.id === updatedService.id ? updatedService : s))
      );
      setIsEditServiceModalOpen(false);
      setEditingService(null);
      setServiceForm({ name: "", price: 0, duration: "", description: "" });
    }
  };

  const handleOpenEditClientModal = (client: ClientType) => {
    setEditingClient(client);
    setClientForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setIsEditClientModalOpen(true);
  };
  const handleClientFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveClient = async () => {
    if (!editingClient || !clientForm.name || !clientForm.email) {
      toast.error("Client name and email are required.");
      return;
    }
    const updatedClients = clients.map((c) =>
      c.id === editingClient.id ? { ...c, ...clientForm } : c
    );
    setClients(updatedClients);
    toast.success(
      `Client "${clientForm.name}" details updated locally (simulated).`
    );
    setIsEditClientModalOpen(false);
    setEditingClient(null);
  };
  const handleDeleteClient = async (clientId: string) => {
    if (!confirm(`Are you sure you want to delete client ${clientId}?`)) return;
    toast.info(`Client ${clientId} removed from local view (simulated).`);
    setClients((prev) => prev.filter((c) => c.id !== clientId));
  };

  const handleOpenEditAppointmentModal = (appointment: AppointmentType) => {
    setEditingAppointment(appointment);
    const formDate = appointment.date
      ? format(parseISO(appointment.date), "yyyy-MM-dd")
      : "";
    setAppointmentForm({ ...appointment, date: formDate });
    setIsEditAppointmentModalOpen(true);
  };
  const handleAppointmentFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setAppointmentForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveAppointment = async () => {
    if (
      !editingAppointment ||
      !appointmentForm.date ||
      !appointmentForm.time ||
      !appointmentForm.status
    ) {
      toast.error("Date, time, and status are required for appointments.");
      return;
    }
    const appointmentDataToSave: Partial<AppointmentType> = {
      date: appointmentForm.date,
      time: appointmentForm.time,
      status: appointmentForm.status as AppointmentType["status"],
      notes: appointmentForm.notes || "",
      // Preserve IDs and names not directly editable in this form
      clientId: editingAppointment.clientId,
      clientName: editingAppointment.clientName,
      serviceId: editingAppointment.serviceId,
      serviceName: editingAppointment.serviceName,
    };
    const updatedAppointment = await makeApiRequest(
      `/appointments/${editingAppointment.id}`,
      "PATCH",
      appointmentDataToSave,
      "Appointment updated successfully!"
    );
    if (updatedAppointment) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === updatedAppointment.id ? updatedAppointment : a
        )
      );
      setIsEditAppointmentModalOpen(false);
      setEditingAppointment(null);
      setAppointmentForm({});
    }
  };
  const handleDeleteAppointment = async (appointmentId: number | string) => {
    if (
      !confirm(`Are you sure you want to delete appointment ${appointmentId}?`)
    )
      return;
    await makeApiRequest(
      `/appointments/${appointmentId}`,
      "DELETE",
      undefined,
      "Appointment deleted successfully!"
    );
    setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
  };

  const handleGlobalAddItem = () => {
    const singularTabName = activeTab.endsWith("s")
      ? activeTab.slice(0, -1)
      : activeTab;
    toast.info(
      `Placeholder: Add new ${singularTabName}. Implement form/modal.`
    );
  };

  if (loadingData && !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }
  if (!isAdmin && !loadingData && user !== undefined) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Access Denied. Redirecting...</p>
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
          <p>Loading admin data...</p>
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
        <h1 className="text-3xl font-bold mb-8 font-serif text-barber-brown">
          Admin Dashboard
        </h1>
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setSearchTerm("");
          }}
          className="w-full"
        >
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={handleGlobalAddItem}
              className="bg-barber-brown hover:bg-barber-dark-brown w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab.endsWith("s") ? activeTab.slice(0, -1) : activeTab}
            </Button>
          </div>

          <TabsContent value="products" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-barber-cream text-left text-sm text-gray-700">
                  <tr>
                    <th className="p-3 sm:p-4 font-semibold">Name</th>
                    <th className="p-3 sm:p-4 font-semibold">Price</th>
                    <th className="p-3 sm:p-4 font-semibold">Stock</th>
                    <th className="p-3 sm:p-4 font-semibold">Sold</th>
                    <th className="p-3 sm:p-4 font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-barber-cream text-sm">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="p-3 sm:p-4 whitespace-nowrap">
                          {product.name}
                        </td>
                        <td className="p-3 sm:p-4">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="p-3 sm:p-4">{product.quantity}</td>
                        <td className="p-3 sm:p-4">
                          {product.soldQuantity || 0}
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleOpenEditProductModal(product)
                              }
                              className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center p-8 text-muted-foreground"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="services" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-barber-cream text-left text-sm text-gray-700">
                  <tr>
                    <th className="p-3 sm:p-4 font-semibold">Name</th>
                    <th className="p-3 sm:p-4 font-semibold">Price</th>
                    <th className="p-3 sm:p-4 font-semibold">Duration</th>
                    <th className="p-3 sm:p-4 font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-barber-cream text-sm">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <tr key={service.id}>
                        <td className="p-3 sm:p-4 whitespace-nowrap">
                          {service.name}
                        </td>
                        <td className="p-3 sm:p-4">
                          ${service.price.toFixed(2)}
                        </td>
                        <td className="p-3 sm:p-4">{service.duration}</td>
                        <td className="p-3 sm:p-4">
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleOpenEditServiceModal(service)
                              }
                              className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteService(service.id)}
                              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center p-8 text-muted-foreground"
                      >
                        No services found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="clients" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-barber-cream text-left text-sm text-gray-700">
                  <tr>
                    <th className="p-3 sm:p-4 font-semibold">Name</th>
                    <th className="p-3 sm:p-4 font-semibold">Email</th>
                    <th className="p-3 sm:p-4 font-semibold">Phone</th>
                    <th className="p-3 sm:p-4 font-semibold">Address</th>
                    <th className="p-3 sm:p-4 font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-barber-cream text-sm">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr key={client.id}>
                        <td className="p-3 sm:p-4 whitespace-nowrap">
                          {client.name}
                        </td>
                        <td className="p-3 sm:p-4 whitespace-nowrap">
                          {client.email}
                        </td>
                        <td className="p-3 sm:p-4">{client.phone}</td>
                        <td className="p-3 sm:p-4">
                          {client.address || "N/A"}
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEditClientModal(client)}
                              className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteClient(client.id)}
                              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center p-8 text-muted-foreground"
                      >
                        No clients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="appointments" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-barber-cream text-left text-sm text-gray-700">
                  <tr>
                    <th className="p-3 sm:p-4 font-semibold">Client</th>
                    <th className="p-3 sm:p-4 font-semibold">Service</th>
                    <th className="p-3 sm:p-4 font-semibold">Date</th>
                    <th className="p-3 sm:p-4 font-semibold">Time</th>
                    <th className="p-3 sm:p-4 font-semibold">Status</th>
                    <th className="p-3 sm:p-4 font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-barber-cream text-sm">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appt) => (
                      <tr key={appt.id}>
                        <td className="p-3 sm:p-4 whitespace-nowrap">
                          {appt.clientName}
                        </td>
                        <td className="p-3 sm:p-4 whitespace-nowrap">
                          {appt.serviceName}
                        </td>
                        <td className="p-3 sm:p-4">
                          {appt.date
                            ? format(parseISO(appt.date), "MM/dd/yyyy")
                            : "N/A"}
                        </td>
                        <td className="p-3 sm:p-4">{appt.time}</td>
                        <td className="p-3 sm:p-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              appt.status === "Scheduled"
                                ? "bg-blue-100 text-blue-700"
                                : appt.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : appt.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleOpenEditAppointmentModal(appt)
                              }
                              className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteAppointment(appt.id)}
                              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center p-8 text-muted-foreground"
                      >
                        No appointments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {editingProduct && (
        <Dialog
          open={isEditProductModalOpen}
          onOpenChange={setIsEditProductModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Stock for {editingProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <div>
                <Label htmlFor="productStockModalInput" className="block mb-1">
                  New Stock Quantity:
                </Label>
                <Input
                  id="productStockModalInput"
                  type="number"
                  value={newStock}
                  onChange={(e) =>
                    setNewStock(Math.max(0, parseInt(e.target.value, 10) || 0))
                  }
                  className="border-barber-cream"
                  min="0"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Current stock: {editingProduct.quantity}
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => setIsEditProductModalOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleSaveProductStock}
                className="bg-barber-brown hover:bg-barber-dark-brown"
              >
                Save Stock
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {editingService && (
        <Dialog
          open={isEditServiceModalOpen}
          onOpenChange={setIsEditServiceModalOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Service: {editingService.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="serviceFormNameModal"
                  className="text-right col-span-1"
                >
                  Name
                </Label>
                <Input
                  id="serviceFormNameModal"
                  name="name"
                  value={serviceForm.name || ""}
                  onChange={handleServiceFormChange}
                  className="col-span-3 border-barber-cream"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="serviceFormPriceModal"
                  className="text-right col-span-1"
                >
                  Price
                </Label>
                <Input
                  id="serviceFormPriceModal"
                  name="price"
                  type="number"
                  value={serviceForm.price || ""}
                  onChange={handleServiceFormChange}
                  className="col-span-3 border-barber-cream"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="serviceFormDurationModal"
                  className="text-right col-span-1"
                >
                  Duration
                </Label>
                <Input
                  id="serviceFormDurationModal"
                  name="duration"
                  value={serviceForm.duration || ""}
                  onChange={handleServiceFormChange}
                  className="col-span-3 border-barber-cream"
                  placeholder="e.g., 45 min"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label
                  htmlFor="serviceFormDescriptionModal"
                  className="text-right col-span-1 mt-1"
                >
                  Description
                </Label>
                <textarea
                  id="serviceFormDescriptionModal"
                  name="description"
                  value={serviceForm.description || ""}
                  onChange={handleServiceFormChange}
                  className="col-span-3 border-barber-cream rounded-md p-2 h-24 resize-none"
                  placeholder="Service description (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => setIsEditServiceModalOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleSaveService}
                className="bg-barber-brown hover:bg-barber-dark-brown"
              >
                Save Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {editingClient && (
        <Dialog
          open={isEditClientModalOpen}
          onOpenChange={setIsEditClientModalOpen}
        >
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Edit Client: {editingClient.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="clientFormNameModal"
                  className="text-right col-span-1"
                >
                  Name
                </Label>
                <Input
                  id="clientFormNameModal"
                  name="name"
                  value={clientForm.name || ""}
                  onChange={handleClientFormChange}
                  className="col-span-3 border-barber-cream"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="clientFormEmailModal"
                  className="text-right col-span-1"
                >
                  Email
                </Label>
                <Input
                  id="clientFormEmailModal"
                  name="email"
                  type="email"
                  value={clientForm.email || ""}
                  onChange={handleClientFormChange}
                  className="col-span-3 border-barber-cream"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="clientFormPhoneModal"
                  className="text-right col-span-1"
                >
                  Phone
                </Label>
                <Input
                  id="clientFormPhoneModal"
                  name="phone"
                  value={clientForm.phone || ""}
                  onChange={handleClientFormChange}
                  className="col-span-3 border-barber-cream"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="clientFormAddressModal"
                  className="text-right col-span-1"
                >
                  Address
                </Label>
                <Input
                  id="clientFormAddressModal"
                  name="address"
                  value={clientForm.address || ""}
                  onChange={handleClientFormChange}
                  className="col-span-3 border-barber-cream"
                  placeholder="Client's address (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => setIsEditClientModalOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleSaveClient}
                className="bg-barber-brown hover:bg-barber-dark-brown"
              >
                Save Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {editingAppointment && (
        <Dialog
          open={isEditAppointmentModalOpen}
          onOpenChange={setIsEditAppointmentModalOpen}
        >
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>
                Edit Appointment for {editingAppointment.clientName}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-1">Client</Label>
                <p className="col-span-3 font-medium">
                  {appointmentForm.clientName || editingAppointment.clientName}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-1">Service</Label>
                <p className="col-span-3 font-medium">
                  {appointmentForm.serviceName ||
                    editingAppointment.serviceName}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="apptFormDateModal"
                  className="text-right col-span-1"
                >
                  Date
                </Label>
                <Input
                  id="apptFormDateModal"
                  name="date"
                  type="date"
                  value={appointmentForm.date || ""}
                  onChange={handleAppointmentFormChange}
                  className="col-span-3 border-barber-cream"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="apptFormTimeModal"
                  className="text-right col-span-1"
                >
                  Time
                </Label>
                <Input
                  id="apptFormTimeModal"
                  name="time"
                  type="time"
                  value={appointmentForm.time || ""}
                  onChange={handleAppointmentFormChange}
                  className="col-span-3 border-barber-cream"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="apptFormStatusModal"
                  className="text-right col-span-1"
                >
                  Status
                </Label>
                <select
                  id="apptFormStatusModal"
                  name="status"
                  value={appointmentForm.status || ""}
                  onChange={handleAppointmentFormChange}
                  className="col-span-3 border-barber-cream rounded-md p-2 h-10 focus:ring-barber-gold focus:border-barber-gold"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label
                  htmlFor="apptFormNotesModal"
                  className="text-right col-span-1 mt-1"
                >
                  Notes
                </Label>
                <textarea
                  id="apptFormNotesModal"
                  name="notes"
                  value={appointmentForm.notes || ""}
                  onChange={handleAppointmentFormChange}
                  className="col-span-3 border-barber-cream rounded-md p-2 h-20 resize-none"
                  placeholder="Appointment notes (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => setIsEditAppointmentModalOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleSaveAppointment}
                className="bg-barber-brown hover:bg-barber-dark-brown"
              >
                Save Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
