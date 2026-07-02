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
```

### Dónde encontrar los IDs:

- **GOOGLE_CALENDAR_ID:** Google Calendar → Configuración del calendario "Citas Pacientes" → Integrar el calendario → ID del calendario
- **GOOGLE_DRIVE_FOLDER_ID:** URL de la carpeta en Drive → el ID está entre `/folders/` y el final
- **GOOGLE_CONTACT_SHEET_ID:** URL de la hoja de cálculo → el ID está entre `/d/` y `/edit`

## Paso 5: Configurar disponibilidad

En Google Calendar (info@sinapsiscr.com), calendario "Citas Pacientes":

- Crear eventos con título "Presencial" → disponibilidad solo presencial
- Crear eventos con título "Virtual" → disponibilidad solo virtual
- Crear eventos con cualquier otro título → disponibilidad para ambas modalidades
- Los eventos recurrentes funcionan (ej. todos los lunes 8-12)

El sistema genera slots de:
- 1 hora + 15 min descanso para terapia individual
- 1.5 horas + 15 min descanso para pareja/familiar

## Paso 6: Deploy en Vercel

1. Conectar repositorio de GitHub en vercel.com
2. Agregar las mismas variables de entorno de `.env.local` en Settings → Environment Variables
3. Deploy automático con cada push a `main`

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
- **citas@sinapsiscr.com** — alias de info (para confirmaciones)
- **facturas@sinapsiscr.com** — grupo (compartido con contadora)

## Reactivar el chatbot

En `src/app/layout.tsx`:
1. Descomentar `import Chatbot from "@/components/Chatbot";`
2. Agregar `<Chatbot />` dentro del body
3. Configurar `GOOGLE_SHEET_ID` en .env.local si se quiere logging
