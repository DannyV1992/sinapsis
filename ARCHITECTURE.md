# Arquitectura — Sinapsis

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| Estilos | Tailwind CSS 4 |
| Animaciones | Framer Motion, GSAP, Three.js |
| API Google | Calendar, Drive, Sheets (OAuth 2.0, googleapis) |
| Email | Resend (desde citas@sinapsiscr.com) |
| PDF | pdf-lib |
| Analytics | PostHog (cookieless) + Google Analytics 4 |
| Hosting | Vercel (Hobby plan, cron jobs) |
| Dominio | sinapsiscr.com (Cloudflare) |

## Estructura de archivos

```
src/
├── app/
│   ├── layout.tsx              # Layout raíz: fuentes (Geist, Playfair, Quicksand, Cormorant, Lora), metadata SEO, GA4 script, providers
│   ├── page.tsx                # Landing: Hero → About → ScrollReveal → Services → Transform → HowItWorks → ResourcesTeaser → FAQ → Contact
│   ├── globals.css             # Tailwind + estilos globales
│   ├── posthog-provider.tsx    # Provider PostHog (client component)
│   ├── robots.ts               # robots.txt dinámico
│   ├── sitemap.ts              # Sitemap dinámico
│   ├── icon.svg                # Favicon
│   │
│   ├── admin/
│   │   ├── page.tsx            # Panel privado: tabs "Solicitudes presenciales" + "Agendar cita directa" (sin analytics)
│   │   └── login/
│   │       └── page.tsx        # Login admin con contraseña (cookie httpOnly 8h)
│   │
│   ├── agendar/
│   │   ├── page.tsx            # Wizard multi-step: servicio → modalidad → fecha → slot → datos → confirmación. Presencial: flujo de solicitud (ubicación + fecha + hora preferida → Sheet + correos)
│   │   └── layout.tsx          # Metadata de la página de agendamiento
│   │
│   ├── quiz/
│   │   ├── page.tsx            # Grid de los 6 tests con popovers informativos (InfoPopover + FloatingPopover portal) — fila inferior de cada card: "X preguntas · duración · Test:\nescala" distribuidos con justify-between
│   │   ├── layout.tsx          # Metadata quizzes
│   │   ├── apego/
│   │   │   └── page.tsx        # ECR-R real: 36 ítems, escala 1-7, subescalas evitación+ansiedad, 9 combinaciones de resultado
│   │   ├── necesito-terapia/
│   │   │   └── page.tsx        # Checklist orientativo 8 preguntas Sí/No — accesible desde CTA al final de cada test
│   │   └── [id]/
│   │       ├── page.tsx        # Runner del quiz (usa QuizRunner component)
│   │       └── layout.tsx      # Metadata dinámica por quiz + generateStaticParams
│   │
│   ├── sobre-mi/
│   │   └── page.tsx            # Página bio completa: hero, intro personal, en consulta, mi plus, por qué/cómo, CTA
│   │
│   ├── terapia/
│   │   └── page.tsx            # Psicología clínica: enfoque TCC (TccDiagram interactivo), tipos de terapia (cards) con precios, proceso terapéutico (4 pasos), CTA
│   │
│   ├── empresas/
│   │   └── page.tsx            # Talleres y bienestar organizacional: propuesta + slideshow fotos + stats, lista talleres, CTA con video autoplay
│   │
│   ├── recursos/
│   │   ├── apoyo/
│   │   │   └── page.tsx        # Líneas de apoyo y crisis en Costa Rica (911, 118, 117, 1322, 1165, PANI, OIJ 800-8000-645, Colegio Psicólogos) — 5 secciones
│   │   ├── biblioteca/
│   │   │   ├── page.tsx        # Biblioteca recomendada: grid editorial 2 col, tabs por categoría (libros/podcasts/TED/docs), cards con color por tipo — chips con estilo empresas (layoutId="chip-bg-biblioteca")
│   │   │   └── layout.tsx
│   │   ├── herramientas/
│   │   │   ├── page.tsx        # Herramientas interactivas: respiración (box/4-7-8, anillo via @keyframes breath-ring + key={faseIdx} para sincronía exacta, useReducer para avance de fases sin side effects) + grounding 5-4-3-2-1 (colores por paso en botón y barra) + InfoPopover (FloatingPopover portal, flecha superior centrada sobre botón) — chips con estilo empresas
│   │   │   └── layout.tsx
│   │   └── descargas/
│   │       ├── page.tsx        # Materiales descargables: Diario TCC (generado con pdf-lib) + próximamente
│   │       └── layout.tsx
│   │
│   ├── consentimiento/
│   │   └── page.tsx            # Consentimiento informado (texto legal)
│   │
│   ├── politicas/
│   │   └── page.tsx            # Políticas de cancelación (texto legal)
│   │
│   ├── logo-export/
│   │   └── page.tsx            # Utility: exportar logo como imagen
│   │
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts      # GET: redirige a Google OAuth consent
│       │   └── callback/route.ts   # GET: recibe code, guarda refresh_token
│       │
│       ├── admin/
│       │   ├── login/route.ts                    # POST: valida ADMIN_PASSWORD, setea cookie httpOnly (8h)
│       │   ├── logout/route.ts                   # POST: elimina cookie de sesión
│       │   ├── solicitudes/route.ts              # GET: lee hoja SolicitudesPresenciales del Sheet
│       │   ├── confirm-presencial/route.ts       # POST: crea evento en Calendar + marca solicitud como "Confirmada" en Sheet
│       │   └── update-solicitud-status/route.ts  # POST(rowIndex, status): actualiza estado en SolicitudesPresenciales (ej. "Cancelada")
│       │
│       ├── calendar/
│       │   ├── available-slots/route.ts    # GET(?date, ?modality, ?service): slots libres del día
│       │   ├── book/route.ts               # POST(start, end, name, email, phone, service, ?modality, ?notes): crea evento + PDF + Drive
│       │   └── request-presencial/route.ts # POST: guarda en hoja SolicitudesPresenciales + notifica Gmail + email al cliente
│       │
│       ├── cron/
│       │   └── reminders/route.ts  # GET(Bearer CRON_SECRET): envía recordatorios 24h antes, corre diario 14:00 UTC
│       │
│       ├── contact/route.ts        # POST: guarda mensaje en Google Sheets
│       ├── chat-log/route.ts       # POST: log de interacciones del chatbot
│       ├── test-email/route.ts     # POST: prueba de envío Resend (solo dev)
│       └── descargas/
│           └── diario-tcc/route.ts # GET: genera y devuelve PDF Diario TCC (pdf-lib, A4, portada + 5 páginas de registro)
│
├── components/
│   ├── Navbar.tsx              # Navegación fija: links directos + dropdown "Servicios" (Terapia, Empresas) + dropdown "Recursos" → Tests, Herramientas, Descargas, Biblioteca, Líneas de Apoyo
│   ├── HeroSection.tsx         # Banner principal con CTA
│   ├── AboutSection.tsx        # Bio de la profesional + botón "Conocé más sobre mí" → /sobre-mi
│   ├── ParallaxServices.tsx    # Cards de áreas de atención (individual, pareja, familiar) con parallax
│   ├── HowItWorksSection.tsx   # 3 pasos del proceso de agendamiento + enlace "Ver el proceso completo →" en paso 3 → /servicios#proceso
│   ├── QuizCTA.tsx             # CTA hacia los tests de bienestar
│   ├── QuizRunner.tsx          # Componente genérico que renderiza cualquier quiz; al final del resultado muestra CTA → /quiz/necesito-terapia
│   ├── FAQSection.tsx          # Preguntas frecuentes (acordeón)
│   ├── ContactSection.tsx      # Formulario de contacto → /api/contact
│   ├── TransformSection.tsx    # Modalidades de atención (tabs) + enlace "Ver más →" esquina inferior derecha → /servicios#tipos-de-terapia
│   ├── ProcesoSteps.tsx        # 4 pasos TCC con animaciones Framer Motion — usado en /servicios
│   ├── Footer.tsx              # Pie de página: enlaces en 2 columnas (sobre-mi, psicología, empresas, proceso, contacto, agendar) + datos de contacto
│   ├── WhatsAppButton.tsx      # Botón flotante de WhatsApp
│   ├── Chatbot.tsx             # Chatbot por keywords (desactivado, listo para reactivar)
│   ├── NeuronBackground.tsx    # Animación Three.js de neuronas interactivas
│   ├── AnimateOnScroll.tsx     # Wrapper Framer Motion para animaciones on-scroll
│   ├── ScrollRevealText.tsx    # Texto que se revela al hacer scroll — fondo primary-dark, CTA "Dar el primer paso" → /terapia
│   ├── ResourcesTeaser.tsx     # Grid 4 cards sobre fondo primary-dark: tests, herramientas, biblioteca, líneas de apoyo — antes del FAQ
│   ├── TallerSlideshow.tsx     # Slideshow automático (3.5s, fade) de fotos de talleres — usado en /empresas
│   ├── TalleresCards.tsx       # Grid filtrable de talleres con chips por categoría (Framer Motion) — usado en /empresas
│   ├── TccDiagram.tsx          # Diagrama circular interactivo del ciclo TCC (3 sectores clickeables + cuadro descripción) — usado en /servicios
│   ├── ScrollToTop.tsx         # Client component: escucha cambios de pathname y ejecuta window.scrollTo(0,0) — corrige que en móvil la página nueva aparezca desde la posición previa
│   ├── SiteShell.tsx           # Client component: envuelve Navbar + Footer + WhatsAppButton; los oculta en rutas /admin
│   └── JsonLd.tsx              # Schema.org: LocalBusiness + WebSite + SearchAction (apunta a /quiz)
│
├── lib/
│   ├── config.ts               # Configuración central: precios, teléfono, email, horarios, profesional
│   ├── google-calendar.ts      # OAuth client, getAvailableSlots(), bookAppointment() (+ PDF + Drive upload)
│   ├── reminders.ts            # sendReminderEmail() — HTML template con Resend (activar con http://localhost:3000/api/test-email)
│   ├── generate-pdf.ts         # generateBookingPDF() — políticas de cancelación con pdf-lib
│   ├── gmail.ts                # sendGmailNotification() — notificación interna vía Gmail cuando llega un mensaje de contacto
│   ├── quiz-data.ts            # Definición de 5 tests: GAD-7, PHQ-9, PSS-10 (reversedItems [6,7,8,9]), Rosenberg (reversedItems [2,4,7,8,9]), WHO-5. ECR-R tiene página propia.
│   └── gtag.ts                 # Helper gtagEvent() para GA4
│
└── types/
    └── gtag.d.ts               # Type declarations para window.gtag
```

