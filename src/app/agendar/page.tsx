"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  "Terapia individual",
  "Terapia de pareja",
  "Manejo de ansiedad",
  "Orientación vocacional",
  "Terapia online",
];

interface TimeSlot {
  start: string;
  end: string;
}

export default function AgendarPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    slot: null as TimeSlot | null,
    notes: "",
  });
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [noSlots, setNoSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!formData.date) return;

    setLoadingSlots(true);
    setNoSlots(false);
    setAvailableSlots([]);
    setFormData((prev) => ({ ...prev, slot: null }));

    fetch(`/api/calendar/available-slots?date=${formData.date}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.slots && data.slots.length > 0) {
          setAvailableSlots(data.slots);
        } else {
          setNoSlots(true);
        }
      })
      .catch(() => setError("Error al cargar horarios disponibles"))
      .finally(() => setLoadingSlots(false));
  }, [formData.date]);

  const handleNext = () => {
    setDirection(1);
    setStep(step + 1);
  };
  const handleBack = () => {
    setDirection(-1);
    setStep(step - 1);
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
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
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
          onSubmit={handleSubmit}
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
                      <div className="py-4 px-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                        No hay horarios disponibles para esta fecha. Prueba con
                        otro día.
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
                      !formData.service || !formData.date || !formData.slot
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
                <h2 className="text-xl font-semibold mb-4">Confirmar cita</h2>
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
                    <span className="text-sm text-foreground/60">
                      Servicio:
                    </span>
                    <span className="text-sm font-medium">
                      {formData.service}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/60">Fecha:</span>
                    <span className="text-sm font-medium">
                      {formatDate(formData.date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/60">Hora:</span>
                    <span className="text-sm font-medium">
                      {formData.slot && formatTime(formData.slot.start)} —{" "}
                      {formData.slot && formatTime(formData.slot.end)}
                    </span>
                  </div>
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
                    disabled={booking}
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
                        Agendando...
                      </>
                    ) : (
                      "Confirmar cita"
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
