# Barber Shop Website

## Members

- Bruno Basckeira Chinaglia - 14562233
- Miguel Rodrigues Tomazini - 14599300

## Introduction

This project is a web-based system for a modern barber shop, developed as part of a Web Development course. The system is designed to provide customers with easy access to essential information about the barber shop, its services, and products, as well as to facilitate the scheduling of appointments. The platform emphasizes a clean and user-friendly interface to enhance the customer experience.

## Navigation Diagram

The following diagram illustrates the structure and navigation flow between the main pages of the system:

![Navigation Diagram](./Milestone%201/images/navigationDiagram.png)

## Screenshots

Below are screenshots of the main pages implemented so far:

### Home Page

![Home Page](./screenshots/home.png)

Landing page introducing the brand, with quick links to services and shop sections.

---

### Services Page

![Services Page](./screenshots/services.png)

Displays the list of available services, descriptions, and pricing information.

---

### Shop Page

![Shop Page](./screenshots/shop.png)

Product catalog showcasing items such as grooming kits, hair products, and accessories.

---

### Cart Page

![Cart Page](./screenshots/cart.png)

Static cart layout displaying selected products, with options to modify or remove (not functional yet).

---

### Login Page

![Login Page](./screenshots/login.png)

Simple login form acting as a placeholder for future authentication features.

---

### Appointments Page

![Appointments Page](./screenshots/appointments.png)

Structured layout allowing users to select available time slots for services (visual only).

---

### Admin Dashboard Page

![Appointments Page](./screenshots/admin_dashboard.png)

Admin view with a structured layout to visualize and select available time slots for services (visual only).

---

## Technology Stack and Architecture

The project was built using a modern JavaScript stack, focusing on performance, security, and developer experience.