## Flujos principales

### Agendamiento de citas — Virtual

```
Usuario selecciona servicio → modalidad "Virtual" → fecha → slot
  → GET /api/calendar/available-slots?date=X&modality=virtual&service=Z
  → Muestra slots (calculados desde bloques de disponibilidad en Google Calendar, menos 15min entre citas)
  → Usuario llena datos y confirma
  → POST /api/calendar/book
    → Genera PDF de políticas (pdf-lib)
    → Sube PDF a Google Drive (carpeta compartida)
    → Crea evento en Google Calendar con extendedProperties.private.type="booked", attendees, Meet link
    → Retorna success
```

### Agendamiento de citas — Presencial (flujo de solicitud)

```
Usuario selecciona servicio → modalidad "Presencial" → ubicación + fecha + hora preferida
  → POST /api/calendar/request-presencial
    → Guarda en hoja "SolicitudesPresenciales" del Sheet con estado "Pendiente"
    → Envía notificación interna por Gmail a la psicóloga
    → Envía email al cliente: "Confirmamos en menos de 24h"
  → Psicóloga accede a /admin, ve solicitud pendiente, hace click en "Agendar cita"
  → Modal: edita ubicación, fecha, hora (H:MM AM/PM) y notas
  → POST /api/admin/confirm-presencial
    → Llama a bookAppointment() (mismo flujo que virtual, sin Meet link; location como campo separado)
    → Actualiza estado a "Confirmada" en el Sheet
  → O bien: click en "Cancelar solicitud" → POST /api/admin/update-solicitud-status → estado "Cancelada"
```

