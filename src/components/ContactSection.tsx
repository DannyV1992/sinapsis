"use client";

import { useState, useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";
import { gtagEvent } from "@/lib/gtag";
import { config, getWhatsAppLink } from "@/lib/config";

export default function ContactSection() {
  const posthog = usePostHog();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMapOptions, setShowMapOptions] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMapOptions) return;
    const handler = (e: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        setShowMapOptions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMapOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      posthog?.capture("contact_form_submitted");
      gtagEvent("generate_lead", { currency: "CRC", value: 0 });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-accent/20 border-t border-accent/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Contacto
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-8">
              ¿Tienes dudas o deseas agendar una cita? No dudes en escribirme.
              Estoy aquí para ayudarte.
            </p>
            <div className="space-y-4">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
                onClick={() => {
                  posthog?.capture("whatsapp_clicked");
                  gtagEvent("contact", { method: "WhatsApp" });
                  window.gtag?.("event", "conversion", { send_to: "AW-18306929852/NVb1CI6Ess4cELyptplE" });
                }}
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-foreground/70 group-hover:text-green-600 transition-colors">{config.phoneDisplay}</span>
              </a>
              <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group" onClick={() => posthog?.capture("instagram_clicked")}>
                <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/20 transition-colors">
                  <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="text-foreground/70 group-hover:text-pink-600 transition-colors">{config.instagramHandle}</span>
              </a>
              <button
                className="flex items-center gap-4 group text-left"
                onClick={() => {
                  const el = document.getElementById("name");
                  el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  el?.focus();
                }}
              >
                <div className="w-10 h-10 bg-violet-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-violet-100 transition-colors">
                  <svg
                    className="w-5 h-5 text-violet-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-foreground/70 group-hover:text-violet-500 transition-colors">{config.email}</span>
              </button>
              <div className="flex items-center gap-4 relative">
                <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-sky-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="relative" ref={mapRef}>
                  <button
                    onClick={() => setShowMapOptions((v) => !v)}
                    className="text-foreground/70 hover:text-sky-400 transition-colors text-left"
                  >
                    {config.location}
                  </button>
                  {showMapOptions && (
                    <div className="absolute left-0 bottom-full mb-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden min-w-[180px]">
                      <a
                        href={config.presencialLocationLinks["La Aurora, Heredia"].maps?.waze}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShowMapOptions(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-foreground/80"
                      >
                        {/* Waze logo */}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.54 8.29C20.18 4.6 17.04 1.75 13.23 1.75c-2.07 0-3.95.8-5.34 2.1C7.12 3.3 6.27 3.1 5.38 3.1 3 3.1 1.07 5.03 1.07 7.41c0 .58.12 1.13.32 1.64C1.15 9.6 1 10.2 1 10.83c0 3.08 2.38 5.6 5.4 5.84v.02c.05 2.1 1.78 3.79 3.9 3.79.9 0 1.72-.3 2.38-.8.52.18 1.07.28 1.65.28 2.76 0 5-2.24 5-5 0-.28-.02-.55-.07-.82.96-.92 1.56-2.2 1.56-3.63 0-.68-.13-1.33-.38-1.92l-.9.7z" fill="#33CCFF"/>
                          <circle cx="9.5" cy="10" r="1" fill="#1a1a1a"/>
                          <circle cx="14.5" cy="10" r="1" fill="#1a1a1a"/>
                          <path d="M10.5 13c.5.6 2.5.6 3 0" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                        Abrir en Waze
                      </a>
                      <a
                        href={config.presencialLocationLinks["La Aurora, Heredia"].maps?.google}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShowMapOptions(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-foreground/80 border-t border-gray-100"
                      >
                        {/* Google Maps logo */}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                          <path d="M12 2c1.93 0 3.68.78 4.95 2.05L12 9V2z" fill="#34A853"/>
                          <path d="M5 9c0-3.87 3.13-7 7-7V9H5z" fill="#FBBC04"/>
                          <path d="M12 9l6.95-4.95A6.965 6.965 0 0119 9c0 5.25-7 13-7 13V9z" fill="#4285F4"/>
                          <circle cx="12" cy="9" r="2.5" fill="white"/>
                        </svg>
                        Abrir en Google Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/70 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground/70 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground/70 mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            {sent ? (
              <div className="w-full px-6 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center text-sm">
                ¡Mensaje enviado! Te responderemos pronto.
              </div>
            ) : (
              <button
                type="submit"
                disabled={sending}
                className="w-full px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {sending ? "Enviando..." : "Enviar mensaje"}
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
