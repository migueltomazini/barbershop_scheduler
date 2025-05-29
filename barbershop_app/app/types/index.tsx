// User types
export type UserRole = "client" | "admin";

export interface BaseUser {
  id: number;
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
  serviceId: number;
  date: string;       // ISO date string
  startTime: string;  // "HH:MM" format
  endTime: string;    // "HH:MM" format
  status: "scheduled" | "completed" | "cancelled";
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