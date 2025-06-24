/**
 * @file app/(pages)/appointments/page.tsx
 * @description This is the main page for booking and managing appointments.
 * As a Server Component, it is responsible for protecting the route by checking for
 * a user session, fetching all necessary data (services and existing appointments),
 * and then passing that data to a client-side component for UI and interactivity.
 */

// Import React and Next.js utilities
import React from 'react';
import { redirect } from 'next/navigation';

// Import UI components and database models
import AppointmentClientPage from '@/app/components/sections/appointments/AppointmentClientPage';
import connectDB from '@/lib/mongoose';
import Service from '@/models/Service';
import Appointment from '@/models/Appointment';

// Directly imports the 'cookies' function from Next.js headers to be used on the server.
import { cookies } from 'next/headers';

/**
 * @function getPageData
 * @description An asynchronous function that fetches all data required for the appointments page.
 * It fetches the full list of services for the booking form and the specific appointments
 * belonging to the logged-in user.
 * @param {string | undefined} userId - The ID of the currently logged-in user.
 * @returns {Promise<object>} An object containing the lists of services and user's appointments.
 */
async function getPageData(userId: string | undefined) {
  // If no user ID is provided, return empty arrays to prevent errors.
  if (!userId) {
    return { services: [], initialAppointments: [] };
  }
  // Ensure a database connection is established.
  await connectDB();

  // Prepare the database queries to run in parallel.
  const servicesPromise = Service.find({}).sort({ name: 1 }).lean();
  const appointmentsPromise = Appointment.find({ user: userId })
    .sort({ date: -1 })
    .populate('service', 'name') // Includes the service name in the appointment data.
    .lean();
  
  // Execute both queries concurrently for better performance.
  const [services, initialAppointments] = await Promise.all([
    servicesPromise, 
    appointmentsPromise
  ]);
  
  // Serialize the data to ensure only plain objects are passed to the client component.
  return JSON.parse(JSON.stringify({ services, initialAppointments }));
}

/**
 * @component AppointmentsPage
 * @description The main component for the appointments page. As an `async` function,
 * it operates as a Server Component.
 */
export default async function AppointmentsPage() {
  // 2. Reads the session cookie directly on the server.
  const sessionCookie = cookies().get('session')?.value;

  // If no cookie is found, redirects the user to the login page.
  // It includes a 'redirect' query parameter to return the user here after login.
  if (!sessionCookie) {
    redirect('/login?redirect=/appointments');
  }

  // If the cookie exists, parse its JSON content to get the session object.
  const session = JSON.parse(sessionCookie);
  
  // Fetches the page data using the user's ID from the session.
  const { services, initialAppointments } = await getPageData(session.userId);

  // Prepares a session object to be passed to the client component.
  // This avoids passing the entire server-side session object to the client.
  const clientSession = { 
    isAuthenticated: true, 
    user: { _id: session.userId, name: session.name } 
  };

  // Renders the client-side component, passing all fetched data and the session as props.
  // The page itself only returns this component; Navbar and Footer are handled by the root layout.
  return (
    <AppointmentClientPage
      services={services}
      initialAppointments={initialAppointments}
      session={clientSession}
    />
  );
}