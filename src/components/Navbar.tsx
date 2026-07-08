"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const serviciosSubmenu = [
  {
    href: "/terapia",
    label: "Terapia",
    description: "Consulta individual, pareja y familiar",
  },
  {
    href: "/empresas",
    label: "Empresas",
    description: "Talleres y bienestar organizacional",
  },
];

const recursosSubmenu = [
  { href: "/quiz", label: "Tests de Autoevaluación", description: "Evalúa tu bienestar emocional" },
  { href: "/recursos/herramientas", label: "Herramientas de Bienestar", description: "Respiración, grounding y más" },
  { href: "/recursos/descargas", label: "Materiales Descargables", description: "PDFs y plantillas terapéuticas" },
  { href: "/recursos/biblioteca", label: "Biblioteca Recomendada", description: "Libros, podcasts y charlas" },
  { href: "/recursos/apoyo", label: "Líneas de Apoyo en CR", description: "Recursos de crisis en Costa Rica" },
];

const navLinksLeft = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre mí" },
];

const navLinksRight = [
  { href: "/#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileServiciosOpen, setMobileServiciosOpen] = useState(false);
  const [mobileRecursosOpen, setMobileRecursosOpen] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recursosHoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [recursosOpen, setRecursosOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/#inicio") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  function isGroupActive(items: { href: string }[]) {
    return items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
  }

  const linkClass = (href: string) =>
    `relative text-sm font-semibold transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-accent after:rounded-full after:transition-all ${
      isActive(href)
        ? "text-primary after:w-full"
        : "text-foreground/70 hover:text-primary after:w-0 hover:after:w-full"
    }`;

  function openSubmenu() {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setSubmenuOpen(true);
  }

  function closeSubmenu() {
    hoverTimeout.current = setTimeout(() => setSubmenuOpen(false), 120);
  }

  function openRecursos() {
    if (recursosHoverTimeout.current) clearTimeout(recursosHoverTimeout.current);
    setRecursosOpen(true);
  }

  function closeRecursos() {
    recursosHoverTimeout.current = setTimeout(() => setRecursosOpen(false), 120);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-1">
            <Image src="/logo.svg" alt="Sinapsis" width={65} height={65} />
            <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-[family-name:var(--font-quicksand)]">Sinapsis</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLinksLeft.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={linkClass(link.href)}
              >
                {link.label}
              </a>
            ))}

            {/* Servicios dropdown */}
            <div
              className="relative"
              onMouseEnter={openSubmenu}
              onMouseLeave={closeSubmenu}
            >

              <button
                className={`relative flex items-center gap-1 ${isGroupActive(serviciosSubmenu) ? "text-primary after:w-full" : "text-foreground/70 hover:text-primary after:w-0 hover:after:w-full"} text-sm font-semibold transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-accent after:rounded-full after:transition-all`}
                aria-haspopup="true"
                aria-expanded={submenuOpen}
              >
                Servicios
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${submenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {submenuOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-white rounded-xl shadow-lg shadow-foreground/8 border border-foreground/6 overflow-hidden flex flex-col"
                  onMouseEnter={openSubmenu}
                  onMouseLeave={closeSubmenu}
                >
                  {serviciosSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-5 py-3.5 transition-colors group ${pathname === item.href ? "bg-primary/8" : "hover:bg-primary/5"}`}
                    >
                      <span className={`text-sm font-semibold transition-colors ${pathname === item.href ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recursos dropdown */}
            <div
              className="relative"
              onMouseEnter={openRecursos}
              onMouseLeave={closeRecursos}
            >
              <button
                className={`relative flex items-center gap-1 ${isGroupActive(recursosSubmenu) ? "text-primary after:w-full" : "text-foreground/70 hover:text-primary after:w-0 hover:after:w-full"} text-sm font-semibold transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-accent after:rounded-full after:transition-all`}
                aria-haspopup="true"
                aria-expanded={recursosOpen}
              >
                Recursos
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${recursosOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {recursosOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-white rounded-xl shadow-lg shadow-foreground/8 border border-foreground/6 overflow-hidden flex flex-col"
                  onMouseEnter={openRecursos}
                  onMouseLeave={closeRecursos}
                >
                  {recursosSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-5 py-3.5 transition-colors group ${pathname === item.href ? "bg-primary/8" : "hover:bg-primary/5"}`}
                    >
                      <span className={`text-sm font-semibold transition-colors ${pathname === item.href ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinksRight.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={linkClass(link.href)}
              >
                {link.label}
              </a>
            ))}

            <Link
              href="/agendar"
              className="group relative px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full text-sm font-semibold overflow-hidden shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="relative z-10">Agendar cita</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menú"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-3 pt-4">
              {navLinksLeft.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/70 hover:text-primary px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}

              {/* Servicios en mobile: toggle */}
              <div>
                <button
                  className="flex items-center justify-between w-full text-sm font-medium text-foreground/70 hover:text-primary px-2 py-1"
                  onClick={() => setMobileServiciosOpen(!mobileServiciosOpen)}
                >
                  Servicios
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileServiciosOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileServiciosOpen && (
                  <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-primary/20 pl-3">
                    {serviciosSubmenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm text-foreground/60 hover:text-primary py-1"
                        onClick={() => { setIsOpen(false); setMobileServiciosOpen(false); }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Recursos en mobile: toggle */}
              <div>
                <button
                  className="flex items-center justify-between w-full text-sm font-medium text-foreground/70 hover:text-primary px-2 py-1"
                  onClick={() => setMobileRecursosOpen(!mobileRecursosOpen)}
                >
                  Recursos
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileRecursosOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileRecursosOpen && (
                  <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-primary/20 pl-3">
                    {recursosSubmenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm text-foreground/60 hover:text-primary py-1"
                        onClick={() => { setIsOpen(false); setMobileRecursosOpen(false); }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navLinksRight.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/70 hover:text-primary px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}

              <Link
                href="/agendar"
                className="mx-2 px-5 py-2 bg-primary text-white rounded-full text-sm font-medium text-center hover:bg-primary-dark transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Agendar cita
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
