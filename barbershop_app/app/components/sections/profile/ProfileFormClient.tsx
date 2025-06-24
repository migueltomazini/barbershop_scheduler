// app/components/sections/profile/ProfileFormClient.tsx
"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { User } from "@/app/types";

// Importando a nova Server Action
import { updateUserProfileAction } from "@/app/actions/userActions";

interface ProfileFormClientProps {
  initialUser: User;
}

// Botão que gerencia seu próprio estado de "pending"
function SaveButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="ml-auto">
            {pending ? "Saving..." : "Save Changes"}
        </Button>
    );
}

export default function ProfileFormClient({ initialUser }: ProfileFormClientProps) {
  // O estado do formulário ainda é gerenciado aqui, no cliente.
  // Ele é inicializado com os dados frescos que vieram do servidor.
  const [formState, setFormState] = useState({
    name: initialUser.name,
    phone: initialUser.phone || "",
    address: initialUser.address || { street: "", city: "", state: "", zip: "" },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "zip"].includes(name)) {
      setFormState(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFormSubmit = async (formData: FormData) => {
    // Usamos 'formData' para chamar a action, mas passamos nosso objeto de estado
    // que é mais completo e já tem a estrutura de endereço.
    const result = await updateUserProfileAction({
        userId: initialUser._id, // Passa o ID do usuário
        ...formState
    });

    if (result.success) {
        toast.success(result.message);
    } else {
        toast.error(result.message);
    }
  };

  return (
    <form action={handleFormSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={initialUser.email} readOnly disabled className="bg-gray-100" />
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
              <Label htmlFor="zip">ZIP / Postal Code</Label>
              <Input id="zip" name="zip" value={formState.address.zip} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter>
            <SaveButton />
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}