### Panel de administración (/admin)

```
Acceso: /admin → middleware verifica cookie admin_session
  → Sin sesión: redirige a /admin/login
  → Con sesión válida: muestra panel
Login: POST /api/admin/login (ADMIN_PASSWORD en env) → cookie httpOnly 8h
Tabs (default: "Agendar cita"):
  - Agendar cita directa: wizard simplificado sin PostHog/GA4
    · Virtual (Calendario): busca slots en Google Calendar
    · Virtual (Manual): fecha + hora (H:MM AM/PM) sin verificar disponibilidad
    · Presencial: bookea directo vía /api/admin/confirm-presencial (sin pasar por solicitud)
  - Solicitudes presenciales: filtro por estado (Pendiente / Confirmada / Cancelada, default Pendiente)
    · Botón "Agendar cita": abre modal con campos editables (ubicación, fecha, hora H:MM AM/PM, notas)
    · Botón "Cancelar solicitud": marca estado "Cancelada" en Sheet
    · Link "Ver hoja de citas" en el header → Google Sheets
```

### Recordatorios automáticos

```
Vercel cron (diario 14:00 UTC = 8am Costa Rica)
  → GET /api/cron/reminders (auth: Bearer CRON_SECRET)
  → Lista eventos de mañana en Google Calendar
  → Filtra por extendedProperties.private.type="booked"
  → Extrae datos del paciente de la descripción del evento
  → Envía email personalizado con Resend (fecha, hora, servicio, modalidad, Meet link)
```

