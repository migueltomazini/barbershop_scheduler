'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/app/components/ui/select';
import { mockServices } from '@/app/data/mockData';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Navbar } from '@/app/components/layout/navbar';
import { Footer } from '@/app/components/layout/footer';

// Generate times between 9:00 AM and 5:30 PM at 30-minute intervals
function generateTimes(startHour = 9, endHour = 17, interval = 30) {
  const times: string[] = [];
  let date = new Date();
  date.setHours(startHour, 0, 0, 0);
  const end = new Date();
  end.setHours(endHour, 30, 0, 0);
  while (date <= end) {
    times.push(format(date, 'h:mm aa'));
    date = new Date(date.getTime() + interval * 60000);
  }
  return times;
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const availableTimes = generateTimes();

  const handleBooking = () => {
    if (!selectedDate || !selectedService || !selectedTime) {
      toast.error('Please fill out all fields before booking.');
      return;
    }
    toast.success('Appointment booked successfully!');
    setSelectedDate('');
    setSelectedService('');
    setSelectedTime('');
  };

  const selectedServiceObj = mockServices.find(
    (s) => s.id.toString() === selectedService
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2 text-center">Book Your Appointment</h1>
        <p className="mb-8 text-center text-gray-600 max-w-xl">
          Select your preferred service, date and time, and we'll reserve your spot.
        </p>

        <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg">
          {/* Top: Date & Service | Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Service */}
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Choose a Date</h2>
                <div className="relative">
                  <CalendarIcon className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 h-12 w-full border border-barber-cream rounded-lg p-2 text-lg"
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">2. Select a Service</h2>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-12 w-full border border-barber-cream rounded-lg">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockServices.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} - ${service.price.toFixed(2)} • {service.duration} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>
            </div>

            {/* Time slots */}
            <section>
              <h2 className="text-xl font-semibold mb-2">3. Choose a Time</h2>
              {!selectedDate ? (
                <div className="border border-barber-cream rounded-lg p-4 text-center text-gray-500">
                  Select a date first
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      onClick={() => setSelectedTime(time)}
                      className="h-12 w-full justify-start"
                    >
                      <Clock className="mr-2" /> {time}
                    </Button>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Confirmation */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-2">4. Confirm Booking</h2>
            {!(selectedDate && selectedService && selectedTime) ? (
              <div className="p-4 bg-barber-cream rounded-lg">
                Please select date, service, and time to complete your booking.
              </div>
            ) : (
              <div className="p-4 bg-barber-cream rounded-lg space-y-1">
                <p><strong>Date:</strong> {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Service:</strong> {selectedServiceObj?.name}</p>
                <p><strong>Client:</strong> {user?.name}</p>
              </div>
            )}
            <Button
              onClick={handleBooking}
              disabled={!(selectedDate && selectedService && selectedTime)}
              className="mt-4 w-full h-12 bg-barber-gold hover:bg-barber-gold/90 text-black rounded-lg"
            >
              Book Appointment
            </Button>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
