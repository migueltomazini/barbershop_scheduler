"use client";

import React, { useState } from "react";

import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { mockServices } from "@/app/data/mockData";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function Appointments() {
  const { isAuthenticated, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  // Available time slots
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", 
    "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
  ];
  
  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book an appointment");
      return;
    }
    
    if (!selectedDate || !selectedService || !selectedTime) {
      toast.error("Please select a date, service, and time");
      return;
    }
    
    // In a real app, this would send the data to a backend
    toast.success("Appointment booked successfully!");
    
    // Reset form
    setSelectedDate(undefined);
    setSelectedService("");
    setSelectedTime("");
  };
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold font-serif text-barber-brown mb-4">
            Book Your Appointment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your preferred service, date and time, and we'll reserve your spot.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border border-barber-cream p-6">
            {!isAuthenticated ? (
              <div className="text-center p-6">
                <h2 className="text-xl font-medium mb-4">Login Required</h2>
                <p className="text-muted-foreground mb-6">
                  Please login to book an appointment.
                </p>
                <Button className="bg-barber-brown hover:bg-barber-dark-brown">
                  Login
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold mb-6">1. Choose a Date</h2>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-barber-cream"
                    disabled={(date) => {
                      // Disable past dates and Sundays
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today || date.getDay() === 0;
                    }}
                  />
                  
                  <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">2. Select a Service</h2>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="border-barber-cream">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockServices.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - ${service.price.toFixed(2)} • {service.duration} min
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-6">3. Choose a Time</h2>
                  {selectedDate ? (
                    <>
                      <p className="text-sm mb-4 flex items-center text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Available times for {format(selectedDate, "EEEE, MMMM d")}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                            className={`justify-start ${
                              selectedTime === time 
                                ? "bg-barber-navy hover:bg-barber-navy/90" 
                                : "border-barber-cream"
                            }`}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-48 border border-dashed border-barber-cream rounded-md">
                      <p className="text-muted-foreground">Select a date first</p>
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">4. Confirm Booking</h2>
                    
                    {selectedDate && selectedService && selectedTime ? (
                      <div className="bg-barber-cream rounded-md p-4 mb-6">
                        <p className="mb-2">
                          <strong>Date:</strong> {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="mb-2">
                          <strong>Time:</strong> {selectedTime}
                        </p>
                        <p className="mb-2">
                          <strong>Service:</strong> {mockServices.find(s => s.id === selectedService)?.name}
                        </p>
                        <p>
                          <strong>Client:</strong> {user?.name}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground mb-6">
                        Please select date, service, and time to complete your booking.
                      </p>
                    )}
                    
                    <Button
                      onClick={handleBookAppointment}
                      disabled={!selectedDate || !selectedService || !selectedTime}
                      className="w-full bg-barber-gold hover:bg-barber-gold/90 text-black"
                    >
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}