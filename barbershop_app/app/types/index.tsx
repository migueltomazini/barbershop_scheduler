// app/types/index.ts

// User types
export type UserRole = "client" | "admin";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string; // Address is now optional on BaseUser
  password?: string; // Password can be part of the object
}

export interface Admin extends BaseUser {
  role: "admin";
}

export interface Client extends BaseUser {
  role: "client";
  address: string; // Address is required for a Client
}

// Export a general User type
export type User = Admin | Client;

// Product/Service types
export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;        // Current stock
  soldQuantity?: number;   // Optional tracking
  image: string;
  type: "product";
}

export interface ServiceType {
  id: string;
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
  id: string;
  clientId: string;
  clientName?: string;
  serviceId: string;
  serviceName?: string;
  date: string;       // ISO date string
  time: string;
  status: "scheduled" | "completed" | "cancelled" | "pending";
}

// Order types
export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  clientId: string;
  items: OrderItem[];
  totalAmount: number;
  date: string;       // ISO date string
  status: "pending" | "completed" | "cancelled";
}