import { google } from "googleapis";
import { sendGmailNotification } from "./gmail";

async function logBookingToSheet(params: {
  name: string;
  email: string;
  phone: string;
  service: string;
  modality?: string;
  location?: string;
  notes?: string;
  start: string;
}) {
  const sheetId = process.env.GOOGLE_CONTACT_SHEET_ID;
  if (!sheetId) return;

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/auth/callback"
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  const sheets = google.sheets({ version: "v4", auth });

  const citaDate = new Date(params.start)
    .toLocaleString("es-CR", {
      timeZone: "America/Costa_Rica",
      dateStyle: "short",
      timeStyle: "short",
    })
    .replace(/\s+([ap])\.\s+m\./gi, "$1.m.");

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Citas!A:I",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        new Date().toISOString(),
        params.name,
        params.email,
        params.phone,
        params.service,
        params.modality ? params.modality.charAt(0).toUpperCase() + params.modality.slice(1) : "No especificada",
        params.location || "",
        citaDate,
        params.notes || "",
      ]],
    },
  });
}
// import { generateBookingPDF } from "./generate-pdf"; // desactivado: se usa link directo en lugar de PDF
// import { Readable } from "node:stream"; // desactivado junto con generación de PDF

function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/auth/callback"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
}

export function getCalendarClient() {
  const auth = getOAuth2Client();
  return google.calendar({ version: "v3", auth });
}

export const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

// Configuración de citas
const BREAK_BETWEEN_MIN = 15; // descanso entre citas en minutos

function getAppointmentDuration(service?: string): number {
  if (service === "Terapia de pareja" || service === "Terapia familiar") {
    return 90; // 1.5 horas
  }
  return 60; // 1 hora
}

export interface TimeSlot {
  start: string;
  end: string;
}

export async function getAvailableSlots(date: string, modality?: string, service?: string): Promise<TimeSlot[]> {
  const calendar = getCalendarClient();

  const dayStart = new Date(`${date}T00:00:00-06:00`);
  const dayEnd = new Date(`${date}T23:59:59-06:00`);

  const eventsRes = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const allEvents = eventsRes.data.items || [];

  const isBookedEvent = (event: { extendedProperties?: { private?: Record<string, string> | null } | null; description?: string | null }) =>
    event.extendedProperties?.private?.type === "booked" || event.description?.includes("[AGENDADO]");

  const bookedEvents = allEvents.filter(isBookedEvent);

  const availabilityBlocks = allEvents.filter((event) => {
    if (isBookedEvent(event)) return false;

    if (!modality) return true;

    const title = event.summary?.toLowerCase().trim() || "";
    const isPresencial = title === "presencial";
    const isVirtual = title === "virtual";
    const isDisponible = title === "disponible";

    if (!isPresencial && !isVirtual && !isDisponible) return false;

    if (modality === "virtual") return isVirtual || isDisponible;
    if (modality === "presencial") return isPresencial || isDisponible;
    return true;
  });

  const slots: TimeSlot[] = [];

  for (const block of availabilityBlocks) {
    if (!block.start?.dateTime || !block.end?.dateTime) continue;

    const blockStart = new Date(block.start.dateTime);
    const blockEnd = new Date(block.end.dateTime);

    const appointmentDuration = getAppointmentDuration(service);
    const slotDuration = appointmentDuration * 60 * 1000;
    const slotStep = (appointmentDuration + BREAK_BETWEEN_MIN) * 60 * 1000;

    let slotStart = new Date(blockStart);
    while (slotStart.getTime() + slotDuration <= blockEnd.getTime()) {
      const slotEnd = new Date(slotStart.getTime() + slotDuration);

      const isBooked = bookedEvents.some((event) => {
        if (!event.start?.dateTime || !event.end?.dateTime) return false;
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);
        return slotStart < eventEnd && slotEnd > eventStart;
      });

      if (!isBooked) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
        });
      }

      slotStart = new Date(slotStart.getTime() + slotStep);
    }
  }

  return slots;
}

export async function bookAppointment(params: {
  start: string;
  end: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  modality?: string;
  location?: string;
  notes?: string;
}) {
  const calendar = getCalendarClient();
  // const auth = getOAuth2Client(); // solo necesario para Drive (PDF desactivado)

  // PDF desactivado: se envía link directo en lugar de generar/subir PDF a Drive.
  // La lógica de generación (generate-pdf.ts) y subida a Drive queda disponible
  // como referencia para futura implementación del consentimiento informado.
  //
  // const driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  // if (driveFolderId) { ... generateBookingPDF → drive.files.create ... }

  const description = [
    "Cita psicológica con Licda. Cinthya Chávez",
    "",
    `Paciente: ${params.name}`,
    `Email: ${params.email}`,
    `Teléfono: ${params.phone}`,
    `Servicio: ${params.service}`,
    params.modality ? `Modalidad: ${params.modality.charAt(0).toUpperCase() + params.modality.slice(1)}` : "",
    params.location ? `Ubicación: ${params.location}` : "",
    params.notes ? `Notas: ${params.notes}` : "",
    "",
    "Políticas de cancelación: https://sinapsiscr.com/politicas",
    "Si es tu primera vez, lee el consentimiento informado: https://sinapsiscr.com/consentimiento",
  ]
    .filter(Boolean)
    .join("\n");

  const isVirtual = params.modality?.toLowerCase() === "virtual";

  const event = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    sendUpdates: "all",
    conferenceDataVersion: isVirtual ? 1 : 0,
    requestBody: {
      summary: `${params.name} — ${params.service} | Licda. Cinthya Chávez`,
      description,
      extendedProperties: { private: { type: "booked" } },
      start: { dateTime: params.start, timeZone: "America/Costa_Rica" },
      end: { dateTime: params.end, timeZone: "America/Costa_Rica" },
      attendees: [{ email: params.email }],
      ...(isVirtual && {
        conferenceData: {
          createRequest: {
            requestId: `sinapsis-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      }),
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 60 * 6 },
        ],
      },
    },
  });

  const startDate = new Date(params.start).toLocaleString("es-CR", {
    timeZone: "America/Costa_Rica",
    dateStyle: "full",
    timeStyle: "short",
  });

  await logBookingToSheet(params).catch((err) => console.error("[Sheets] Error log cita:", err));

  await sendGmailNotification(
    `Nueva cita: ${params.name} — ${params.service}`,
    `
      <h2 style="color:#5b7b7a">Nueva cita agendada</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:15px">
        <tr><td style="padding:6px 16px 6px 0;color:#666">Paciente</td><td><strong>${params.name}</strong></td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#666">Email</td><td>${params.email}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#666">Teléfono</td><td>${params.phone}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#666">Servicio</td><td>${params.service}</td></tr>
        ${params.modality ? `<tr><td style="padding:6px 16px 6px 0;color:#666">Modalidad</td><td>${params.modality.charAt(0).toUpperCase() + params.modality.slice(1)}</td></tr>` : ""}
        ${params.location ? `<tr><td style="padding:6px 16px 6px 0;color:#666">Ubicación</td><td>${params.location}</td></tr>` : ""}
        <tr><td style="padding:6px 16px 6px 0;color:#666">Fecha y hora</td><td>${startDate}</td></tr>
        ${params.notes ? `<tr><td style="padding:6px 16px 6px 0;color:#666">Notas</td><td>${params.notes}</td></tr>` : ""}
      </table>
    `,
    "info@sinapsiscr.com"
  ).catch((err) => console.error("[Gmail] Error notificación cita:", err));

  return event.data;
}
