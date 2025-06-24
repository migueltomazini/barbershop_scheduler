/**
 * @file barbershop_app/app/(pages)/shop/page.tsx
 * @description
 * FINAL VERSION: This page is a Server Component that handles the logic to fetch
 * all products from the MongoDB database and passes them to a presentation component.
 * 
 * Key Features:
 * - Executes server-side data fetching via Mongoose.
 * - Uses `lean()` for performance and JSON serialization.
 * - Passes product data to a reusable UI section component.
 * - Layout elements (Navbar, Footer) are handled by layout.tsx globally.
 */

import { ProductsSection } from "@/app/components/sections/productsSection";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";

/**
 * getPageData
 * ------------------
 * This helper function performs all data fetching logic required by the page.
 * 
 * Steps:
 * 1. Establish a connection to MongoDB using the shared `connectDB` utility.
 * 2. Query the `Product` model to retrieve all products, sorted in descending order of creation time.
 * 3. Use `.lean()` to return plain JavaScript objects instead of full Mongoose documents.
 * 4. Serialize the result using `JSON.stringify` and `JSON.parse` to ensure it can be safely
 *    passed as props in the React component tree.
 * 
 * @returns {Promise<{ products: Array<Object> }>} A JSON-serializable object containing all product data.
 */
async function getPageData() {
    await connectDB();

    const productsData = await Product.find({})
      .sort({ createdAt: -1 }) // Sorts products from newest to oldest
      .lean();                 // Returns plain JS objects instead of Mongoose documents

    return JSON.parse(JSON.stringify({ products: productsData }));
}

/**
 * ShopPage (Server Component)
 * ---------------------------
 * Main page component responsible for rendering the shop interface.
 * 
 * - Calls `getPageData()` to retrieve the product list from the database.
 * - Passes the result as the `initialProducts` prop to `<ProductsSection />`.
 * - This structure keeps the rendering fast and SEO-friendly by resolving data server-side.
 * 
 * @returns {JSX.Element} The rendered shop section component with product data.
 */
export default async function ShopPage() {
  const { products } = await getPageData();

  return (
    <ProductsSection initialProducts={products} variant="full" />
  );
}
