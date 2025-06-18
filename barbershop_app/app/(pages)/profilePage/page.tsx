// app/(pages)/profile/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { toast } from "sonner";
import { User } from "@/app/types";

// Tipo para o estado do formulário, espelhando os campos editáveis
type ProfileFormState = {
  name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};

const API_BASE_URL = "http://localhost:3001";

export default function ProfilePage() {
  const { user, isAuthenticated, updateUserContext } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Estado do formulário, inicializado como nulo
  const [formState, setFormState] = useState<ProfileFormState | null>(null);

  // Redireciona se o usuário não estiver logado
  useEffect(() => {
    if (user === null && !isAuthenticated) {
      toast.error("Please log in to view your profile.");
      router.push("/login?redirect=/profile");
    }
  }, [user, isAuthenticated, router]);

  // Popula o formulário com os dados do usuário quando ele for carregado
  useEffect(() => {
    if (user) {
      setFormState({
        name: user.name,
        phone: user.phone,
        address: user.address || { street: "", city: "", state: "", zip: "" },
      });
    }
  }, [user]);

  // Função genérica para lidar com mudanças nos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (!formState) return;

    // Se o campo pertence ao endereço, atualiza o sub-objeto
    if (["street", "city", "state", "zip"].includes(name)) {
      setFormState({
        ...formState,
        address: {
          ...formState.address,
          [name]: value,
        },
      });
    } else {
      // Senão, atualiza o campo principal
      setFormState({ ...formState, [name]: value });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formState) {
      toast.error("User data not found.");
      return;
    }

    setIsSaving(true);

    // Payload para a API. Inclui todos os dados do usuário, atualizando os que foram modificados.
    const updatedUserData = {
      ...user, // Começa com os dados existentes
      ...formState, // Sobrescreve com os dados do formulário
    };

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      const savedUser: User = await response.json();

      // **Passo CRUCIAL: Atualiza o contexto global**
      updateUserContext(savedUser);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  // Renderiza um estado de carregamento enquanto o usuário ou o formulário não estão prontos
  if (!user || !formState) {
    return (
      <>
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Loading profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center font-serif text-barber-brown">
          My Profile
        </h1>
        <form onSubmit={handleUpdateProfile}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna de Informações Pessoais */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  {/* O email geralmente não é editável */}
                  <Input id="email" type="email" value={user.email} readOnly disabled className="bg-gray-100"/>
                </div>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formState.name} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={formState.phone} onChange={handleChange} />
                </div>
              </CardContent>
            </Card>

            {/* Coluna de Endereço */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Your default address for product deliveries.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" name="street" value={formState.address.street} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formState.address.city} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" value={formState.address.state} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="zip">CEP / ZIP Code</Label>
                  <Input id="zip" name="zip" value={formState.address.zip} onChange={handleChange} />
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" disabled={isSaving} className="ml-auto">
                    {isSaving ? "Saving..." : "Save Changes"}
                 </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}