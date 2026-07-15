# Configuración de Sinapsis

## Requisitos previos

- Node.js 20+
- Cuenta de Google Workspace (info@sinapsiscr.com)
- Dominio sinapsiscr.com (Cloudflare)
- Cuenta en Vercel (para producción)

## Paso 1: Google Cloud Console

1. Ve a https://console.cloud.google.com con info@sinapsiscr.com
2. Proyecto: "Sinapsis"
3. APIs habilitadas:
   - Google Calendar API
   - Google Sheets API
   - Google Drive API
   - Gmail API (pendiente de propagación de scopes)

## Paso 2: Credenciales OAuth

1. APIs y servicios → Credenciales → ID de cliente de OAuth
2. Tipo: Aplicación web
3. URIs de redirección autorizados:
   - `http://localhost:3000/api/auth/callback`
   - `https://sinapsiscr.com/api/auth/callback`
4. Pantalla de consentimiento: Interno
5. Scopes configurados en "Acceso a los datos":
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/drive.file`

## Paso 3: Obtener refresh token

1. Iniciar servidor local: `npm run dev`
2. Abrir: http://localhost:3000/api/auth/login
3. Autorizar con info@sinapsiscr.com
4. Copiar el refresh token que se muestra
5. Pegarlo en `.env.local` como `GOOGLE_REFRESH_TOKEN`

Si los scopes cambian, revocar acceso en https://myaccount.google.com/permissions y re-autorizar.

## Paso 4: Variables de entorno

Crear `.env.local`:

```
GOOGLE_CLIENT_ID=803885539185-de63u54iriesq9u0ant3svmq1mabf9gp.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=[secret]
GOOGLE_REFRESH_TOKEN=[token obtenido en paso 3]
GOOGLE_CALENDAR_ID=[ID del calendario "Citas Pacientes"]
GOOGLE_DRIVE_FOLDER_ID=[ID de la carpeta en Drive para PDFs]
GOOGLE_CONTACT_SHEET_ID=[ID de la hoja "Contacto" en Sheets]
RESEND_API_KEY=[API key de Resend - ver Paso 8]
CRON_SECRET=[string secreto para autenticar el cron]
NEXT_PUBLIC_POSTHOG_KEY=[Project token de PostHog - ver Paso 9]
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Dónde encontrar los IDs:

- **GOOGLE_CALENDAR_ID:** Google Calendar → Configuración del calendario "Citas Pacientes" → Integrar el calendario → ID del calendario
- **GOOGLE_DRIVE_FOLDER_ID:** URL de la carpeta en Drive → el ID está entre `/folders/` y el final
- **GOOGLE_CONTACT_SHEET_ID:** URL de la hoja de cálculo → el ID está entre `/d/` y `/edit`

## Paso 5: Configurar disponibilidad

En Google Calendar (info@sinapsiscr.com), calendario "Citas Pacientes":

- Crear eventos con título "Presencial" → disponibilidad solo presencial
- Crear eventos con título "Virtual" → disponibilidad solo virtual
- Crear eventos con título "Disponible" → disponibilidad para ambas modalidades
- Los eventos recurrentes funcionan (ej. todos los lunes 8-12)

El sistema genera slots de:
- 1 hora + 15 min descanso para terapia individual
- 1.5 horas + 15 min descanso para pareja/familiar

## Paso 6: Deploy en Vercel

1. Conectar repositorio de GitHub en vercel.com
2. Agregar las mismas variables de entorno de `.env.local` en Settings → Environment Variables (incluyendo RESEND_API_KEY y CRON_SECRET)
3. Deploy automático con cada push a `main`
4. El cron de recordatorios se registra automáticamente desde `vercel.json`

## Paso 7: Conectar dominio

1. En Vercel → Settings → Domains → agregar sinapsiscr.com y www.sinapsiscr.com
2. En Cloudflare → DNS → agregar registros CNAME según Vercel indique
3. Proxy de Cloudflare: desactivado (DNS only) para que Vercel emita el SSL

## Configuración central

El archivo `src/lib/config.ts` contiene todos los datos variables del sitio:
- Teléfono / WhatsApp
- Email
- Ubicación
- Precios
- Horario
- Métodos de pago
- Datos de la profesional

Al modificar este archivo, se actualizan automáticamente en toda la página.

## Servicios de Google Workspace

- **info@sinapsiscr.com** — cuenta principal (admin, APIs, calendar)
- **citas@sinapsiscr.com** — alias de info (para confirmaciones/recordatorios via Resend)
- **facturas@sinapsiscr.com** — alias de info (para facturación)
- **facturas.sinapsiscr@gmail.com** — Gmail gratuito de la contadora

### Configuración de correo para la contadora

La contadora no tiene acceso a la cuenta info@. El flujo es:

1. Los correos que llegan a facturas@sinapsiscr.com se reenvían automáticamente a facturas.sinapsiscr@gmail.com
2. La contadora responde desde facturas.sinapsiscr@gmail.com usando "Enviar como" facturas@sinapsiscr.com