### Disponibilidad en calendario

- La psicóloga crea bloques en Google Calendar con título:
  - "Presencial" → solo citas presenciales
  - "Virtual" → solo citas virtuales
  - "Disponible" → ambas modalidades
- El sistema genera slots de 60min (individual) o 90min (pareja/familiar) dentro de esos bloques
- Se resta 15min de descanso entre slots
- Citas existentes (extendedProperties.private.type="booked") bloquean sus slots

## Variables de entorno

| Variable | Uso |
|----------|-----|
| GOOGLE_CLIENT_ID | OAuth 2.0 |
| GOOGLE_CLIENT_SECRET | OAuth 2.0 |
| GOOGLE_REFRESH_TOKEN | Token persistente para API calls server-side |
| GOOGLE_CALENDAR_ID | ID del calendario "Citas Pacientes" |
| GOOGLE_DRIVE_FOLDER_ID | Carpeta donde se suben los PDFs |
| GOOGLE_CONTACT_SHEET_ID | Google Sheet para mensajes de contacto |
| RESEND_API_KEY | API key de Resend |
| CRON_SECRET | Auth del endpoint de cron |
| NEXT_PUBLIC_POSTHOG_KEY | PostHog project key |
| NEXT_PUBLIC_POSTHOG_HOST | PostHog ingest URL |
| ADMIN_PASSWORD | Contraseña del panel /admin (cookie httpOnly, sesión 8h) |

## Analytics — eventos

Patrón: PostHog se usa con `usePostHog()` hook en client components. GA4 con `gtagEvent()` de `src/lib/gtag.ts`.

| Evento PostHog | Dónde se dispara | Datos |
|----------------|-----------------|-------|
| `quiz_completed` | QuizRunner.tsx | nombre del quiz, puntaje, nivel |
| `quiz_completed` | quiz/apego/page.tsx | quiz: "ECR-R", evitacion (promedio), ansiedad (promedio) |
| `booking_step_completed` | agendar/page.tsx | paso, servicio, modalidad |
| `booking_completed` | agendar/page.tsx | servicio, modalidad |
| `contact_form_submitted` | ContactSection.tsx | (sin datos personales) |
| `whatsapp_clicked` | WhatsAppButton.tsx | — |

