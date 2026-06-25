# Configuración de Google Calendar API (OAuth 2.0)

> Usa una cuenta personal de Gmail (no institucional).
> Puede ser el Gmail de la psicóloga o uno dedicado (ej. sinapsis.psicologia@gmail.com).

---

## Paso 1: Crear proyecto en Google Cloud

1. Ve a https://console.cloud.google.com/ e inicia sesión con la cuenta personal de Gmail
2. Crea un proyecto nuevo (ej. "Sinapsis")
3. En el menú lateral, ve a **"APIs y servicios" > "Biblioteca"**
4. Busca **"Google Calendar API"** y habilítala

## Paso 2: Crear credenciales OAuth

1. Ve a **"APIs y servicios" > "Credenciales"**
2. Click en **"Crear credenciales" > "ID de cliente de OAuth"**
3. Si te pide configurar la "Pantalla de consentimiento":
   - Tipo: **Externo**
   - Nombre de la app: "Sinapsis"
   - Email de soporte: tu email
   - No necesitas agregar scopes ahí (se configuran desde el código)
   - En "Usuarios de prueba", agrega el email de la psicóloga
   - Guarda
4. Vuelve a **Credenciales > Crear credenciales > ID de cliente de OAuth**
5. Tipo de aplicación: **Aplicación web**
6. Nombre: "Sinapsis Web"
7. En **"URIs de redirección autorizados"** agrega: `http://localhost:3000/api/auth/callback`
8. Click en **Crear**
9. Copia el **Client ID** y **Client Secret**

## Paso 3: Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REFRESH_TOKEN=pendiente
GOOGLE_CALENDAR_ID=primary
```

## Paso 4: Obtener el refresh token

1. Inicia el servidor de desarrollo: `npm run dev`
2. Abre en tu navegador: http://localhost:3000/api/auth/login
3. Te redirigirá a Google — inicia sesión con la cuenta de la psicóloga
4. Autoriza los permisos del calendario
5. Verás una página con el **refresh_token** — cópialo
6. Pégalo en `.env.local` como valor de `GOOGLE_REFRESH_TOKEN`
7. Reinicia el servidor (`Ctrl+C` y `npm run dev` de nuevo)

> Este paso solo se hace UNA VEZ. El refresh token no expira a menos que se revoque manualmente.

## Paso 5: Configurar el ID del calendario

- Si quieres usar el calendario principal de la cuenta, deja `GOOGLE_CALENDAR_ID=primary`
- Si prefieres un calendario aparte:
  1. En Google Calendar, crea un calendario nuevo (ej. "Disponibilidad Sinapsis")
  2. Ve a Configuración del calendario > "Integrar el calendario"
  3. Copia el **ID del calendario** (tiene formato `xxx@group.calendar.google.com`)
  4. Ponlo en `.env.local` como `GOOGLE_CALENDAR_ID`

## Paso 6: Marcar disponibilidad

La psicóloga marca en Google Calendar cuándo puede atender:

### Cómo crear bloques de disponibilidad

En el calendario, crear eventos que:
- Tengan color **verde (Sage/Salvia)** en Google Calendar, O
- Contengan la palabra **"Disponible"** en el título

### Ejemplo

Crear evento recurrente:
- Título: "Disponible"
- Lunes y miércoles: 8:00 - 12:00
- Martes y jueves: 14:00 - 17:00

### Cómo funciona la lógica

```
Calendario de la psicóloga:

Lunes:
  [08:00 - 12:00] Disponible (verde)     → Sitio muestra: 8:00, 9:00, 10:00, 11:00
  [14:00 - 17:00] Disponible (verde)     → Sitio muestra: 14:00, 15:00, 16:00

Cuando alguien agenda a las 9:00:
  [09:00 - 10:00] Cita: Juan — Terapia   ← Se crea automáticamente
  
  Sitio ahora muestra: 8:00, 10:00, 11:00 (9:00 desaparece)
```

---

## Resumen de archivos necesarios

```
.env.local
├── GOOGLE_CLIENT_ID        ← De paso 2
├── GOOGLE_CLIENT_SECRET    ← De paso 2
├── GOOGLE_REFRESH_TOKEN    ← De paso 4
└── GOOGLE_CALENDAR_ID      ← "primary" o ID de calendario específico
```

## Eliminar las rutas de autorización (opcional, para producción)

Las rutas `/api/auth/login` y `/api/auth/callback` solo son necesarias para obtener el refresh token. Una vez obtenido, puedes eliminar la carpeta `src/app/api/auth/` si quieres.
