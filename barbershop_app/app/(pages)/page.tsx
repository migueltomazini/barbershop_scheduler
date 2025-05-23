import React from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Calendar, ShoppingBag} from "lucide-react";
// Types imports
import { mockServices } from "../data/mockServices"
// Components imports
import { Navbar } from "../components/navbar";
import { ServiceCard } from "../components/ui/serviceCard";
import { ProductCard } from "../components/ui/productCard";
import { mockProducts } from "../data/mockProducts";

export default function Home() {
  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-barber-navy text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2344&q=100')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              Sharp Style, Perfect Cut
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Experience premium grooming services at SharpShears. Our skilled
              barbers deliver classic cuts and modern styles with precision and
              expertise.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/appointments">
                <Button className="bg-barber-gold hover:bg-barber-gold/90 text-black font-medium px-6 py-2">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Appointment
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-barber-navy font-medium px-6 py-2"
                >
                  Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 font-serif text-barber-brown">
            Our Premium Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From classic haircuts to luxury grooming treatments, our
            professional barbers provide exceptional service for the modern
            gentleman.
          </p>
        </div>

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center text-barber-brown mb-8">
            Featured Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {mockServices.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} service={service}  variant="carousel" icon={service.icon}/>
            ))}
          </div>
        </section>

        <div className="text-center mt-10">
          <Link href="/services">
            <Button className="bg-barber-brown hover:bg-barber-dark-brown text-white">
              View All Services
            </Button>
          </Link>
        </div>
      </section>

      {/* Product Preview */}
      <section className="bg-barber-cream py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-serif text-barber-brown">
              Shop Premium Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Maintain your style with our selection of professional grooming
              products used by our barbers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product}/>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop">
              <Button className="bg-barber-brown hover:bg-barber-dark-brown text-white">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6 font-serif text-barber-brown">
          Ready for a Fresh Look?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
          Book your appointment today and experience the SharpShears difference.
          Our skilled barbers are ready to help you look and feel your best.
        </p>
        <Link href="/appointments">
          <Button className="bg-barber-gold hover:bg-barber-gold/90 text-black font-medium px-8 py-2 text-lg">
            Book Your Appointment
          </Button>
        </Link>
      </section>
    </div>
  );
}
