import { 
  Admin, 
  Client, 
  ProductType, 
  ServiceType,
  Appointment,
  Order,
  InventoryItem
} from "../types";

// Mock Admins
export const mockAdmins: Admin[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@barbershop.com",
    phone: "555-1234",
    role: "admin"
  }
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "555-5678",
    role: "client",
    address: "123 Main St"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "555-9876",
    role: "client",
    address: "456 Oak Ave"
  }
];

// Mock Products
export const mockProducts: ProductType[] = [
  {
    id: 1,
    name: "Premium Hair Pomade",
    description: "High-quality styling pomade with medium hold and matte finish",
    price: 24.99,
    quantity: 50,
    soldQuantity: 25,
    image: "/products/pomade.jpg",
    type: "product"
  },
  {
    id: 2,
    name: "Beard Oil",
    description: "Nourishing beard oil with natural oils",
    price: 18.99,
    quantity: 35,
    soldQuantity: 15,
    image: "/products/beard-oil.jpg",
    type: "product"
  }
];

// Mock Services
export const mockServices: ServiceType[] = [
  {
    id: 1,
    name: "Classic Haircut",
    description: "Traditional haircut including consultation and styling",
    price: 30,
    duration: 30,
    image: "/services/haircut.jpg",
    icon: "✂️",
    type: "service"
  },
  {
    id: 2,
    name: "Beard Trim",
    description: "Shape and trim beard for a clean look",
    price: 20,
    duration: 20,
    image: "/services/beard-trim.jpg",
    icon: "🧔",
    type: "service"
  }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 1,
    clientId: 1,
    serviceId: 1,
    date: "2023-06-15",
    startTime: "14:00",
    endTime: "14:30",
    status: "scheduled"
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 1,
    clientId: 1,
    items: [
      {
        id: 1,
        productId: 1,
        quantity: 2,
        unitPrice: 24.99
      }
    ],
    totalAmount: 49.98,
    date: "2023-06-10",
    status: "completed"
  }
];

// Combined exports
export const mockInventory: InventoryItem[] = [...mockProducts, ...mockServices];