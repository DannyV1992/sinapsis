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
│   ├── page.tsx                # Landing: Hero → About → HowItWorks → Services → Transform → ScrollReveal → FAQ → Contact
│   ├── globals.css             # Tailwind + estilos globales
│   ├── posthog-provider.tsx    # Provider PostHog (client component)
│   ├── robots.ts               # robots.txt dinámico
│   ├── sitemap.ts              # Sitemap dinámico
│   ├── icon.svg                # Favicon
│   │
│   ├── agendar/
│   │   ├── page.tsx            # Wizard multi-step: servicio → modalidad → fecha → slot → datos → confirmación
│   │   └── layout.tsx          # Metadata de la página de agendamiento
│   │
│   ├── quiz/
│   │   ├── page.tsx            # Grid de los 6 tests disponibles
│   │   ├── layout.tsx          # Metadata quizzes
│   │   └── [id]/
│   │       ├── page.tsx        # Runner del quiz (usa QuizRunner component)
│   │       └── layout.tsx      # Metadata dinámica por quiz + generateStaticParams
│   │
│   ├── sobre-mi/
│   │   └── page.tsx            # Página bio completa: hero, intro personal, en consulta, mi plus, por qué/cómo, CTA
│   │
│   ├── proceso/
│   │   └── page.tsx            # (legacy, no enlazada desde navbar) — contenido migrado a /servicios
│   │
│   ├── servicios/
│   │   └── page.tsx            # Psicología clínica: enfoque TCC, tipos de terapia (cards B) con precios, proceso terapéutico (4 pasos), CTA
│   │
│   ├── empresas/
│   │   └── page.tsx            # Talleres y bienestar organizacional: propuesta + slideshow fotos + stats, lista talleres, CTA con video autoplay
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
│       ├── calendar/
│       │   ├── available-slots/route.ts  # GET(?date, ?modality, ?service): slots libres del día
│       │   └── book/route.ts             # POST(start, end, name, email, phone, service, ?modality, ?notes): crea evento + PDF + Drive
│       │
│       ├── cron/
│       │   └── reminders/route.ts  # GET(Bearer CRON_SECRET): envía recordatorios 24h antes, corre diario 14:00 UTC
│       │
│       ├── contact/route.ts        # POST: guarda mensaje en Google Sheets
│       ├── chat-log/route.ts       # POST: log de interacciones del chatbot
│       └── test-email/route.ts     # POST: prueba de envío Resend (solo dev)
│
├── components/
│   ├── Navbar.tsx              # Navegación fija: links directos + dropdown hover "Servicios" → "Terapia" (/servicios) y "Empresas" (/empresas)
│   ├── HeroSection.tsx         # Banner principal con CTA
│   ├── AboutSection.tsx        # Bio de la profesional + botón "Conocé más sobre mí" → /sobre-mi
│   ├── ParallaxServices.tsx    # Cards de áreas de atención (individual, pareja, familiar) con parallax
│   ├── HowItWorksSection.tsx   # 3 pasos del proceso de agendamiento + enlace "Ver el proceso completo →" en paso 3 → /servicios#proceso
│   ├── QuizCTA.tsx             # CTA hacia los tests de bienestar
│   ├── QuizRunner.tsx          # Componente genérico que renderiza cualquier quiz
│   ├── FAQSection.tsx          # Preguntas frecuentes (acordeón)
│   ├── ContactSection.tsx      # Formulario de contacto → /api/contact
│   ├── TransformSection.tsx    # Modalidades de atención (tabs) + enlace "Ver más →" esquina inferior derecha → /servicios#tipos-de-terapia
│   ├── ProcesoSteps.tsx        # 4 pasos TCC con animaciones Framer Motion — usado en /servicios
│   ├── Footer.tsx              # Pie de página: enlaces en 2 columnas (sobre-mi, psicología, empresas, proceso, contacto, agendar) + datos de contacto
│   ├── WhatsAppButton.tsx      # Botón flotante de WhatsApp
│   ├── Chatbot.tsx             # Chatbot por keywords (desactivado, listo para reactivar)
│   ├── NeuronBackground.tsx    # Animación Three.js de neuronas interactivas
│   ├── AnimateOnScroll.tsx     # Wrapper Framer Motion para animaciones on-scroll
│   ├── ScrollRevealText.tsx    # Texto que se revela al hacer scroll
│   ├── TallerSlideshow.tsx     # Slideshow automático (3.5s, fade) de fotos de talleres — usado en /empresas
│   ├── TalleresCards.tsx       # Grid filtrable de talleres con chips por categoría (Framer Motion) — usado en /empresas
│   └── JsonLd.tsx              # Schema.org: LocalBusiness + WebSite
│
├── lib/
│   ├── config.ts               # Configuración central: precios, teléfono, email, horarios, profesional
│   ├── google-calendar.ts      # OAuth client, getAvailableSlots(), bookAppointment() (+ PDF + Drive upload)
│   ├── reminders.ts            # sendReminderEmail() — HTML template con Resend (activar con http://localhost:3000/api/test-email)
│   ├── generate-pdf.ts         # generateBookingPDF() — políticas de cancelación con pdf-lib
│   ├── quiz-data.ts            # Definición de 6 tests: GAD-7, PHQ-9, PSS-10, Rosenberg, ECR-R, WHO-5
│   └── gtag.ts                 # Helper gtagEvent() para GA4
│
└── types/
    └── gtag.d.ts               # Type declarations para window.gtag
```

## Flujos principales

### Agendamiento de citas

```
Usuario selecciona servicio/modalidad/fecha
  → GET /api/calendar/available-slots?date=X&modality=Y&service=Z
  → Muestra slots (calculados desde bloques de disponibilidad en Google Calendar, menos 15min entre citas)
  → Usuario llena datos y confirma
  → POST /api/calendar/book
    → Genera PDF de políticas (pdf-lib)
    → Sube PDF a Google Drive (carpeta compartida)
    → Crea evento en Google Calendar con extendedProperties.private.type="booked", attendees, Meet link (si virtual)
    → Retorna success
```

### Recordatorios automáticos

```
Vercel cron (diario 14:00 UTC = 8am Costa Rica)
  → GET /api/cron/reminders (auth: Bearer CRON_SECRET)
  → Lista eventos de mañana en Google Calendar
  → Filtra por extendedProperties.private.type="booked" (fallback: [AGENDADO] en descripción para citas legacy)
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

## Analytics — eventos

Patrón: PostHog se usa con `usePostHog()` hook en client components. GA4 con `gtagEvent()` de `src/lib/gtag.ts`.

| Evento PostHog | Dónde se dispara | Datos |
|----------------|-----------------|-------|
| `quiz_completed` | QuizRunner.tsx | nombre del quiz, puntaje, nivel |
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
- Paleta palo rosa + verde salvia: `--primary` palo rosa `#c4908f`, `--primary-dark` ciruela suave `#4a3040`, `--accent` verde salvia `#8aaa96`, fondo marfil cálido `#f7f4f2` — colores de neuronas hardcodeados en `NeuronBackground.tsx` en tonos palo rosa con vesículas en verde salvia (no leen CSS vars)

## Convenciones

- Todos los datos variables (precios, teléfono, horarios) van en `src/lib/config.ts`
- Eventos agendados se identifican por `extendedProperties.private.type: "booked"` (fallback legacy: `[AGENDADO]` en descripción)
- Zona horaria: America/Costa_Rica (UTC-6) hardcodeada en calendar y cron
- Email transaccional desde: `citas@sinapsiscr.com`
- Cron limitado a 1 ejecución/día (restricción Vercel Hobby)
