import { google } from "googleapis";
import { generateBookingPDF } from "./generate-pdf";
import { Readable } from "node:stream";

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

  const bookedEvents = allEvents.filter(
    (event) => event.description?.includes("[AGENDADO]")
  );

  // Filtrar disponibilidad por modalidad:
  // - "Presencial" → solo citas presenciales
  // - "Virtual" → solo citas virtuales
  // - "Disponible" → ambas modalidades
  const availabilityBlocks = allEvents.filter((event) => {
    if (event.description?.includes("[AGENDADO]")) return false;

    if (!modality) return true;

    const title = event.summary?.toLowerCase() || "";
    const isPresencial = title === "presencial";
    const isVirtual = title === "virtual";
    const isDisponible = title === "disponible";

    if (isDisponible) return true;
    if (!isPresencial && !isVirtual && !isDisponible) return true;

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
  notes?: string;
}) {
  const calendar = getCalendarClient();
  const auth = getOAuth2Client();

  // Generate PDF and upload to Drive
  let pdfLink = "";
  const driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (driveFolderId) {
    try {
      const startDate = new Date(params.start);
      const dateStr = startDate.toLocaleDateString("es-CR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const timeStr = startDate.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", hour12: true });

      const pdfBuffer = await generateBookingPDF({
        name: params.name,
        email: params.email,
        phone: params.phone,
        service: params.service,
        modality: params.modality || "",
        date: dateStr,
        time: timeStr,
      });

      const drive = google.drive({ version: "v3", auth });
      const timeForFile = startDate.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(":", "-");
      const fileName = `Cita_${params.name.replace(/\s+/g, "_")}_${params.start.split("T")[0]}_${timeForFile}.pdf`;

      const stream = new Readable();
      stream.push(pdfBuffer);
      stream.push(null);

      const file = await drive.files.create({
        requestBody: {
          name: fileName,
          parents: [driveFolderId],
          mimeType: "application/pdf",
        },
        media: {
          mimeType: "application/pdf",
          body: stream,
        },
        fields: "id,webViewLink",
      });

      // Make file accessible to anyone with the link
      await drive.permissions.create({
        fileId: file.data.id!,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      pdfLink = file.data.webViewLink || "";
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Error generating/uploading PDF:", errMsg, error);
    }
  }

  const description = [
    "[AGENDADO]",
    `Paciente: ${params.name}`,
    `Email: ${params.email}`,
    `Teléfono: ${params.phone}`,
    `Servicio: ${params.service}`,
    params.modality ? `Modalidad: ${params.modality.charAt(0).toUpperCase() + params.modality.slice(1)}` : "",
    params.notes ? `Notas: ${params.notes}` : "",
    "",
    pdfLink ? `Políticas de cancelación: ${pdfLink}` : "",
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
      summary: `${params.name} — ${params.service}`,
      description,
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
          { method: "email", minutes: 24 * 60 },
          { method: "email", minutes: 60 },
        ],
      },
    },
  });

  return event.data;
}
