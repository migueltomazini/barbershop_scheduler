// app/(pages)/appointments/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";
import { Clock, Calendar as CalendarIconLucide } from "lucide-react";
import { format, isPast, parseISO, isToday as dateFnsIsToday } from "date-fns";
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import {
  ServiceType as AppServiceType,
  Appointment as NewAppointmentDataType,
} from "@/app/types";

const API_BASE_URL = "http://localhost:3001";

// Generates an array of time strings for appointment slots
function generateTimes(startHour = 9, endHour = 17, interval = 30) {
  const times: string[] = [];
  const currentDate = new Date();
  currentDate.setHours(startHour, 0, 0, 0);
  const endDate = new Date();
  endDate.setHours(endHour, 30, 0, 0);
  let tempDate = new Date(currentDate);
  while (tempDate <= endDate) {
    times.push(format(tempDate, "HH:mm"));
    tempDate = new Date(tempDate.getTime() + interval * 60000);
  }
  return times;
}

// Returns today's date in 'YYYY-MM-DD' format
const getTodayDateString = () => {
  return format(new Date(), "yyyy-MM-dd");
};

export default function AppointmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // State variables for managing services, selected date, service, time, and booking status
  const [services, setServices] = useState<AppServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);

  // Generates available time slots for the scheduler
  const availableTimes = generateTimes();

  // Effect to redirect unauthenticated users to the login page
  useEffect(() => {
    // Wait for user auth state to be resolved before redirecting
    if (user !== undefined && !isAuthenticated) {
      toast.error("Please log in to book an appointment.");
      router.push("/login?redirect=/appointments");
    }
  }, [user, isAuthenticated, router]);

  // Effect to fetch available services from the API
  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (!response.ok) throw new Error("Failed to fetch services.");
        const data: AppServiceType[] = await response.json();
        setServices(data);
      } catch (error: unknown) {
        let message = "Could not load services.";
        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === "string") {
          message = error;
        }
        toast.error(message);
        console.error("Error fetching services:", error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // Handles the appointment booking process
  const handleBooking = async () => {
    if (!user) {
      toast.error("You must be logged in to book an appointment.");
      router.push("/login?redirect=/appointments");
      return;
    }
    if (!selectedDate || !selectedServiceId || !selectedTime) {
      toast.error("Please fill out all fields before booking.");
      return;
    }
    const chosenDate = parseISO(selectedDate);
    if (isPast(chosenDate) && !dateFnsIsToday(chosenDate)) {
      toast.error("You cannot book an appointment for a past date.");
      return;
    }

    setIsBooking(true);
    const selectedService = services.find(
      (s) => s.id.toString() === selectedServiceId
    );
    if (!selectedService) {
      toast.error("Selected service not found. Please try again.");
      setIsBooking(false);
      return;
    }

    // Constructs the booking data payload for the API
    const bookingData: Omit<NewAppointmentDataType, "id"> = {
      clientId: Number(user.id),
      clientName: user.name,
      serviceId: parseInt(selectedServiceId),
      serviceName: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      status: "scheduled",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to book appointment. Please try again."
        );
      }
      toast.success("Appointment booked successfully!");
      setSelectedDate("");
      setSelectedServiceId("");
      setSelectedTime("");
    } catch (error: unknown) {
      let message = "An error occurred while booking.";
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }
      toast.error(message);
      console.error("Booking error:", error);
    } finally {
      setIsBooking(false);
    }
  };

  // Finds the selected service object based on the selected service ID
  const selectedServiceObj = services.find(
    (s) => s.id.toString() === selectedServiceId
  );

  // Displays loading state if authentication is still resolving or services are loading
  if (user === undefined || (isAuthenticated && loadingServices)) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <p className="text-xl text-muted-foreground">
            Loading appointment scheduler...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center font-serif text-barber-brown">
          Book Your Appointment
        </h1>
        <p className="mb-8 text-center text-muted-foreground max-w-xl">
          Select your preferred service, date, and time, and we&apos;ll reserve your
          spot.
        </p>
        <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Service Selection Section */}
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                  1. Choose a Date
                </h2>
                <div className="relative">
                  <CalendarIconLucide className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                    }}
                    min={getTodayDateString()}
                    className="pl-10 h-12 w-full border border-barber-cream rounded-lg p-2 text-lg focus:ring-barber-gold focus:border-barber-gold"
                  />
                </div>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                  2. Select a Service
                </h2>
                {loadingServices ? (
                  <p className="text-gray-500 h-12 flex items-center">
                    Loading services...
                  </p>
                ) : services.length === 0 ? (
                  <p className="text-gray-500 h-12 flex items-center">
                    No services available.
                  </p>
                ) : (
                  <Select
                    value={selectedServiceId}
                    onValueChange={setSelectedServiceId}
                  >
                    <SelectTrigger className="h-12 w-full border border-barber-cream rounded-lg text-lg">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                          className="text-md"
                        >
                          {service.name} - ${service.price.toFixed(2)} •{" "}
                          {service.duration} min
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </section>
            </div>

            {/* Time Slots Selection Section */}
            <section>
              <h2 className="text-xl font-semibold mb-2 text-gray-700">
                3. Choose a Time
              </h2>
              {!selectedDate ? (
                <div className="border border-barber-cream rounded-lg p-4 h-full flex items-center justify-center text-center text-gray-500">
                  Please select a date first to see available times.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[20rem] md:max-h-[22rem] overflow-y-auto p-1 border border-barber-cream rounded-lg">
                  {availableTimes.length > 0 ? (
                    availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className={`h-12 w-full justify-start text-sm ${
                          selectedTime === time
                            ? "bg-barber-gold text-black hover:bg-barber-gold/90"
                            : "border-barber-brown text-barber-brown hover:bg-barber-brown/10"
                        }`}
                      >
                        <Clock className="mr-2 h-4 w-4" /> {time}
                      </Button>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500 p-4">
                      No general time slots listed. (Dynamic availability to be
                      implemented)
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Confirmation Section */}
          <section className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">
              4. Confirm Your Booking
            </h2>
            {!(selectedDate && selectedServiceId && selectedTime) ? (
              <div className="p-4 bg-gray-100 border border-barber-cream rounded-lg text-gray-600">
                Please select a date, service, and time to see your booking
                summary.
              </div>
            ) : (
              <div className="p-4 bg-barber-cream/50 border border-barber-cream rounded-lg space-y-1 text-gray-700">
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedDate
                    ? format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")
                    : "N/A"}
                </p>
                <p>
                  <strong>Time:</strong> {selectedTime}
                </p>
                <p>
                  <strong>Service:</strong> {selectedServiceObj?.name || "N/A"}
                </p>
                <p>
                  <strong>Client:</strong> {user?.name || "Guest"}
                </p>
                <p>
                  <strong>Price:</strong> $
                  {selectedServiceObj?.price
                    ? selectedServiceObj.price.toFixed(2)
                    : "0.00"}
                </p>
              </div>
            )}
            <Button
              onClick={handleBooking}
              disabled={
                !(
                  selectedDate &&
                  selectedServiceId &&
                  selectedTime &&
                  isAuthenticated
                ) || isBooking
              }
              className="mt-6 w-full h-12 bg-barber-gold hover:bg-barber-gold/90 text-black text-lg font-semibold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isBooking ? "Booking..." : "Book Appointment"}
            </Button>
            {!isAuthenticated && (
              <p className="text-sm text-red-600 text-center mt-2">
                Please log in to book an appointment.
              </p>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
