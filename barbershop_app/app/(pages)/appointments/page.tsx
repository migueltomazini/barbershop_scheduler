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
import { format, addYears, isPast, parseISO } from "date-fns"; // 'isToday' removido
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import {
  ServiceType as AppServiceType,
  Appointment as NewAppointmentDataType,
} from "@/app/types";

const API_BASE_URL = "http://localhost:3001";

function generateTimes(startHour = 9, endHour = 17, interval = 30) {
  const times: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      if (hour === endHour && minute >= interval) break;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(time);
    }
  }
  return times;
}

const getTodayDateString = () => format(new Date(), "yyyy-MM-dd");
const getMaxDateString = () => format(addYears(new Date(), 1), "yyyy-MM-dd");

export default function AppointmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [services, setServices] = useState<AppServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);

  const allAvailableTimes = generateTimes();

  useEffect(() => {
    if (user !== undefined && !isAuthenticated) {
      toast.error("Please log in to book an appointment.");
      router.push("/login?redirect=/appointments");
    }
  }, [user, isAuthenticated, router]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (!response.ok) throw new Error("Failed to fetch services.");
        const data: AppServiceType[] = await response.json();
        setServices(data.map(s => ({ ...s, duration: Number(s.duration) || 30 })));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load services.");
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);
  
  const isTimeSlotPast = (date: string, time: string): boolean => {
    if (!date || !time) return true;
    const dateTimeString = `${date}T${time}:00`;
    return isPast(new Date(dateTimeString));
  }

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

    if (isTimeSlotPast(selectedDate, selectedTime)) {
      toast.error("You cannot book an appointment for a past date or time.");
      return;
    }

    setIsBooking(true);
    const selectedService = services.find(s => s.id.toString() === selectedServiceId);
    if (!selectedService) {
      toast.error("Selected service not found. Please try again.");
      setIsBooking(false);
      return;
    }

    const bookingData: Omit<NewAppointmentDataType, "id"> = {
      clientId: user.id,
      clientName: user.name,
      serviceId: selectedServiceId,
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
        throw new Error(errorData.message || "Failed to book appointment.");
      }
      toast.success("Appointment booked successfully!");
      setSelectedDate("");
      setSelectedServiceId("");
      setSelectedTime("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred while booking.");
    } finally {
      setIsBooking(false);
    }
  };

  const selectedServiceObj = services.find(s => s.id.toString() === selectedServiceId);
  
  const filteredTimes = selectedDate
    ? allAvailableTimes.filter(time => !isTimeSlotPast(selectedDate, time))
    : [];

  if (user === undefined || (isAuthenticated && loadingServices)) {
     return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <p className="text-xl text-muted-foreground">Loading appointment scheduler...</p>
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
          Select your preferred service, date, and time, and we&apos;ll reserve your spot.
        </p>
        <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">1. Choose a Date</h2>
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
                    max={getMaxDateString()}
                    className="pl-10 h-12 w-full border border-barber-cream rounded-lg p-2 text-lg focus:ring-barber-gold focus:border-barber-gold"
                  />
                </div>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">2. Select a Service</h2>
                {loadingServices ? <p>Loading services...</p> : (
                  <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                    <SelectTrigger className="h-12 w-full border-barber-cream rounded-lg text-lg">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()} className="text-md">
                          {service.name} - ${service.price.toFixed(2)} • {service.duration} min
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </section>
            </div>
            <section>
              <h2 className="text-xl font-semibold mb-2 text-gray-700">3. Choose a Time</h2>
              {!selectedDate ? (
                <div className="border border-barber-cream rounded-lg p-4 h-full flex items-center justify-center text-center text-gray-500">
                  Please select a date first to see available times.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[20rem] md:max-h-[22rem] overflow-y-auto p-1 border border-barber-cream rounded-lg">
                  {filteredTimes.length > 0 ? (
                    filteredTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className={`h-12 w-full justify-start text-sm ${selectedTime === time ? "bg-barber-gold text-black" : "border-barber-brown text-barber-brown"}`}
                      >
                        <Clock className="mr-2 h-4 w-4" /> {time}
                      </Button>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500 p-4">No available time slots for today.</p>
                  )}
                </div>
              )}
            </section>
          </div>
          <section className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">4. Confirm Your Booking</h2>
            {!(selectedDate && selectedServiceId && selectedTime) ? (
              <div className="p-4 bg-gray-100 border-barber-cream rounded-lg text-gray-600">
                Please select a date, service, and time to see your booking summary.
              </div>
            ) : (
              <div className="p-4 bg-barber-cream/50 border border-barber-cream rounded-lg space-y-1 text-gray-700">
                <p><strong>Date:</strong> {selectedDate ? format(parseISO(selectedDate), "EEEE, MMMM d, yyyy") : "N/A"}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Service:</strong> {selectedServiceObj?.name || "N/A"}</p>
                <p><strong>Price:</strong> ${selectedServiceObj?.price ? selectedServiceObj.price.toFixed(2) : "0.00"}</p>
              </div>
            )}
            <Button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedServiceId || !selectedTime || !isAuthenticated || isBooking}
              className="mt-6 w-full h-12 bg-barber-gold hover:bg-barber-gold/90 text-black text-lg font-semibold rounded-lg"
            >
              {isBooking ? "Booking..." : "Book Appointment"}
            </Button>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}