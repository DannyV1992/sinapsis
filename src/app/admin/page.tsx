"use client";

import { useState, useEffect, useCallback } from "react";
import { config } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Solicitud {
  rowIndex: number;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: string;
}

interface ConfirmForm {
  confirmedDate: string;
  confirmedTime: string;
  location: string;
  consultorio: string;
  notes: string;
}

const STATUS_COLORS: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-700",
  Confirmada: "bg-green-100 text-green-700",
  Cancelada: "bg-red-100 text-red-700",
};

export default function AdminPage() {
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Solicitud | null>(null);
  const [confirmForm, setConfirmForm] = useState<ConfirmForm>({ confirmedDate: "", confirmedTime: "", location: "", consultorio: "", notes: "" });
  const [confirmH, setConfirmH] = useState("");
  const [confirmM, setConfirmM] = useState("");
  const [confirmAmPm, setConfirmAmPm] = useState("PM");
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [tab, setTab] = useState<"solicitudes" | "nueva">("nueva");
  const [filtroStatus, setFiltroStatus] = useState<"Pendiente" | "Confirmada" | "Cancelada">("Pendiente");

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/solicitudes");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setSolicitudes(data.solicitudes ?? []);
    } catch {
      setError("Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchSolicitudes(); }, [fetchSolicitudes]);

  const openConfirm = (s: Solicitud) => {
    setSelected(s);
    setConfirmForm({ confirmedDate: s.preferredDate, confirmedTime: "", location: s.location, consultorio: "", notes: s.notes });
    setConfirmH(""); setConfirmM(""); setConfirmAmPm("PM");
    setConfirmError("");
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setConfirming(true);
    setConfirmError("");

    let hour = parseInt(confirmH, 10);
    if (confirmAmPm === "AM" && hour === 12) hour = 0;
    if (confirmAmPm === "PM" && hour !== 12) hour += 12;
    const confirmedTime = `${String(hour).padStart(2, "0")}:${confirmM}`;

    const res = await fetch("/api/admin/confirm-presencial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: selected.name,
        email: selected.email,
        phone: selected.phone,
        service: selected.service,
        location: confirmForm.location,
        consultorio: confirmForm.consultorio,
        confirmedDate: confirmForm.confirmedDate,
        confirmedTime,
        notes: confirmForm.notes,
        rowIndex: selected.rowIndex,
      }),
    });

    if (res.ok) {
      setSelected(null);
      fetchSolicitudes();
    } else {
      const data = await res.json();
      setConfirmError(data.error || "Error al confirmar");
    }
    setConfirming(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const pendientes = solicitudes.filter((s) => s.status === "Pendiente");
  const otras = solicitudes.filter((s) => s.status !== "Pendiente");

  const handleUpdateStatus = async (rowIndex: number, status: string) => {
    await fetch("/api/admin/update-solicitud-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rowIndex, status }),
    });
    fetchSolicitudes();
  };

  return (
    <div className="min-h-screen bg-[#f7f4f2]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Panel de administración</h1>
          <p className="text-xs text-foreground/40">Sinapsis · Privado</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://docs.google.com/spreadsheets/d/1dzk9kkOftod5Dc3f0c9a7loDJUOoc2gERU4rHUFM3ZU/edit?gid=63511686#gid=63511686"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            Ver hoja de citas
          </a>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            Ver sitio
          </button>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-foreground/60 hover:border-gray-300 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-6">
        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 w-fit mb-6">
          {([["nueva", "Agendar cita"], ["solicitudes", "Solicitudes presenciales"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === key ? "bg-primary-dark text-white" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {label}
              {key === "solicitudes" && pendientes.length > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {pendientes.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-10 max-w-3xl">
        {/* Tab: solicitudes */}
        {tab === "solicitudes" && (
          <div className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Filtro por estado */}
            <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 w-fit">
              {(["Pendiente", "Confirmada", "Cancelada"] as const).map((s) => {
                const count = solicitudes.filter((x) => x.status === s).length;
                return (
                  <button
                    key={s}
                    onClick={() => setFiltroStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      filtroStatus === s ? "bg-primary-dark text-white" : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {s}
                    {count > 0 && (
                      <span className={`text-xs rounded-full px-1.5 py-0.5 ${filtroStatus === s ? "bg-white/20" : "bg-gray-100"}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <p className="text-sm text-foreground/50">Cargando solicitudes...</p>
            ) : (
              <>
                {solicitudes.filter((s) => s.status === filtroStatus).length === 0 && (
                  <p className="text-sm text-foreground/50">No hay solicitudes con estado "{filtroStatus}".</p>
                )}
                <div className="space-y-3">
                  {solicitudes.filter((s) => s.status === filtroStatus).map((s) => (
                    <SolicitudCard
                      key={s.rowIndex}
                      s={s}
                      onConfirm={s.status === "Pendiente" ? () => openConfirm(s) : undefined}
                      onCancel={s.status === "Pendiente" ? () => handleUpdateStatus(s.rowIndex, "Cancelada") : undefined}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab: nueva cita */}
        {tab === "nueva" && <NuevaCitaForm />}
      </div>

      {/* Modal confirmación */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <h2 className="text-lg font-semibold mb-1">Confirmar cita presencial</h2>
              <p className="text-sm text-foreground/50 mb-4">{selected.name} · {selected.service}</p>

              <div className="bg-[#f7f4f2] rounded-xl p-3 text-xs text-foreground/50 mb-4 space-y-0.5">
                <p><strong>Solicitado:</strong> {selected.preferredDate} · {selected.preferredTime} · {selected.location}</p>
              </div>

              <form onSubmit={handleConfirm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Ubicación</label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                    value={confirmForm.location}
                    onChange={(e) => setConfirmForm({ ...confirmForm, location: e.target.value, consultorio: "" })}
                  >
                    <option value="">Selecciona una ubicación</option>
                    {config.presencialLocations.filter((loc) => config.presencialLocationLinks[loc]?.active).map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                    value={confirmForm.confirmedDate}
                    onChange={(e) => setConfirmForm({ ...confirmForm, confirmedDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Hora</label>
                  <TimeInput h={confirmH} m={confirmM} ampm={confirmAmPm} onH={setConfirmH} onM={setConfirmM} onAmPm={setConfirmAmPm} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Consultorio (opcional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                    value={confirmForm.consultorio}
                    onFocus={(e) => { if (!confirmForm.consultorio) setConfirmForm({ ...confirmForm, consultorio: "Consultorio " }); setTimeout(() => { const el = e.target; el.setSelectionRange(el.value.length, el.value.length); }, 0); }}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfirmForm({ ...confirmForm, consultorio: val === "Consultorio " || val === "" ? "" : val });
                    }}
                    onBlur={(e) => { if (e.target.value === "Consultorio ") setConfirmForm({ ...confirmForm, consultorio: "" }); }}
                    placeholder="Consultorio..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Notas (opcional)</label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm"
                    value={confirmForm.notes}
                    onChange={(e) => setConfirmForm({ ...confirmForm, notes: e.target.value })}
                  />
                </div>

                {confirmError && <p className="text-sm text-red-600">{confirmError}</p>}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-foreground/60 rounded-xl text-sm font-medium hover:border-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={confirming}
                    className="flex-1 px-4 py-3 bg-primary-dark text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {confirming ? "Agendando..." : "Agendar cita"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline status colors (evita purge de clases dinámicas) */}
      <span className="hidden bg-amber-100 text-amber-700 bg-green-100 text-green-700 bg-red-100 text-red-700 bg-white/20 bg-gray-100" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-foreground/50">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function SolicitudCard({ s, onConfirm, onCancel }: { s: Solicitud; onConfirm?: () => void; onCancel?: () => void }) {
  const statusClass = STATUS_COLORS[s.status] ?? "bg-gray-100 text-gray-600";
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-medium text-sm">{s.name}</p>
          <p className="text-xs text-foreground/50">{s.email} · {s.phone}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusClass}`}>
          {s.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground/60 mb-3">
        <span><strong>Servicio:</strong> {s.service}</span>
        <span><strong>Ubicación:</strong> {s.location}</span>
        <span><strong>Fecha preferida:</strong> {s.preferredDate}</span>
        <span><strong>Hora preferida:</strong> {s.preferredTime}</span>
        {s.notes && <span className="col-span-2"><strong>Notas:</strong> {s.notes}</span>}
      </div>
      {(onConfirm || onCancel) && (
        <div className="flex gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-2 border border-gray-200 text-foreground/50 rounded-lg text-sm font-medium hover:border-red-200 hover:text-red-500 transition-colors"
            >
              Cancelar solicitud
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Agendar cita
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Formulario de nueva cita directa (sin analytics) ───────────────────────

const services = ["Terapia individual", "Terapia de pareja", "Terapia familiar"];

function TimeInput({ h, m, ampm, onH, onM, onAmPm }: {
  h: string; m: string; ampm: string;
  onH: (v: string) => void; onM: (v: string) => void; onAmPm: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text" inputMode="numeric" maxLength={2} placeholder="H" required
        className="w-16 px-3 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center text-sm"
        value={h}
        onChange={(e) => onH(e.target.value.replace(/\D/g, "").slice(0, 2))}
      />
      <span className="text-foreground/40 font-medium">:</span>
      <input
        type="text" inputMode="numeric" maxLength={2} placeholder="MM" required
        className="w-16 px-3 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center text-sm"
        value={m}
        onChange={(e) => onM(e.target.value.replace(/\D/g, "").slice(0, 2))}
      />
      <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-medium ml-1">
        {["AM", "PM"].map((period) => (
          <button
            key={period} type="button"
            onClick={() => onAmPm(period)}
            className={`px-4 py-3 transition-colors ${ampm === period ? "bg-primary text-white" : "text-foreground/60 hover:bg-gray-50"}`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
}

function NuevaCitaForm() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", service: "", modality: "virtual-calendario", date: "", notes: "",
  });
  // Estado de hora para virtual-manual y presencial
  const [manualH, setManualH] = useState("");
  const [manualM, setManualM] = useState("");
  const [manualAmPm, setManualAmPm] = useState("PM");
  const [presencialData, setPresencialData] = useState({
    location: "", consultorio: "", preferredDate: "", preferredTimeH: "", preferredTimeM: "",
  });
  const [presencialAmPm, setPresencialAmPm] = useState("PM");
  const [availableSlots, setAvailableSlots] = useState<{ start: string; end: string }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const isPresencial = form.modality === "presencial";
  const isVirtualCalendario = form.modality === "virtual-calendario";
  const isVirtualManual = form.modality === "virtual-manual";

  // Cargar slots cuando cambia fecha o servicio en modo calendario
  useEffect(() => {
    if (!isVirtualCalendario || !form.date || !form.service) {
      setAvailableSlots([]);
      setSelectedSlot(null);
      return;
    }
    setLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedSlot(null);
    fetch(`/api/calendar/available-slots?date=${form.date}&modality=virtual&service=${encodeURIComponent(form.service)}`)
      .then((r) => r.json())
      .then((d) => setAvailableSlots(d.slots ?? []))
      .catch(() => {})
      .finally(() => setLoadingSlots(false));
  }, [form.date, form.service, isVirtualCalendario]);

  // Convierte H + MM + AM/PM a hora 24h para construir el ISO
  function toHour24(h: string, ampm: string): number {
    let hour = parseInt(h, 10);
    if (ampm === "AM" && hour === 12) hour = 0;
    if (ampm === "PM" && hour !== 12) hour += 12;
    return hour;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (isPresencial) {
      const hour24 = toHour24(presencialData.preferredTimeH, presencialAmPm);
      const confirmedTime = `${String(hour24).padStart(2, "0")}:${presencialData.preferredTimeM}`;
      const res = await fetch("/api/admin/confirm-presencial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          service: form.service, location: presencialData.location,
          consultorio: presencialData.consultorio,
          confirmedDate: presencialData.preferredDate, confirmedTime, notes: form.notes,
        }),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.error || "Error al crear cita");
      setSubmitting(false);
      return;
    }

    let start: string, end: string;

    if (isVirtualCalendario && selectedSlot) {
      start = selectedSlot.start;
      end = selectedSlot.end;
    } else {
      const [year, month, day] = form.date.split("-").map(Number);
      const hour = toHour24(manualH, manualAmPm);
      const minute = parseInt(manualM, 10) || 0;
      const offsetMs = 6 * 60 * 60 * 1000;
      const startUTC = new Date(Date.UTC(year, month - 1, day, hour, minute) + offsetMs);
      const durationMin = form.service.includes("pareja") || form.service.includes("familiar") ? 90 : 60;
      start = startUTC.toISOString();
      end = new Date(startUTC.getTime() + durationMin * 60 * 1000).toISOString();
    }

    const res = await fetch("/api/calendar/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start, end,
        name: form.name, email: form.email, phone: form.phone,
        service: form.service, modality: "virtual", notes: form.notes,
      }),
    });
    const data = await res.json();
    if (data.success) setSuccess(true);
    else setError(data.error || "Error al agendar");
    setSubmitting(false);
  };

  const baseReady = !!(form.name && form.email && form.phone && form.service);
  const timeReady = (h: string, m: string) => /^\d{1,2}$/.test(h) && /^\d{2}$/.test(m);

  const isReady =
    (isVirtualCalendario && baseReady && !!selectedSlot) ||
    (isVirtualManual && baseReady && !!(form.date) && timeReady(manualH, manualM)) ||
    (isPresencial && baseReady && !!(presencialData.location && presencialData.preferredDate) && timeReady(presencialData.preferredTimeH, presencialData.preferredTimeM));

  const resetForm = () => {
    setSuccess(false);
    setForm({ name: "", email: "", phone: "", service: "", modality: "virtual-calendario", date: "", notes: "" });
    setManualH(""); setManualM(""); setManualAmPm("PM");
    setPresencialData({ location: "", consultorio: "", preferredDate: "", preferredTimeH: "", preferredTimeM: "" });
    setPresencialAmPm("PM");
    setAvailableSlots([]); setSelectedSlot(null);
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-md">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold mb-1">{isPresencial ? "Solicitud enviada" : "Cita creada"}</p>
        <p className="text-sm text-foreground/50 mb-4">
          El evento fue creado en Google Calendar y se enviaron los correos.
        </p>
        <button onClick={resetForm} className="px-5 py-2.5 bg-primary-dark text-white rounded-xl text-sm font-medium hover:opacity-90">
          Agendar otra
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 max-w-md">
      <h2 className="text-base font-semibold mb-2">Nueva cita directa</h2>

      {[
        { id: "name", label: "Nombre completo", type: "text" },
        { id: "email", label: "Correo electrónico", type: "email" },
        { id: "phone", label: "Teléfono", type: "tel" },
      ].map(({ id, label, type }) => (
        <div key={id}>
          <label htmlFor={id} className="block text-sm font-medium text-foreground/70 mb-1">{label}</label>
          <input
            type={type} id={id} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            value={form[id as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [id]: e.target.value })}
          />
        </div>
      ))}

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-foreground/70 mb-1">Servicio</label>
        <select
          id="service" required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        >
          <option value="">Selecciona un servicio</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="modality" className="block text-sm font-medium text-foreground/70 mb-1">Modalidad</label>
        <select
          id="modality"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          value={form.modality}
          onChange={(e) => {
            setForm({ ...form, modality: e.target.value, date: "" });
            setAvailableSlots([]); setSelectedSlot(null);
            setManualH(""); setManualM("");
          }}
        >
          <option value="virtual-calendario">Virtual (Calendario)</option>
          <option value="virtual-manual">Virtual (Manual)</option>
          <option value="presencial">Presencial</option>
        </select>
      </div>

      {/* Campos según modalidad */}
      {isVirtualCalendario && (
        <>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-foreground/70 mb-1">Fecha</label>
            <input
              type="date" id="date" required min={today}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              {!form.service && !form.date
                ? "Seleccioná el servicio y la fecha para ver los horarios disponibles."
                : !form.service
                ? "Seleccioná el servicio para ver los horarios disponibles."
                : !form.date
                ? "Seleccioná una fecha para ver los horarios disponibles."
                : "Horarios disponibles"}
            </label>
            {form.date && form.service && (
              <>
                {loadingSlots && <p className="text-sm text-foreground/40">Consultando disponibilidad...</p>}
                {!loadingSlots && availableSlots.length === 0 && (
                  <p className="text-sm text-amber-600">No hay slots disponibles para esta fecha.</p>
                )}
                {availableSlots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.start} type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          selectedSlot?.start === slot.start ? "bg-primary text-white border-primary" : "border-gray-200 text-foreground/70 hover:border-primary"
                        }`}
                      >
                        {new Date(slot.start).toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {isVirtualManual && (
        <>
          <div>
            <label htmlFor="date-manual" className="block text-sm font-medium text-foreground/70 mb-1">Fecha</label>
            <input
              type="date" id="date-manual" required min={today}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Hora</label>
            <TimeInput h={manualH} m={manualM} ampm={manualAmPm} onH={setManualH} onM={setManualM} onAmPm={setManualAmPm} />
          </div>
        </>
      )}

      {isPresencial && (
        <>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground/70 mb-1">Ubicación</label>
            <select
              id="location" required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              value={presencialData.location}
              onChange={(e) => setPresencialData({ ...presencialData, location: e.target.value, consultorio: "" })}
            >
              <option value="">Selecciona una ubicación</option>
              {config.presencialLocations.filter((loc) => config.presencialLocationLinks[loc]?.active).map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="consultorio-nueva" className="block text-sm font-medium text-foreground/70 mb-1">Consultorio (opcional)</label>
            <input
              type="text" id="consultorio-nueva"
              placeholder="Consultorio..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              value={presencialData.consultorio}
              onFocus={(e) => { if (!presencialData.consultorio) { setPresencialData({ ...presencialData, consultorio: "Consultorio " }); setTimeout(() => { const el = e.target; el.setSelectionRange(el.value.length, el.value.length); }, 0); } }}
              onChange={(e) => {
                const val = e.target.value;
                setPresencialData({ ...presencialData, consultorio: val === "Consultorio " || val === "" ? "" : val });
              }}
              onBlur={(e) => { if (e.target.value === "Consultorio ") setPresencialData({ ...presencialData, consultorio: "" }); }}
            />
          </div>
          <div>
            <label htmlFor="presencial-date" className="block text-sm font-medium text-foreground/70 mb-1">Fecha</label>
            <input
              type="date" id="presencial-date" required min={today}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              value={presencialData.preferredDate}
              onChange={(e) => setPresencialData({ ...presencialData, preferredDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Hora</label>
            <TimeInput
              h={presencialData.preferredTimeH} m={presencialData.preferredTimeM} ampm={presencialAmPm}
              onH={(v) => setPresencialData({ ...presencialData, preferredTimeH: v })}
              onM={(v) => setPresencialData({ ...presencialData, preferredTimeM: v })}
              onAmPm={setPresencialAmPm}
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-foreground/70 mb-1">Notas (opcional)</label>
        <textarea
          id="notes" rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !isReady}
        className="w-full py-3 bg-primary-dark text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitting
          ? "Creando cita..."
          : isVirtualCalendario ? "Confirmar cita (calendario)"
          : isVirtualManual ? "Crear cita virtual manual"
          : "Crear cita presencial"}
      </button>
    </form>
  );
}
