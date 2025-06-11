// app/types/index.ts

// User types
export type UserRole = "client" | "admin";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  password?: string;
}

export interface Admin extends BaseUser {
  role: "admin";
}

export interface Client extends BaseUser {
  role: "client";
  address: string;
}

export type User = Admin | Client;

// Type for mock user stored in db.json, including password
export type MockUserWithPassword = User & { password?: string };

// Type for data passed to signup function
export type SignupData = {
    name: string;
    email: string;
    phone: string;
    password: string; // Password is required for signup
};


// Product/Service types
export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  soldQuantity?: number;
  image: string;
  type: "product";
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  icon?: string;
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
  date: string;
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
  date: string;
  status: "pending" | "completed" | "cancelled";
}