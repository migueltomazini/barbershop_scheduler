/**
 * @file barbershop_app/app/(pages)/shop/page.tsx
 * @description VERSÃO FINAL: Esta página agora é um Server Component que busca a lista completa
 * de produtos do MongoDB e os passa para o componente de exibição.
 */

// app/(pages)/shop/page.tsx
import { ProductsSection } from "@/app/components/sections/productsSection";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";

async function getPageData() {
    await connectDB();
    const productsData = await Product.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify({ products: productsData }));
}

export default async function ShopPage() {
  const { products } = await getPageData();
  
  return (
    <ProductsSection initialProducts={products} variant="full" />
  );
}
