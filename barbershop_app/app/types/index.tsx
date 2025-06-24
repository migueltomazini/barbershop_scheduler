/**
 * @file barbershop_app/app/types/index.ts
 * @description Defines shared TypeScript types for authentication, user, inventory,
 * appointments, and cart items used across the barbershop application.
 */

// -----------------------------
// Authentication and User Types
// -----------------------------

/**
 * @typedef Address
 * @description Represents a user's address information.
 * @property {string} street - Street name and number.
 * @property {string} city - City name.
 * @property {string} state - State or region.
 * @property {string} zip - Postal code.
 * @property {string} [country] - Optional country name.
 */
export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string; // Optional, consistent with the database schema
};

/**
 * @interface User
 * @description Represents a user entity matching the Mongoose user model.
 * @property {string} _id - MongoDB user ID.
 * @property {string} name - Full name of the user.
 * @property {string} email - User email address.
 * @property {string} phone - User phone number.
 * @property {"client" | "admin"} role - User role (client or admin).
 * @property {Address} [address] - Optional address details.
 * @property {string} createdAt - ISO timestamp when the user was created.
 * @property {string} updatedAt - ISO timestamp when the user was last updated.
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "admin";
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

/**
 * @typedef SessionType
 * @description Represents the structure of the session stored in the cookie.
 * @property {string} userId - ID of the authenticated user.
 * @property {string} name - Name of the authenticated user.
 * @property {string} role - Role of the authenticated user.
 */
export type SessionType = {
  userId: string;
  name: string;
  role: string;
};


// -----------------------------
// Inventory Types (Products & Services)
// -----------------------------

/**
 * @interface ProductType
 * @description Represents a product in the shop inventory.
 * @property {string} _id - MongoDB product ID.
 * @property {string} name - Name of the product.
 * @property {string} description - Description of the product.
 * @property {number} price - Price of the product.
 * @property {number} quantity - Available stock quantity.
 * @property {number} [soldQuantity] - Optional number of units sold.
 * @property {string} image - Image URL for the product.
 * @property {"product"} type - Fixed value to identify this as a product.
 */
export interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  soldQuantity?: number;
  image: string;
  type: "product";
}

/**
 * @interface ServiceType
 * @description Represents a service offered by the barbershop.
 * @property {string} _id - MongoDB service ID.
 * @property {string} name - Name of the service.
 * @property {string} description - Description of the service.
 * @property {number} price - Price of the service.
 * @property {number} duration - Duration of the service in minutes.
 * @property {string} image - Image URL representing the service.
 * @property {string} [icon] - Optional icon to represent the service.
 * @property {"service"} type - Fixed value to identify this as a service.
 */
export interface ServiceType {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  icon?: string;
  type: "service";
}


// -----------------------------
// Appointment & Cart Types
// -----------------------------

/**
 * @interface Appointment
 * @description Represents an appointment record with populated user and service details.
 * @property {string} _id - MongoDB appointment ID.
 * @property {string} date - Appointment date in ISO string format.
 * @property {"scheduled" | "completed" | "canceled" | "cancelled"} status - Current status of the appointment.
 * @property {Object} user - Populated user details.
 * @property {string} user._id - ID of the user.
 * @property {string} user.name - Name of the user.
 * @property {Object} service - Populated service details.
 * @property {string} service._id - ID of the service.
 * @property {string} service.name - Name of the service.
 */
export interface Appointment {
  _id: string;
  date: string;
  status: "scheduled" | "completed" | "canceled" | "cancelled";
  user: {
    _id: string;
    name: string;
  };
  service: {
    _id: string;
    name: string;
  };
}

/**
 * @interface CartItem
 * @description Represents a single item in the shopping cart.
 * @property {string} id - ID of the product or service.
 * @property {string} name - Name of the item.
 * @property {number} price - Price per unit.
 * @property {string} image - Image URL of the item.
 * @property {number} quantity - Number of units in the cart.
 * @property {"product" | "service"} type - Type to distinguish between product and service.
 * @property {string} [description] - Optional description for the item.
 * @property {string} [date] - Optional date for appointment scheduling.
 * @property {string} [time] - Optional time for appointment scheduling.
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: "product" | "service";
  description?: string;
  date?: string;
  time?: string;
}