Para configurar "Enviar como" en el Gmail de la contadora:
1. Configuración → Cuentas e importación → Enviar como → Añadir dirección
2. Dirección: facturas@sinapsiscr.com
3. SMTP: smtp.gmail.com, puerto 587 (TLS)
4. Usuario: info@sinapsiscr.com
5. Contraseña: contraseña de aplicación generada desde info@ (ver PRIVATE.md)
6. Google envía código de verificación a facturas@sinapsiscr.com (llega a info@, pasarlo a la contadora)

## Paso 8: Resend (recordatorios por email)

1. Crear cuenta en https://resend.com
2. Domains → Add Domain → `sinapsiscr.com`
3. Clic "Auto configure" (si usas Cloudflare) o agregar registros DNS manualmente
4. Esperar verificación (DKIM + SPF deben estar en verde)
5. API Keys → Create API Key → nombre: `sinapsis-production`, permisos: Sending access solo para sinapsiscr.com
6. Copiar la key (empieza con `re_`) y agregarla como `RESEND_API_KEY` en `.env.local` y en Vercel

El cron `/api/cron/reminders` se ejecuta una vez al día a las 8am Costa Rica (14:00 UTC) y envía recordatorios de todas las citas del día siguiente. Compatible con Vercel Hobby (máximo 1 ejecución diaria).
Los emails se envían desde `citas@sinapsiscr.com`.
El historial de emails enviados se puede ver en el dashboard de Resend.

### Endpoint de prueba

Para verificar que Resend funciona: `http://localhost:3000/api/test-email`
(Solo funciona en desarrollo, bloqueado en producción)

## Paso 9: PostHog (analytics y session replay)

1. Crear cuenta en https://posthog.com (región: US Cloud)
2. Crear proyecto → nombre: "Sinapsis"
3. Settings → Project → copiar el **Project token** (empieza con `phc_`)
4. Pegarlo en `.env.local` como `NEXT_PUBLIC_POSTHOG_KEY`
5. Agregar la misma variable en Vercel → Settings → Environment Variables

PostHog captura automáticamente pageviews y session replays. Los eventos custom (`quiz_completed`, `booking_completed`, etc.) se envían desde los componentes del frontend.

Configuración aplicada:
- `persistence: "memory"` — no usa cookies (no requiere banner de consentimiento)
- `person_profiles: "identified_only"` — no crea perfiles de usuarios anónimos
- `capture_pageleave: true` — registra cuándo el usuario cierra la pestaña

Dashboard: https://us.posthog.com

## Paso 10: Google Search Console

1. Ir a https://search.google.com/search-console con la cuenta de Google de Cinthya
2. Agregar propiedad → tipo **Dominio** → `sinapsiscr.com`
3. Verificar con **Google Analytics** (si es la misma cuenta que administra GA4, es automático) o con registro TXT en Cloudflare → DNS → tipo TXT, nombre `@`, valor el código que Google entrega
4. Una vez verificado: Sitemaps → agregar `sitemap.xml` → Enviar
5. El sitemap está en `https://sinapsiscr.com/sitemap.xml` (generado dinámicamente por `src/app/sitemap.ts`)

Para indexar una página nueva rápidamente: Inspección de URLs → pegar la URL → "Solicitar indexación".

## Paso 11: Google Analytics 4 (para Google Ads)

GA4 ya está integrado con el Measurement ID `G-YMZ7VT90T3` (definido en `src/lib/gtag.ts` como `GA_MEASUREMENT_ID` y consumido por el layout). No requiere variables de entorno. Para cambiar el ID, editar únicamente la constante en `gtag.ts`.

> Nota: el ID anterior `G-1F00E5F123` quedó inservible (Google devolvía 404 en `gtag/js`) porque su cuenta contenedora en GA4 fue enviada a la papelera. Se reemplazó por `G-YMZ7VT90T3` en una cuenta nueva bajo `info@sinapsiscr.com`. Verificar la salud de un Measurement ID con: `curl -o /dev/null -w "%{http_code}" "https://www.googletagmanager.com/gtag/js?id=EL_ID"` → debe dar 200.

Eventos de conversión configurados en el código:
- `purchase` — se dispara al agendar una cita (value en CRC según servicio)
- `generate_lead` — se dispara al enviar formulario de contacto
- `contact` — se dispara al hacer click en WhatsApp
- `quiz_completed` — se dispara al terminar un test de bienestar

Para activar las conversiones en GA4:
1. GA4 → Admin → Events → esperar a que lleguen los primeros eventos
2. Marcar `purchase`, `generate_lead`, `contact` con el toggle "Mark as conversion"

Las conversiones de Google Ads se miden **directamente** con la etiqueta `AW-18306929852` (llamadas `gtag("event", "conversion", { send_to: "AW-..." })` en agendar/WhatsApp/contacto), independiente de GA4. **No es necesario vincular GA4 con Google Ads** ni importar conversiones desde GA4: son sistemas separados y el `AW-` no depende de la propiedad GA4.

Dashboard: https://analytics.google.com

## Reactivar el chatbot

En `src/app/layout.tsx`:
1. Descomentar `import Chatbot from "@/components/Chatbot";`
2. Agregar `<Chatbot />` dentro del body
3. Configurar `GOOGLE_SHEET_ID` en .env.local si se quiere logging
