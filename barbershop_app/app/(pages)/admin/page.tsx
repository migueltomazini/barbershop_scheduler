'use client';

import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/app/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/app/components/ui/dialog";

import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";

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

// Define ProductType matching your db.json structure
interface ProductType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  soldQuantity: number;
  image?: string;
  description?: string;
}

// Define other types as needed (ServiceType, ClientType)
interface ServiceType { id: number; name: string; price: number; duration: string; }
interface ClientType { id: string; name: string; email: string; phone: string; address?: string; }


export default function Admin() {
  const { isAdmin } = useAuth();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]); 
  const [clients, setClients] = useState<ClientType[]>([]);   
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");

  // State for Edit Product Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [newStock, setNewStock] = useState<number>(0);


  // Fetch data from json-server
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, servicesRes, clientsRes] = await Promise.all([
          fetch("http://localhost:3001/products"),
          fetch("http://localhost:3001/services"),
          fetch("http://localhost:3001/clients"), 
        ]);

        if (!productsRes.ok) throw new Error('Failed to fetch products');
        const productsData = await productsRes.json();
        setProducts(productsData);

        // Handle services and clients similarly if you fetch them
        if (servicesRes.ok) setServices(await servicesRes.json());
        if (clientsRes.ok) setClients(await clientsRes.json());

      } catch (err: any) {
        setError(err.message || "Failed to load data");
        toast.error(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin) { 
        fetchData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    if (typeof window !== 'undefined') { 
        redirect("/");
    }
    return null; 
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteItem = async (id: number | string, type: string) => {
    const endpointMap: { [key: string]: string } = {
        product: "products",
        service: "services",
        client: "clients",
    };
    const endpoint = endpointMap[type];
    if (!endpoint) {
        toast.error("Invalid item type for deletion.");
        return;
    }

    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
        const response = await fetch(`http://localhost:3001/${endpoint}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Failed to delete ${type}`);
        }
        if (type === "product") setProducts(products.filter(p => p.id !== id));
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
    } catch (err: any) {
        toast.error(err.message || `Error deleting ${type}.`);
    }
  };

  const handleOpenEditModal = (product: ProductType) => {
    setEditingProduct(product);
    setNewStock(product.quantity);
    setIsEditModalOpen(true);
  };

  const handleSaveStock = async () => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`http://localhost:3001/products/${editingProduct.id}`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newStock }), 
      });

      if (!response.ok) {
        throw new Error("Failed to update stock");
      }
      const updatedProduct = await response.json();
      // Update local state with the response from server
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      toast.success("Stock updated successfully!");
      setIsEditModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      toast.error(err.message || "Error updating stock.");
    }
  };

  const handleAddItem = (type: string) => {
    // Placeholder for navigating to an "add new item" page or opening an "add" modal
    toast.info(`Navigate to add new ${type} page/modal`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading admin data...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><p>Error: {error}. Please ensure json-server is running.</p></div>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 font-serif text-barber-brown">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={(value) => {setActiveTab(value); setSearchTerm("");}} className="w-full">
          <TabsList className="w-full mb-8 bg-barber-cream grid grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="products" className="flex-1 data-[state=active]:bg-barber-brown data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="services" className="flex-1 data-[state=active]:bg-barber-brown data-[state=active]:text-white">
              <Scissors className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex-1 data-[state=active]:bg-barber-brown data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex-1 data-[state=active]:bg-barber-brown data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="pl-10 border-barber-cream w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => handleAddItem(activeTab.slice(0, -1))}
              className="bg-barber-brown hover:bg-barber-dark-brown w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab.slice(0, -1)}
            </Button>
          </div>

          <TabsContent value="products" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-barber-cream text-left">
                  <tr>
                    <th className="p-3 sm:p-4 font-semibold">Name</th>
                    <th className="p-3 sm:p-4 font-semibold">Price</th>
                    <th className="p-3 sm:p-4 font-semibold">Stock</th>
                    <th className="p-3 sm:p-4 font-semibold">Sold</th>
                    <th className="p-3 sm:p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-barber-cream">
                  {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                    <tr key={product.id.toString()}>
                      <td className="p-3 sm:p-4">{product.name}</td>
                      <td className="p-3 sm:p-4">${product.price.toFixed(2)}</td>
                      <td className="p-3 sm:p-4">{product.quantity}</td>
                      <td className="p-3 sm:p-4">{product.soldQuantity}</td>
                      <td className="p-3 sm:p-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEditModal(product)}
                            className="text-barber-navy border-barber-navy hover:bg-barber-navy hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(product.id, "product")}
                            className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="text-center p-8 text-muted-foreground">No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ... (TabsContent for services, clients, appointments - keep as is or adapt to fetch data) ... */}
          <TabsContent value="services" className="mt-0">
            {/* Similar table structure for services */}
             <div className="text-center p-8 text-muted-foreground">Services management coming soon.</div>
          </TabsContent>
          <TabsContent value="clients" className="mt-0">
            {/* Similar table structure for clients */}
             <div className="text-center p-8 text-muted-foreground">Clients management coming soon.</div>
          </TabsContent>
           <TabsContent value="appointments" className="mt-0">
            <div className="flex justify-center items-center p-16 bg-white rounded-lg shadow-sm">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-barber-brown mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Appointment Management</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  This section will allow you to manage all scheduled appointments.
                </p>
              </div>
            </div>
          </TabsContent>


        </Tabs>
      </div>
      <Footer />

      {/* Edit Product Stock Modal */}
      {editingProduct && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Stock for {editingProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="stockQuantity" className="block mb-2">
                New Stock Quantity:
              </Label>
              <Input
                id="stockQuantity"
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="border-barber-cream"
                min="0"
              />
              <p className="text-sm text-muted-foreground mt-1">Current stock: {editingProduct.quantity}</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveStock} className="bg-barber-brown hover:bg-barber-dark-brown">Save Stock</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}