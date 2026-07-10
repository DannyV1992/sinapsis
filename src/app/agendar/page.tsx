"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePostHog } from "posthog-js/react";
import { gtagEvent } from "@/lib/gtag";
import { getWhatsAppLink, config } from "@/lib/config";

const services = [
  "Terapia individual",
  "Terapia de pareja",
  "Terapia familiar",
];

interface TimeSlot {
  start: string;
  end: string;
}

export default function AgendarPage() {
  const posthog = usePostHog();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    modality: "",
    date: "",
    slot: null as TimeSlot | null,
    notes: "",
  });
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [noSlots, setNoSlots] = useState(false);
  const [nextAvailable, setNextAvailable] = useState("");
  const [nextAvailableOther, setNextAvailableOther] = useState("");
  const [presencialData, setPresencialData] = useState({
    location: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [presencialAmPm, setPresencialAmPm] = useState("PM");
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [presencialSuccess, setPresencialSuccess] = useState(false);
  const [error, setError] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!formData.date || !formData.service || !formData.modality) return;

    setLoadingSlots(true);
    setNoSlots(false);
    setNextAvailable("");
    setNextAvailableOther("");
    setAvailableSlots([]);
    setFormData((prev) => ({ ...prev, slot: null }));

    fetch(`/api/calendar/available-slots?date=${formData.date}&modality=${formData.modality}&service=${encodeURIComponent(formData.service)}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.slots && data.slots.length > 0) {
          setAvailableSlots(data.slots);
        } else {
          setNoSlots(true);
          const selectedDate = new Date(formData.date + "T12:00:00");
          const otherModality = formData.modality === "presencial" ? "virtual" : "presencial";
          let foundSame = false;
          let foundOther = false;

          // Primero revisar el mismo día en la otra modalidad
          try {
            const res = await fetch(`/api/calendar/available-slots?date=${formData.date}&modality=${otherModality}&service=${encodeURIComponent(formData.service)}`);
            const otherData = await res.json();
            if (otherData.slots && otherData.slots.length > 0) {
              setNextAvailableOther(formData.date);
              foundOther = true;
            }
          } catch {}

          for (let i = 1; i <= 30; i++) {
            if (foundSame && foundOther) break;

            const nextDate = new Date(selectedDate);
            nextDate.setDate(nextDate.getDate() + i);
            const dateStr = nextDate.toISOString().split("T")[0];

            try {
              // Buscar en la misma modalidad
              if (!foundSame) {
                const res = await fetch(`/api/calendar/available-slots?date=${dateStr}&modality=${formData.modality}&service=${encodeURIComponent(formData.service)}`);
                const nextData = await res.json();
                if (nextData.slots && nextData.slots.length > 0) {
                  setNextAvailable(dateStr);
                  foundSame = true;
                }
              }

              // Buscar en la otra modalidad
              if (!foundOther) {
                const res = await fetch(`/api/calendar/available-slots?date=${dateStr}&modality=${otherModality}&service=${encodeURIComponent(formData.service)}`);
                const nextData = await res.json();
                if (nextData.slots && nextData.slots.length > 0) {
                  setNextAvailableOther(dateStr);
                  foundOther = true;
                }
              }
            } catch {
              break;
            }
          }
        }
      })
      .catch(() => setError("Error al cargar horarios disponibles"))
      .finally(() => setLoadingSlots(false));
  }, [formData.date, formData.service, formData.modality]);

  const handleNext = () => {
    posthog?.capture("booking_step_completed", {
      step,
      service: formData.service,
      modality: formData.modality,
    });
    setDirection(1);
    setStep(step + 1);
  };
  const handleBack = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  const handlePresencialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);
    setError("");
    try {
      const res = await fetch("/api/calendar/request-presencial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          location: presencialData.location,
          preferredDate: presencialData.preferredDate,
          preferredTime: presencialData.preferredTime ? `${presencialData.preferredTime} ${presencialAmPm}` : "",
          notes: formData.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        posthog?.capture("booking_step_completed", { step: 3, service: formData.service, modality: "presencial" });
        gtagEvent("purchase", {
          currency: "CRC",
          value: formData.service === "Terapia individual" ? 30000 : 45000,
          item_name: formData.service,
        });
        window.gtag?.("event", "conversion", { send_to: "AW-18306929852/AVLPCNXzls4cELyptplE", currency: "USD", value: 1.0 });
        setPresencialSuccess(true);
      } else {
        setError(data.error || "Error al enviar la solicitud");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setBooking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slot) return;

    setBooking(true);
    setError("");

    try {
      const res = await fetch("/api/calendar/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: formData.slot.start,
          end: formData.slot.end,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          modality: formData.modality,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        posthog?.capture("booking_completed", {
          service: formData.service,
          modality: formData.modality,
        });
        gtagEvent("purchase", {
          currency: "CRC",
          value: formData.service === "Terapia individual" ? 30000 : 45000,
          item_name: formData.service,
        });
        window.gtag?.("event", "conversion", { send_to: "AW-18306929852/AVLPCNXzls4cELyptplE", currency: "USD", value: 1.0 });
        setBookingSuccess(true);
      } else {
        setError(data.error || "Error al agendar la cita");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setBooking(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("es-CR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("es-CR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stepVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
  };

  if (presencialSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center"
      >
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground mb-3">¡Solicitud enviada!</h1>
          <p className="text-foreground/60 mb-6 leading-relaxed">
            Recibimos tu solicitud de cita presencial en <strong>{presencialData.location}</strong>. Te confirmaremos el horario por correo o WhatsApp en menos de 24 horas.
          </p>
          <div className="bg-section-alt rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Servicio:</span>
              <span className="font-medium">{formData.service}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Ubicación preferida:</span>
              <span className="font-medium">{presencialData.location}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Fecha preferida:</span>
              <span className="font-medium">{formatDate(presencialData.preferredDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Hora preferida:</span>
              <span className="font-medium">{presencialData.preferredTime} {presencialAmPm}</span>
            </div>
          </div>
          <p className="text-xs text-foreground/50 mb-6">Recibirás un correo de confirmación en {formData.email}</p>
          <a href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
            Volver al inicio
          </a>
        </div>
      </motion.div>
    );
  }

  if (bookingSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center"
      >
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            ¡Cita agendada!
          </h1>
          <p className="text-foreground/60 mb-2">
            Tu cita ha sido confirmada para:
          </p>
          <div className="bg-section-alt rounded-xl p-4 mb-6">
            <p className="font-semibold">{formData.service}</p>
            <p className="text-sm text-foreground/60">
              {formatDate(formData.date)} a las{" "}
              {formData.slot && formatTime(formData.slot.start)}
            </p>
          </div>
          <p className="text-sm text-foreground/60 mb-6">
            Recibirás un correo de confirmación en {formData.email}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen pt-24 pb-16 px-4"
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-2 font-[family-name:var(--font-playfair)]">
          Agendar cita
        </h1>
        <p className="text-foreground/60 text-center mb-10">
          Selecciona el horario que mejor te funcione según la disponibilidad
          real.
        </p>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <motion.div
                animate={{
                  scale: step === s ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-foreground/40"
                }`}
              >
                {s}
              </motion.div>
              {s < 3 && (
                <div
                  className={`w-12 h-0.5 transition-colors duration-300 ${
                    step > s ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form
          onSubmit={formData.modality === "presencial" ? handlePresencialSubmit : handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Personal info */}
            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold mb-4">Datos personales</h2>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground/70 mb-1"
                  >
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground/70 mb-1"
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-foreground/70 mb-1"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    !formData.name || !formData.email || !formData.phone
                  }
                  className="w-full mt-4 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </motion.div>
            )}

            {/* Step 2: Service, date and time from calendar */}
            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold mb-4">
                  Servicio y horario
                </h2>
                <div>
                  <label
                    htmlFor="service"
                    className="block text-sm font-medium text-foreground/70 mb-1"
                  >
                    Servicio
                  </label>
                  <select
                    id="service"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                  >
                    <option value="">Selecciona un servicio</option>
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Modalidad
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, modality: "presencial", slot: null })}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        formData.modality === "presencial"
                          ? "bg-primary text-white border-primary"
                          : "border-gray-200 text-foreground/70 hover:border-primary"
                      }`}
                    >
                      Presencial
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, modality: "virtual" })}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        formData.modality === "virtual"
                          ? "bg-primary text-white border-primary"
                          : "border-gray-200 text-foreground/70 hover:border-primary"
                      }`}
                    >
                      Virtual
                    </button>
                  </div>
                </div>
                {/* Campos según modalidad */}
                {formData.modality === "presencial" ? (
                  <>
                    <div className="p-3 bg-primary/15 border border-primary/30 rounded-xl text-sm text-primary-dark leading-relaxed">
                      Las citas presenciales se coordinan según disponibilidad. Envía tu preferencia y te confirmo en menos de 24 horas.
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-foreground/70 mb-1">
                        Ubicación preferida
                      </label>
                      <select
                        id="location"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={presencialData.location}
                        onChange={(e) => setPresencialData({ ...presencialData, location: e.target.value })}
                      >
                        <option value="">Selecciona una ubicación</option>
                        {config.presencialLocations.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="presencial-date" className="block text-sm font-medium text-foreground/70 mb-1">
                        Fecha preferida
                      </label>
                      <input
                        type="date"
                        id="presencial-date"
                        required
                        min={today}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={presencialData.preferredDate}
                        onChange={(e) => setPresencialData({ ...presencialData, preferredDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="presencial-time" className="block text-sm font-medium text-foreground/70 mb-1">
                        Hora preferida
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          placeholder="H"
                          required
                          className="w-16 px-3 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center text-sm"
                          value={presencialData.preferredTime.split(":")[0] ?? ""}
                          onChange={(e) => {
                            const hh = e.target.value.replace(/\D/g, "").slice(0, 2);
                            const mm = presencialData.preferredTime.split(":")[1] ?? "";
                            setPresencialData({ ...presencialData, preferredTime: `${hh}:${mm}` });
                          }}
                        />
                        <span className="text-foreground/40 font-medium">:</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          placeholder="MM"
                          required
                          className="w-16 px-3 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center text-sm"
                          value={presencialData.preferredTime.split(":")[1] ?? ""}
                          onChange={(e) => {
                            const mm = e.target.value.replace(/\D/g, "").slice(0, 2);
                            const hh = presencialData.preferredTime.split(":")[0] ?? "";
                            setPresencialData({ ...presencialData, preferredTime: `${hh}:${mm}` });
                          }}
                        />
                        <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-medium ml-1">
                          {["AM", "PM"].map((period) => (
                            <button
                              key={period}
                              type="button"
                              onClick={() => setPresencialAmPm(period)}
                              className={`px-4 py-3 transition-colors ${
                                presencialAmPm === period
                                  ? "bg-primary text-white"
                                  : "text-foreground/60 hover:bg-gray-50"
                              }`}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-foreground/70 mb-1"
                      >
                        Fecha
                      </label>
                      <input
                        type="date"
                        id="date"
                        required
                        min={today}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                      />
                    </div>

                    {/* Available time slots */}
                    {formData.date && (
                      <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-2">
                          Horarios disponibles
                        </label>

                        {loadingSlots && (
                          <div className="flex items-center gap-2 py-4 text-foreground/50">
                            <svg
                              className="w-5 h-5 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Consultando disponibilidad...
                          </div>
                        )}

                        {noSlots && !loadingSlots && (
                          <div className="py-4 px-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm space-y-2">
                            {(nextAvailable || nextAvailableOther) ? (
                              <>
                                <p>No hay horarios disponibles en modalidad <strong>{formData.modality}</strong> para esta fecha.</p>

                                {nextAvailable && (
                                  <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, date: nextAvailable })}
                                    className="block text-primary font-medium hover:underline"
                                  >
                                    Próximo {formData.modality}: {formatDate(nextAvailable)} →
                                  </button>
                                )}

                                {nextAvailableOther && (
                                  <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, modality: formData.modality === "presencial" ? "virtual" : "presencial", date: nextAvailableOther })}
                                    className="block text-primary font-medium hover:underline"
                                  >
                                    Próximo {formData.modality === "presencial" ? "virtual" : "presencial"}: {formatDate(nextAvailableOther)} →
                                  </button>
                                )}
                              </>
                            ) : (
                              <div>
                                <p>No hay citas disponibles en ninguna modalidad para los próximos 30 días.</p>
                                <a
                                  href={getWhatsAppLink("Hola, vengo desde tu sitio web y quiero agendar una cita pero no encontré disponibilidad.")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 mt-2 text-green-700 font-medium hover:underline"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                  </svg>
                                  Coordinar por WhatsApp
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {availableSlots.length > 0 && !loadingSlots && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {availableSlots.map((slot, index) => (
                              <motion.button
                                key={slot.start}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: index * 0.05,
                                  ease: "easeOut",
                                }}
                                type="button"
                                onClick={() =>
                                  setFormData({ ...formData, slot })
                                }
                                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                  formData.slot?.start === slot.start
                                    ? "bg-primary text-white border-primary"
                                    : "border-gray-200 text-foreground/70 hover:border-primary"
                                }`}
                              >
                                {formatTime(slot.start)}
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-foreground/70 rounded-xl font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      !formData.service || !formData.modality || (
                        formData.modality === "presencial"
                          ? !presencialData.location || !presencialData.preferredDate || !/^\d{1,2}:\d{2}$/.test(presencialData.preferredTime)
                          : !formData.date || !formData.slot
                      )
                    }
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold mb-4">
                  {formData.modality === "presencial" ? "Confirmar solicitud" : "Confirmar cita"}
                </h2>
                {formData.modality === "presencial" && (
                  <div className="p-3 bg-primary/15 border border-primary/30 rounded-xl text-sm text-primary-dark leading-relaxed">
                    Esta es una <strong>solicitud</strong>, no una cita confirmada. Te responderemos en menos de 24 horas.
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
                  className="bg-section-alt rounded-xl p-4 space-y-3"
                >
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/60">Nombre:</span>
                    <span className="text-sm font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/60">Email:</span>
                    <span className="text-sm font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/60">Servicio:</span>
                    <span className="text-sm font-medium">{formData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/60">Modalidad:</span>
                    <span className="text-sm font-medium capitalize">{formData.modality}</span>
                  </div>
                  {formData.modality === "presencial" ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground/60">Ubicación preferida:</span>
                        <span className="text-sm font-medium">{presencialData.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground/60">Fecha preferida:</span>
                        <span className="text-sm font-medium">{formatDate(presencialData.preferredDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground/60">Hora preferida:</span>
                        <span className="text-sm font-medium">{presencialData.preferredTime} {presencialAmPm}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground/60">Fecha:</span>
                        <span className="text-sm font-medium">{formatDate(formData.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground/60">Hora:</span>
                        <span className="text-sm font-medium">
                          {formData.slot && formatTime(formData.slot.start)} —{" "}
                          {formData.slot && formatTime(formData.slot.end)}
                        </span>
                      </div>
                    </>
                  )}
                </motion.div>
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-foreground/70 mb-1"
                  >
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="¿Hay algo que quieras compartir antes de la cita?"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
                <div className="p-4 bg-section-alt rounded-xl">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="w-6 align-top pt-0.5">
                          <input
                            type="checkbox"
                            checked={acceptedPolicy}
                            onChange={(e) => setAcceptedPolicy(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                          />
                        </td>
                        <td className="text-xs text-foreground/60 leading-relaxed pl-2">
                          He leído y acepto las{" "}
                          <a
                            href="/politicas"
                            target="_blank"
                            className="text-primary underline hover:text-primary-dark"
                          >
                            políticas de cancelación
                          </a>
                          . Entiendo que cancelaciones con menos de 48 horas de anticipación no son reembolsables ni reprogramables.
                        </td>
                      </tr>
                      <tr>
                        <td className="w-6 align-top pt-2">
                          <span className="text-sm">ℹ️</span>
                        </td>
                        <td className="text-xs text-foreground/60 leading-relaxed pl-2 pt-2">
                          Si es tu primera cita, por favor lee el{" "}
                          <a
                            href="/consentimiento"
                            target="_blank"
                            className="text-primary underline hover:text-primary-dark"
                          >
                            consentimiento informado
                          </a>.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-foreground/70 rounded-xl font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={booking || !acceptedPolicy}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {booking ? (
                      <>
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        {formData.modality === "presencial" ? "Enviando..." : "Agendando..."}
                      </>
                    ) : (
                      formData.modality === "presencial" ? "Enviar solicitud" : "Confirmar cita"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
}
