/**
 * @file app/components/sections/appointments/AppointmentClientPage.tsx
 * @description This is a comprehensive client-side React component for managing barber shop appointments.
 * It handles booking new appointments, viewing and managing existing ones, and editing or canceling scheduled appointments.
 * The component uses several UI primitives (buttons, dialogs, selects) and integrates with server actions for appointment CRUD operations.
 */

"use client";

import { Label } from "@/app/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/app/components/ui/dialog";
import { toast } from "sonner";
import { Clock, Calendar as CalendarIconLucide, Pencil, Trash2 } from "lucide-react";
import { format, addYears, isPast, parseISO } from "date-fns";
import { ServiceType as AppServiceType, Appointment as NewAppointmentDataType } from "@/app/types";
import { getBookedTimes, bookAppointmentAction, cancelAppointmentAction, updateAppointmentAction } from "@/app/actions/appointmentActions";

/**
 * Utility function to generate an array of time slots from start to end hours with a given interval in minutes.
 * @param startHour - starting hour in 24h format (default 9)
 * @param endHour - ending hour in 24h format (default 17)
 * @param interval - interval in minutes between time slots (default 30)
 * @returns string[] - array of time slots formatted as "HH:mm"
 */
function generateTimes(startHour = 9, endHour = 17, interval = 30) {
  const times: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      if (hour === endHour && minute >= interval) break;
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      times.push(time);
    }
  }
  return times;
}

/**
 * Get today's date as a string in the "yyyy-MM-dd" format, suitable for date input min attribute.
 */
const getTodayDateString = () => format(new Date(), "yyyy-MM-dd");

/**
 * Get the maximum selectable date, one year from today, as a string in the "yyyy-MM-dd" format.
 */
const getMaxDateString = () => format(addYears(new Date(), 1), "yyyy-MM-dd");

/**
 * Checks if a given date and time string represent a datetime in the past.
 * @param date - string in "yyyy-MM-dd" format
 * @param time - string in "HH:mm" format
 * @returns boolean - true if the datetime is in the past or inputs are invalid
 */
const isTimeSlotPast = (date: string, time: string): boolean => {
  if (!date || !time) return true;
  return isPast(new Date(`${date}T${time}:00`));
};

interface AppointmentClientPageProps {
  services: AppServiceType[];
  initialAppointments: NewAppointmentDataType[];
  session: {
    isAuthenticated: boolean;
    user?: { _id: string; name: string };
  };
}

/**
 * @component AppointmentClientPage
 * @description Main client-side page component for appointment booking and management.
 * - Allows authenticated users to book new appointments by selecting service, date, and available time.
 * - Shows user's existing appointments with options to edit or cancel upcoming ones.
 * - Uses dialogs for editing appointments with real-time validations and updates.
 * - Integrates toast notifications for feedback on user actions.
 */