- **Framework:** [Next.js 15](https://nextjs.org/) (React 19) with the App Router for a component-based architecture.
- **Language:** [TypeScript](https://www.typescriptlang.org/) for type safety and code maintainability.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for a utility-first approach enabling rapid and consistent UI development.
- **Backend Logic:**
  - **Server Components** handle data fetching on the server, optimizing initial load time and SEO.
  - **Server Actions** manage data mutations (create, update, delete) securely on the server, removing the need for a separate API layer.
- **Database:**
  - **MongoDB Atlas:** Cloud-hosted, flexible, and scalable NoSQL database.
  - **Mongoose:** ODM to model and interact with MongoDB in a structured, secure manner.
- **Authentication:**
  - Custom session management using secure `httpOnly` cookies on the server to handle user login states and protect routes.

---

## Implemented Features

The application includes a full cycle of features connected to a persistent database:

### ✅ Complete Authentication

- Users can **Sign Up** and **Login**; data is persisted in MongoDB.
- Distinction between **Client** and **Administrator** roles, with route protection for admin-only pages.
- User sessions are managed server-side via cookies; the UI updates dynamically (e.g., Navbar shows login state).

### 🗂️ Dynamic Product and Service Catalog

- All products and services are fetched directly from MongoDB Atlas.
- Listing pages use **Server Components** for fast, SEO-friendly page loads.

### 🛒 Functional Shopping Cart & Checkout

- Users can add/remove products and update quantities; cart state is persisted in `localStorage`.
- The checkout flow:
  - Purchasing a **service** creates a new Appointment document in the database.
  - Purchasing a **product** decrements its quantity and increments its `soldQuantity` in the database via a Server Action.

### 🔐 Administrator Dashboard

- Admins access a protected dashboard at `/admin`.
- Full CRUD (Create, Read, Update, Delete) for Products and Services.
- View of all registered clients and appointments.

---


## Requirements (Milestone 2 and 3 Focus)

The core requirements are specified in the course assignment. For Milestones 2 and 3, the focus shifted from mock client-side functionality to a fully integrated backend with MongoDB.

**Fulfilled from Assignment:**

- **User Types:** Implemented distinct experiences for **Clients** and **Administrators** using a real authentication system with server-managed sessions.
  - **Administrators:** Can log in with valid credentials and access a protected dashboard to manage products, services, clients, and appointments directly in the database.
  - **Clients:** Can register, log in, browse the catalog, add items to the cart, book services, and complete purchases. User sessions persist securely with server-side cookies.
- **Admin Record:** Stored in MongoDB, including `name`, `id`, `phone`, `email`.
- **Customer Record:** Stored in MongoDB with `name`, `id`, `address`, `phone`, `email`.
- **Product/Service Records:** Stored in MongoDB, including `name`, `id`, `photo`, `description`, `price`, `quantity` (in stock), and `soldQuantity`. All updates happen live in the database.
- **Selling Products/Services:**
  - Users can select products/services, adjust quantity, and add to a fully functional cart.
  - On checkout, product stock is decremented and `soldQuantity` incremented in MongoDB.
  - Service purchases create Appointment records in the database.
  - The cart is cleared after a successful checkout.
- **Product/Service Management (Admin):** Administrators have full CRUD operations for Products and Services using Server Actions, all persisted in MongoDB.
- **Specific Functionality:** The barbershop includes a complete online store and appointment booking system, offering a comprehensive digital experience.
- **Accessibility & Usability:** The application uses semantic HTML, ARIA attributes, and a clear, consistent design. The navigation is intuitive and responsive.
- **Responsiveness:** The interface adapts gracefully to various screen sizes and devices, ensuring usability on mobile, tablet, and desktop.

---

## Project Description (Milestone 2 and 3 Update)

Milestones 2 and 3 expanded the project from static HTML/CSS mockups to a fully functional, database-backed full-stack web app using Next.js and MongoDB.

**Key functionalities implemented:**

- **User Authentication:** A secure authentication system allows users to register and sign in as either a Client or an Admin. Sessions are managed via server-side `httpOnly` cookies.
- **Product Catalog & Shop:** Products are dynamically fetched from MongoDB using Server Components, ensuring fast and SEO-friendly rendering.
- **Shopping Cart:** A fully functional shopping cart enables users to add/remove products, update quantities, and view subtotals. Cart state persists in `localStorage` for a smooth experience.
- **Checkout Process:** A real checkout flow that updates the database in real time — stock levels are decremented, sales are tracked, and service purchases create appointments in the database.
- **Services Display & Booking:** Services are listed dynamically from the database. Booking a service creates a persistent Appointment record in MongoDB.
- **Admin Functionalities:** Admins have access to a secure dashboard to manage Products and Services with full CRUD functionality and view lists of clients and appointments.
- **Responsive Design:** The system remains accessible and easy to use across desktops, tablets, and mobile devices.
- **Navigation:** All pages are interconnected with clear navigation links and dynamic UI updates based on authentication state.

The project uses React 19 with Next.js 15 for the App Router architecture, Tailwind CSS for styling, and MongoDB Atlas with Mongoose for persistent and secure data storage. Global state for cart and auth status is managed with React Context and Next.js Server Actions.

---

## Comments About the Code

- The project uses Next.js’s App Router for a clear, component-based structure.
- UI consistency is ensured through reusable components (e.g., `Button`, `Input`, `Navbar`, `Footer`).
- Authentication and shopping cart states are managed with React Context and secure cookies.
- Tailwind CSS accelerates styling with utility-first classes.
- MongoDB with Mongoose replaces any need for a mock API — all product, service, and user data is real and persistent.

---

## Test Plan

- Tested admin login with "admin/admin": successfully redirected to a page with access to the "Appointments" and "Dashboard" sections via the navigation bar.
- Tested client login with "client@example.com/password": successfully redirected to a page with access to the "Appointments" section via the navigation bar.
- Tested adding and removing products in the cart: the cart updated dynamically and changes were correctly reflected in localStorage. Users can add products by clicking the "+" button, decrease quantity with the "-" button, or remove the item completely using the "Remove" button — all located in the same box as the product.
- Tested adding products from both the Home and Shop pages: clicking "Add to Cart" increases the quantity in the cart by 1 (if the product is still in stock).
- Tested appointment scheduling: clients can schedule an appointment either from the "Appointments" page or by scrolling to the bottom of the Home page and clicking the "Book your appointment" button. Anyone can schedule an appointment, but since there is no database connection yet, appointments are not saved or displayed on the admin dashboard.
- Tested checkout process without providing credit card information: the system correctly displays a message prompting the user to enter valid payment data.
- Tested responsive design using Chrome Developer Tools: all UI components adapted properly to different screen sizes.


## Test Results

All manual tests were successfully completed. Implemented features (mock login, cart functionality, product listing, and checkout simulation) worked as expected. No critical bugs were found. Minor layout adjustments were made to improve responsiveness on small screens.

## Build Procedures

To set up and run this project locally or in network:

1.  **Prerequisites:**
    *   Node.js (v18.x or later)
    *   npm

2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/migueltomazini/barbershop_scheduler
    ```

3.  **Navigate to the Application Directory and Install Dependencies:**
    ```bash
    cd barbershop_app
    npm install
    ```
    
4. **Create your .env File (on barbershop_app's paste)**
   ```bash
   MONGODB_URI="mongodb+srv://web:web@cluster0.bakpfy2.mongodb.net/barbershop_app?retryWrites=true&w=majority&appName=Cluster0"
   ```

5.  **Run the Next.js Development Server:**
    ```bash
    npm run dev
    ```

6.  **Access the Application:**
    *   Open your web browser and navigate to `http://localhost:3000` or `http://192.168.15.195:3000`.

## Problems

No problems encountered during the implementation of Milestones 1, 2 or 3.

## Comments

No comments.
