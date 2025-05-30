// User types
export type UserRole = "client" | "admin";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface Admin extends BaseUser {
  role: "admin";
}

export interface Client extends BaseUser {
  role: "client";
  address: string;
}

// Product/Service types
export interface ProductType {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;        // Current stock
  soldQuantity?: number;   // Optional tracking
  image: string;
  type: "product";
}

export interface ServiceType {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;  // in minutes
  image: string;
  icon?: string;     // Optional icon for UI
  type: "service";
}

// Combined inventory type
export type InventoryItem = ProductType | ServiceType;

// Appointment types
export interface Appointment {
  id: number;
  clientId: number;
  clientName?: string;
  serviceId: number;
  serviceName?: string;
  date: string;       // ISO date string
  time: string;
  status: "scheduled" | "completed" | "cancelled" | "pending";
}

// Order types
export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  clientId: number;
  items: OrderItem[];
  totalAmount: number;
  date: string;       // ISO date string
  status: "pending" | "completed" | "cancelled";
}