export default function AppointmentClientPage({
  services,
  initialAppointments,
  session,
}: AppointmentClientPageProps) {
  const router = useRouter();
  const { isAuthenticated, user } = session;

  // UI state
  const [activeTab, setActiveTab] = useState<"book" | "manage">("book");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Booking and loading states
  const [isBooking, setIsBooking] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  // Editing appointment states
  const [editingAppointment, setEditingAppointment] = useState<NewAppointmentDataType | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Effect: Redirect to login if not authenticated, with feedback
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to book or manage your appointments.");
      router.push("/login?redirect=/appointments");
    }
  }, [isAuthenticated, router]);

  // Effect: Fetch already booked times when a date is selected
  useEffect(() => {
    if (!selectedDate) {
      setBookedTimes([]);
      return;
    }
    const fetchBookedTimes = async () => {
      setIsLoadingTimes(true);
      const times = await getBookedTimes(selectedDate);
      setBookedTimes(times);
      setIsLoadingTimes(false);
    };
    fetchBookedTimes();
  }, [selectedDate]);

  /**
   * Handles booking a new appointment by validating inputs, calling the backend action,
   * and providing user feedback.
   */
  const handleBooking = async () => {
    if (!user?._id) return toast.error("Authentication error.");
    if (!selectedDate || !selectedServiceId || !selectedTime)
      return toast.error("Please fill out all fields.");
    if (isTimeSlotPast(selectedDate, selectedTime))
      return toast.error("Cannot book in the past.");

    setIsBooking(true);
    const result = await bookAppointmentAction({
      userId: user._id,
      serviceId: selectedServiceId,
      date: selectedDate,
      time: selectedTime,
    });
    if (result.success) {
      toast.success(result.message);
      setActiveTab("manage");
      setSelectedDate("");
      setSelectedServiceId("");
      setSelectedTime("");
    } else {
      toast.error(result.message);
    }
    setIsBooking(false);
  };

  /**
   * Handles canceling an existing appointment after user confirmation.
   * @param appointmentId - ID of the appointment to cancel
   */
  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    const result = await cancelAppointmentAction(appointmentId);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  /**
   * Opens the editing modal and pre-fills fields with the current appointment's date and time.
   * @param appointment - appointment object to edit
   */
  const handleOpenEditModal = (appointment: NewAppointmentDataType) => {
    setEditingAppointment(appointment);
    const appointmentDate = parseISO(appointment.date);
    setNewDate(format(appointmentDate, "yyyy-MM-dd"));
    setNewTime(format(appointmentDate, "HH:mm"));
  };

  /**
   * Handles updating an existing appointment with new date and time,
   * invoking the update action and providing feedback.
   */
  const handleUpdateAppointment = async () => {
    if (!editingAppointment?._id) return;
    setIsUpdating(true);
    const result = await updateAppointmentAction(editingAppointment._id, newDate, newTime);
    if (result.success) {
      toast.success(result.message);
      setEditingAppointment(null);
    } else {
      toast.error(result.message);
    }
    setIsUpdating(false);
  };

  // Generate all possible time slots for selection
  const allAvailableTimes = generateTimes();

  // Filter times to exclude past and already booked slots for the selected date
  const filteredTimes = allAvailableTimes.filter(
    (time) => !isTimeSlotPast(selectedDate, time) && !bookedTimes.includes(time)
  );

  return (
    <main className="container mx-auto px-4 py-12 flex flex-col items-center w-full max-w-4xl">
      <div className="w-full">
        {/* Tab switcher between booking new and managing existing appointments */}
        <div className="flex justify-center mb-8">
          <div className="bg-barber-cream p-1 rounded-lg inline-flex">
            <Button
              onClick={() => setActiveTab("book")}
              variant={activeTab === "book" ? "default" : "ghost"}
              className="px-6 data-[state=active]:bg-barber-brown data-[state=active]:text-white"
            >
              Book New
            </Button>
            <Button
              onClick={() => setActiveTab("manage")}
              variant={activeTab === "manage" ? "default" : "ghost"}
              className="px-6 data-[state=active]:bg-barber-brown data-[state=active]:text-white"
            >
              My Appointments
            </Button>
          </div>
        </div>

        {/* Booking tab content */}
        {activeTab === "book" && (
          <div className="bg-white p-8 rounded-lg shadow-lg border border-barber-cream">
            <h2 className="text-2xl font-bold font-serif text-barber-brown mb-6 text-center">
              Book an Appointment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Service selector */}
              <div>
                <label
                  htmlFor="service-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Service
                </label>
                <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service._id} value={service._id}>
                        {service.name} - ${service.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date picker */}
              <div>
                <label
                  htmlFor="date-picker"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date-picker"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getTodayDateString()}
                  max={getMaxDateString()}
                  className="w-full h-10 border-input rounded-md p-2 border"
                />
              </div>

              {/* Time selector */}
              <div>
                <label
                  htmlFor="time-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Time
                </label>
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                  disabled={!selectedDate || isLoadingTimes}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isLoadingTimes ? "Loading times..." : "Select a time"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingTimes ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">Loading...</div>
                    ) : filteredTimes.length > 0 ? (
                      filteredTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">No available times</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button
                onClick={handleBooking}
                disabled={isBooking || !selectedServiceId || !selectedDate || !selectedTime}
                className="bg-barber-gold hover:bg-barber-gold/90 text-black font-bold px-10 py-3 text-lg"
              >
                <CalendarIconLucide className="h-5 w-5 mr-2" />
                {isBooking ? "Booking..." : "Book Now"}
              </Button>
            </div>
          </div>
        )}

        {/* Manage appointments tab content */}
        {activeTab === "manage" && (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-barber-cream w-full">
            <h2 className="text-2xl font-bold font-serif text-barber-brown mb-6">
              My Appointments
            </h2>
            <div className="space-y-4">
              {initialAppointments.length > 0 ? (
                initialAppointments.map((app) => (
                  <div
                    key={app._id}
                    className="border p-4 rounded-md flex justify-between items-center flex-wrap gap-2"
                  >
                    <div>
                      <p className="font-bold text-barber-navy">
                        {(app as any).service?.name || "Service not found"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(parseISO(app.date), "MMMM dd, yyyy")} at{" "}
                        {format(parseISO(app.date), "p")}
                      </p>
                      <span
                        className={`capitalize text-xs font-semibold px-2 py-1 rounded-full ${
                          app.status === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : app.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    {app.status === "scheduled" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditModal(app)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelAppointment(app._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  You have no appointments scheduled.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit appointment modal dialog */}
      <Dialog open={!!editingAppointment} onOpenChange={() => setEditingAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>New Date</Label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={getTodayDateString()}
                className="w-full h-10 border-input rounded-md p-2 border"
              />
            </div>
            <div>
              <Label>New Time</Label>
              <Select value={newTime} onValueChange={setNewTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allAvailableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateAppointment} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
