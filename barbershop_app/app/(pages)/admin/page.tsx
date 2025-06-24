/**
 * @file app/(pages)/admin/page.tsx
 * @description This is the main page for the Admin Dashboard.
 * As a Server Component, it is responsible for protecting the route,
 * fetching all necessary data for the dashboard, and then passing that data
 * to a client-side component that handles the UI and interactivity.
 */

// Import React and Next.js utilities
import React from "react";
import { redirect } from "next/navigation";

// Import UI components and database models
import AdminDashboardClient from "@/app/components/sections/admin/AdminDashboardClient";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import Service from "@/models/Service";
import User from "@/models/User";
import Appointment from "@/models/Appointment";

// Directly imports the 'cookies' function from Next.js headers
import { cookies } from "next/headers";

/**
 * @function getAdminData
 * @description An asynchronous function that connects to the database and fetches all
 * data required for the admin dashboard (products, services, clients, and appointments).
 * It uses Promise.all to run all database queries concurrently for better performance.
 * @returns {Promise<object>} An object containing the lists of all fetched data.
 */
async function getAdminData() {
  // Ensures a database connection is established before performing any operations.
  await connectDB();

  // Prepares all database queries (promises) to be executed.
  // .lean() is used for performance optimization, returning plain JavaScript objects.
  const productsPromise = Product.find({}).sort({ createdAt: -1 }).lean();
  const servicesPromise = Service.find({}).sort({ createdAt: -1 }).lean();
  const clientsPromise = User.find({ role: 'client' }).sort({ createdAt: -1 }).lean();
  
  // The appointments query uses .populate() to include the associated user's and service's name.
  const appointmentsPromise = Appointment.find({})
    .populate('user', 'name')
    .populate('service', 'name')
    .sort({ date: -1 })
    .lean();

  // Executes all prepared queries in parallel.
  const [products, services, clients, appointments] = await Promise.all([
    productsPromise,
    servicesPromise,
    clientsPromise,
    appointmentsPromise,
  ]);
  
  // Converts the fetched data to a JSON string and back to an object to ensure
  // that only serializable data is passed from the server to the client.
  return JSON.parse(JSON.stringify({ products, services, clients, appointments }));
}

/**
 * @component AdminPage
 * @description The main component for the admin page. As an `async` function,
 * it operates as a Server Component, handling authorization and data fetching on the server-side.
 */
export default async function AdminPage() {
  // Reads the session cookie directly on the server to check for authentication.
  const sessionCookie = cookies().get('session')?.value;
  // Parses the cookie value into a session object if it exists.
  const session = sessionCookie ? JSON.parse(sessionCookie) : null;

  // Authorization logic: if there is no session or the user's role is not 'admin',
  // redirects to the homepage before any content is rendered.
  if (session?.role !== 'admin') {
    redirect('/');
  }

  // Fetches all the necessary data for the dashboard.
  const { products, services, clients, appointments } = await getAdminData();

  // Returns only the main content of the page, passing the server-fetched data as props.
  // The Navbar and Footer are handled by the root layout.
  return (
    <main className="container mx-auto px-4 py-12 flex-grow">
      <AdminDashboardClient
        initialProducts={products}
        initialServices={services}
        initialClients={clients}
        initialAppointments={appointments}
      />
    </main>
  );
}
