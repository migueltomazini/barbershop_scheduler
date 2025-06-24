// app/components/sections/profile/ProfileFormClient.tsx
// Renders a client-side profile editing form with integrated server action for persistent updates.

"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { User } from "@/app/types";

// Server Action to update user profile on the backend
import { updateUserProfileAction } from "@/app/actions/userActions";

/**
 * Props for ProfileFormClient component.
 *
 * @property {User} initialUser - The user's current data fetched from the server.
 */
interface ProfileFormClientProps {
  initialUser: User;
}

/**
 * SaveButton
 *
 * A submit button that reflects form submission status using React's useFormStatus hook.
 * Disables itself and displays "Saving..." while the form action is pending.
 */
function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="ml-auto">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

/**
 * ProfileFormClient
 *
 * Provides a two-column layout:
 * - Personal Information: readonly email, editable name and phone fields.
 * - Shipping Address: editable street, city, state, and ZIP fields.
 *
 * Manages form state locally and submits updates via updateUserProfileAction.
 * Displays toast notifications based on success or failure.
 */
export default function ProfileFormClient({ initialUser }: ProfileFormClientProps) {
  // Initialize form state with server-provided user data
  const [formState, setFormState] = useState({
    name: initialUser.name,
    phone: initialUser.phone || "",
    address: initialUser.address || {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  /**
   * handleChange
   *
   * Updates nested form state fields for both top-level and address entries.
   * Uses the input's name attribute to determine which state slice to update.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "zip"].includes(name)) {
      setFormState((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  /**
   * handleFormSubmit
   *
   * Receives a FormData object (unused here) and invokes the server action with
   * the current formState and userId. Shows toast feedback based on result.
   */
  const handleFormSubmit = async (formData: FormData) => {
    const result = await updateUserProfileAction({
      userId: initialUser._id,
      ...formState,
    });

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form action={handleFormSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Personal Information Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email field is read-only */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={initialUser.email}
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>
            {/* Editable Full Name */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
              />
            </div>
            {/* Editable Phone Number */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formState.phone}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
            <CardDescription>Your default address for product deliveries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Street input */}
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                name="street"
                value={formState.address.street}
                onChange={handleChange}
              />
            </div>
            {/* City and State fields side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formState.address.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formState.address.state}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* ZIP / Postal Code */}
            <div>
              <Label htmlFor="zip">ZIP / Postal Code</Label>
              <Input
                id="zip"
                name="zip"
                value={formState.address.zip}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            {/* Submit button with pending state management */}
            <SaveButton />
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}