| Evento GA4 | Propósito | Datos |
|------------|-----------|-------|
| `purchase` | Conversión de cita agendada | currency: CRC, value: precio, item_name: servicio |
| `generate_lead` | Formulario enviado | — |
| `contact` | Click WhatsApp | method: WhatsApp |
| `quiz_completed` | Test completado | quiz_name, score, level |

No se capturan datos personales (nombre, email, teléfono) en ningún evento.

## Lógica de "siguiente día disponible"

Cuando un día no tiene slots libres, el frontend busca automáticamente el próximo día con disponibilidad:
1. Hace requests secuenciales a `/api/calendar/available-slots` incrementando la fecha
2. Busca hasta 30 días en el futuro
3. Prueba ambas modalidades (si la seleccionada no tiene, sugiere la otra)
4. Muestra un mensaje con la sugerencia y botón para saltar a esa fecha

## Decisiones técnicas

- OAuth 2.0 en vez de Service Account (restricciones de Google)
- pdf-lib en vez de pdfkit (pdfkit no funciona en serverless de Vercel)
- Zona horaria hardcodeada -06:00 (Vercel corre en UTC)
- Chatbot desactivado, WhatsApp button activo
- Resend en vez de Nodemailer/SMTP (mejor entregabilidad, dashboard de tracking)
- Cron diario (no horario) por restricción del plan Hobby de Vercel
- PostHog en vez de Clarity (analytics + session replay en una herramienta, cookieless para sitio de salud mental)
- GA4 en paralelo: necesario para Google Ads cuando se activen campañas
- GA4 Measurement ID hardcodeado (es público, simplifica deploy)
- Tracking excluido por dominio/ruta (PostHog + GA4 + Google Ads): no se inicializa en `localhost`, `127.0.0.1`, cualquier subdominio `*.vercel.app`, ni en rutas `/admin/*`. Lógica en `posthog-provider.tsx` (condición sobre `window.location`) y en el script inline de `layout.tsx`.
- Paleta palo rosa + verde salvia: `--primary` palo rosa `#c4908f`, `--primary-dark` ciruela suave `#4a3040`, `--accent` verde salvia `#8aaa96`, fondo marfil cálido `#f7f4f2` — colores de neuronas hardcodeados en `NeuronBackground.tsx` en tonos palo rosa con vesículas en verde salvia (no leen CSS vars)
- Secciones CTA (`/servicios`, `/empresas`) y contacto (`ContactSection.tsx`) usan `bg-accent/20 border-accent/15` para diferenciarse del fondo marfil sin ser pesadas

## Convenciones

- Todos los datos variables (precios, teléfono, horarios, ubicaciones presenciales) van en `src/lib/config.ts`
- Eventos agendados se identifican por `extendedProperties.private.type: "booked"`
- Zona horaria: America/Costa_Rica (UTC-6) hardcodeada en calendar y cron
- Email transaccional desde: `citas@sinapsiscr.com`
- Cron limitado a 1 ejecución/día (restricción Vercel Hobby)
- Panel /admin protegido con middleware Next.js (`src/middleware.ts`): verifica cookie `admin_session` contra `ADMIN_PASSWORD`; sin sesión redirige a /admin/login. Navbar/Footer ocultos en /admin vía `SiteShell.tsx`
- Solicitudes presenciales en hoja `SolicitudesPresenciales` del mismo spreadsheet de contacto (columnas: Fecha, Nombre, Email, Teléfono, Servicio, Ubicación, Fecha preferida, Hora preferida, Notas, Estado)
- Chips/tabs de selección: estilo unificado — seleccionado: `text-white` + `<motion.span layoutId="chip-bg-*" className="absolute inset-0 rounded-full bg-primary-dark">` (spring animation); no seleccionado: `border border-foreground/15 text-foreground/50 hover:border-foreground/30`. Aplicado en empresas (TalleresCards), herramientas y biblioteca.
- Animación del anillo de respiración: `@keyframes breath-ring` en `globals.css` (stroke-dashoffset de circunferencia → 0), aplicado con `animation: breath-ring ${duracion}s linear forwards` y `key={faseIdx}` para forzar re-mount en cada fase y garantizar sincronía exacta.
