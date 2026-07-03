# Sinapsis — Psicología Clínica

Página web profesional para consultorio de psicología clínica con sistema de agendamiento automatizado.

## Stack tecnológico

- **Framework:** Next.js 16 (App Router)
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **APIs:** Google Calendar, Google Sheets, Google Drive
- **Email transaccional:** Resend (recordatorios de citas)
- **Analytics:** PostHog (eventos, funnels, session replay) + Google Analytics 4 (Google Ads)
- **Hosting:** Vercel (+ cron jobs)
- **Dominio:** sinapsiscr.com (Cloudflare)
- **Email:** Google Workspace

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                 # Página principal
│   ├── posthog-provider.tsx     # Provider de PostHog (analytics)
│   ├── agendar/                 # Sistema de agendamiento
│   ├── quiz/                    # Tests de bienestar (6 tests)
│   ├── politicas/               # Políticas de cancelación
│   ├── consentimiento/          # Consentimiento informado
│   ├── logo-export/             # Exportación del logo
│   └── api/
│       ├── auth/                # OAuth login/callback
│       ├── calendar/            # Disponibilidad y reservas
│       ├── chat-log/            # Logs del chatbot
│       ├── contact/             # Formulario de contacto
│       ├── cron/reminders/      # Cron: recordatorios 24h antes
│       └── test-email/          # Test de Resend (solo dev)
├── components/
│   ├── AboutSection.tsx
│   ├── AnimateOnScroll.tsx
│   ├── Chatbot.tsx              # Chatbot (desactivado, listo para reactivar)
│   ├── ContactSection.tsx
│   ├── FAQSection.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── HowItWorksSection.tsx
│   ├── Navbar.tsx
│   ├── NeuronBackground.tsx     # Animación de neuronas interactiva
│   ├── ParallaxServices.tsx     # Áreas de atención
│   ├── QuizCTA.tsx
│   ├── QuizRunner.tsx
│   ├── ScrollRevealText.tsx
│   ├── TransformSection.tsx     # Modalidades de atención
│   ├── WhatsAppButton.tsx
│   └── JsonLd.tsx               # Datos estructurados (Schema.org)
└── lib/
    ├── config.ts                # Configuración central (precios, teléfono, email)
    ├── email.ts                 # Envío de emails con Resend
    ├── generate-pdf.ts          # Generación de PDF de políticas
    ├── google-calendar.ts       # Integración con Google Calendar
    └── quiz-data.ts             # Datos de los 6 tests
```

## Configuración central

Todos los datos variables (precios, teléfono, email, ubicación, horario, métodos de pago) están en `src/lib/config.ts`. Al modificar este archivo, se actualizan automáticamente en toda la página.

## Funcionalidades

### Sistema de agendamiento
- Conectado a Google Calendar (OAuth 2.0)
- Filtrado por modalidad (presencial/virtual)
- Duración dinámica (1h individual, 1.5h pareja/familia)
- Google Meet automático para citas virtuales
- PDF de políticas generado y guardado en Drive
- Link al PDF en la invitación de calendario
- Sugerencia del próximo día disponible (busca hasta 30 días)
- Descanso de 15 min entre citas

### Tests de bienestar
- GAD-7 (Ansiedad)
- PHQ-9 (Depresión)
- PSS-10 (Estrés)
- Rosenberg (Autoestima)
- ECR-R (Estilos de apego)
- WHO-5 (Bienestar general)

### Chatbot (Neurón)
- FAQ por palabras clave
- Derivación a WhatsApp cuando no sabe la respuesta
- Listo para reactivar (descomentar en layout.tsx)

### Recordatorios automáticos (email)
- Cron job cada hora busca citas en las próximas 24h
- Email personalizado con fecha, hora, servicio, modalidad
- Link de Google Meet incluido para citas virtuales
- Botón de WhatsApp para reprogramar
- Enviado desde citas@sinapsiscr.com via Resend
- Si la cita se elimina del calendario, no se envía recordatorio

### SEO
- Metadata con keywords y título template en todas las páginas
- Open Graph y Twitter Cards
- JSON-LD: Schema.org MedicalBusiness + WebSite
- Sitemap dinámico y robots.txt
- Canonical URLs
- generateStaticParams para pre-renderizar quizzes

### Analytics
- PostHog: pageviews, session replay, eventos custom, funnels (modo cookieless)
- Google Analytics 4: tráfico, audiencias, preparación para Google Ads
- Eventos custom: `quiz_completed`, `booking_completed`, `booking_step_completed`, `contact_form_submitted`, `whatsapp_clicked`

### Formulario de contacto
- Mensajes guardados en Google Sheets automáticamente

### Calendario — Cómo marcar disponibilidad
- Crear eventos en el calendario "Citas Pacientes"
- Título "Presencial" → solo para citas presenciales
- Título "Virtual" → solo para citas virtuales
- Cualquier otro título → disponible para ambas modalidades
- Las citas agendadas se detectan por "[AGENDADO]" en la descripción

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Variables de entorno

Crear archivo `.env.local` con las siguientes variables (ver SETUP.md para instrucciones completas):

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=
GOOGLE_DRIVE_FOLDER_ID=
GOOGLE_CONTACT_SHEET_ID=
RESEND_API_KEY=
CRON_SECRET=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Deploy

El proyecto se despliega automáticamente en Vercel al hacer push a la rama `main` en GitHub. Las variables de entorno deben configurarse en Vercel → Settings → Environment Variables.

El cron de recordatorios se registra automáticamente desde `vercel.json`.
