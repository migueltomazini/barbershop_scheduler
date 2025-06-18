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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/app/components/ui/dialog";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";
import { Clock, Calendar as CalendarIconLucide, Pencil, Trash2 } from "lucide-react";
import { format, addYears, isPast, parseISO, isBefore, startOfDay } from "date-fns";
import { Navbar } from "@/app/components/layout/navbar";
import { Footer } from "@/app/components/layout/footer";
import {
  ServiceType as AppServiceType,
  Appointment as NewAppointmentDataType,
} from "@/app/types";

const API_BASE_URL = "http://localhost:3001";

// --- Funções Auxiliares ---
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

const isTimeSlotPast = (date: string, time: string): boolean => {
  if (!date || !time) return true;
  const dateTimeString = `${date}T${time}:00`;
  return isPast(new Date(dateTimeString));
};

// --- Componente Principal ---
export default function AppointmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Estado geral
  const [services, setServices] = useState<AppServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const allAvailableTimes = generateTimes();

  // Estado das Abas
  const [activeTab, setActiveTab] = useState<"book" | "manage">("book");

  // --- Estados da Aba "Fazer Agendamento" ---
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);

  // --- Estados da Aba "Meus Agendamentos" ---
  const [myAppointments, setMyAppointments] = useState<NewAppointmentDataType[]>([]);
  const [loadingMyAppointments, setLoadingMyAppointments] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<NewAppointmentDataType | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);


  // Efeito para redirecionar se não estiver logado
  useEffect(() => {
    if (user !== undefined && !isAuthenticated) {
      toast.error("Please log in to manage your appointments.");
      router.push("/login?redirect=/appointments");
    }
  }, [user, isAuthenticated, router]);

  // Efeito para buscar serviços
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

  // Efeito para buscar os agendamentos do usuário
  useEffect(() => {
    const fetchMyAppointments = async () => {
      if (!user) {
        setMyAppointments([]);
        setLoadingMyAppointments(false);
        return;
      }
      setLoadingMyAppointments(true);
      try {
        const response = await fetch(`${API_BASE_URL}/appointments?clientId=${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch your appointments.");
        const data: NewAppointmentDataType[] = await response.json();
        // Ordena os agendamentos do mais recente para o mais antigo
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setMyAppointments(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load your appointments.");
      } finally {
        setLoadingMyAppointments(false);
      }
    };

    if (isAuthenticated) {
        fetchMyAppointments();
    }
  }, [user, isAuthenticated]);
  
  // Função para lidar com o agendamento
  const handleBooking = async () => {
    // (a lógica existente de handleBooking permanece a mesma)
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
      const newAppointment = await response.json();
      toast.success("Appointment booked successfully!");
      // Adiciona o novo agendamento à lista local e muda para a aba de gerenciamento
      setMyAppointments(prev => [newAppointment, ...prev]);
      setActiveTab("manage");
      // Limpa os campos do formulário de agendamento
      setSelectedDate("");
      setSelectedServiceId("");
      setSelectedTime("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred while booking.");
    } finally {
      setIsBooking(false);
    }
  };

  // Função para cancelar um agendamento
  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
        // Opção 1: Deletar o agendamento
        // const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, { method: "DELETE" });
        
        // Opção 2: Marcar como cancelado (preferível para manter histórico)
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "canceled" }),
        });

        if (!response.ok) throw new Error("Failed to cancel appointment.");

        toast.success("Appointment canceled successfully.");
        setMyAppointments(prev =>
            prev.map(app =>
                app.id === appointmentId ? { ...app, status: "canceled" } : app
            )
        );
    } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not cancel appointment.");
    }
  };
  
  // Função para abrir o modal de edição
  const handleOpenEditModal = (appointment: NewAppointmentDataType) => {
    setEditingAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
  };

  // Função para atualizar um agendamento
  const handleUpdateAppointment = async () => {
    if (!editingAppointment || !newDate || !newTime) {
        toast.error("Please select a new date and time.");
        return;
    }
    if (isTimeSlotPast(newDate, newTime)) {
        toast.error("Cannot move appointment to a past date or time.");
        return;
    }

    setIsUpdating(true);
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${editingAppointment.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: newDate, time: newTime }),
        });
        if (!response.ok) throw new Error("Failed to update appointment.");

        const updatedAppointment = await response.json();
        toast.success("Appointment updated successfully!");
        setMyAppointments(prev => prev.map(app => app.id === updatedAppointment.id ? updatedAppointment : app));
        setEditingAppointment(null); // Fecha o modal
    } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not update appointment.");
    } finally {
        setIsUpdating(false);
    }
  };

  const selectedServiceObj = services.find(s => s.id.toString() === selectedServiceId);
  const filteredBookingTimes = selectedDate
    ? allAvailableTimes.filter(time => !isTimeSlotPast(selectedDate, time))
    : [];
  
  const filteredEditingTimes = newDate
    ? allAvailableTimes.filter(time => !isTimeSlotPast(newDate, time))
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
        {/* Seletor de Abas */}
        <div className="flex w-full max-w-md mx-auto mb-8 bg-gray-200 rounded-lg p-1">
          <Button
            onClick={() => setActiveTab("book")}
            variant={activeTab === 'book' ? 'default' : 'ghost'}
            className={`w-1/2 ${activeTab === 'book' ? 'bg-barber-gold text-black shadow' : ''}`}
          >
            Book Appointment
          </Button>
          <Button
            onClick={() => setActiveTab("manage")}
            variant={activeTab === 'manage' ? 'default' : 'ghost'}
            className={`w-1/2 ${activeTab === 'manage' ? 'bg-barber-gold text-black shadow' : ''}`}
          >
            My Appointments
          </Button>
        </div>

        {/* Conteúdo da Aba de Agendamento */}
        {activeTab === "book" && (
            <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 animate-in fade-in-50">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center font-serif text-barber-brown">
                Book Your Appointment
                </h1>
                <p className="mb-8 text-center text-muted-foreground max-w-xl">
                Select your preferred service, date, and time, and we&apos;ll reserve your spot.
                </p>
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
                        {filteredBookingTimes.length > 0 ? (
                        filteredBookingTimes.map((time) => (
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
        )}
        
        {/* Conteúdo da Aba de Gerenciamento */}
        {activeTab === "manage" && (
            <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 animate-in fade-in-50">
                 <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center font-serif text-barber-brown">
                    My Appointments
                </h1>
                {loadingMyAppointments ? (
                    <p className="text-center text-muted-foreground">Loading your appointments...</p>
                ) : myAppointments.length === 0 ? (
                    <p className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">You have no appointments scheduled.</p>
                ) : (
                    <div className="space-y-4">
                        {myAppointments.map(app => {
                            const isFuture = !isBefore(parseISO(`${app.date}T${app.time}`), startOfDay(new Date()));
                            const isScheduled = app.status === "scheduled";
                            return (
                                <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg shadow-sm">
                                    <div className="mb-4 sm:mb-0">
                                        <p className="font-bold text-lg text-barber-brown">{app.serviceName}</p>
                                        <p className="text-muted-foreground">{format(parseISO(app.date), "EEEE, dd MMMM yyyy")} at {app.time}</p>
                                        <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                                            app.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                            app.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>{app.status}</span>
                                    </div>
                                    {isFuture && isScheduled && (
                                        <div className="flex space-x-2 w-full sm:w-auto">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(app)} className="flex-1 sm:flex-auto">
                                                <Pencil className="mr-2 h-4 w-4" /> Modify
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleCancelAppointment(app.id)} className="flex-1 sm:flex-auto">
                                                <Trash2 className="mr-2 h-4 w-4" /> Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}

      </div>
      
      {/* Modal de Edição */}
      <Dialog open={!!editingAppointment} onOpenChange={(isOpen) => !isOpen && setEditingAppointment(null)}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Modify Appointment</DialogTitle>
                <DialogDescription>
                    Select a new date and time for your appointment.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <label htmlFor="newDate" className="text-sm font-medium">New Date</label>
                    <input
                        id="newDate"
                        type="date"
                        value={newDate}
                        onChange={(e) => {
                            setNewDate(e.target.value);
                            setNewTime(""); // Reset time when date changes
                        }}
                        min={getTodayDateString()}
                        max={getMaxDateString()}
                        className="h-10 w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">New Time</label>
                     {!newDate ? (
                        <div className="border rounded-md p-4 h-full flex items-center justify-center text-center text-gray-500 text-sm">
                            Please select a date first.
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1 border rounded-md">
                            {filteredEditingTimes.length > 0 ? (
                                filteredEditingTimes.map(time => (
                                    <Button
                                        key={time}
                                        variant={newTime === time ? "default" : "outline"}
                                        onClick={() => setNewTime(time)}
                                        className={`h-10 text-xs ${newTime === time ? 'bg-barber-gold text-black' : ''}`}
                                    >
                                        {time}
                                    </Button>
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500 p-2">No available times.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <Button onClick={handleUpdateAppointment} disabled={isUpdating || !newDate || !newTime}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </>
  );
}