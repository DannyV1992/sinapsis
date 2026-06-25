import { google } from "googleapis";

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
const APPOINTMENT_DURATION_MIN = 60; // duración de cada cita en minutos
const BREAK_BETWEEN_MIN = 15; // descanso entre citas en minutos

export interface TimeSlot {
  start: string;
  end: string;
}

export async function getAvailableSlots(date: string): Promise<TimeSlot[]> {
  const calendar = getCalendarClient();

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);

  const eventsRes = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const allEvents = eventsRes.data.items || [];

  const availabilityBlocks = allEvents.filter(
    (event) =>
      event.colorId === "2" ||
      event.summary?.toLowerCase().includes("disponible")
  );

  const bookedEvents = allEvents.filter(
    (event) =>
      event.colorId !== "2" &&
      !event.summary?.toLowerCase().includes("disponible")
  );

  const slots: TimeSlot[] = [];

  for (const block of availabilityBlocks) {
    if (!block.start?.dateTime || !block.end?.dateTime) continue;

    const blockStart = new Date(block.start.dateTime);
    const blockEnd = new Date(block.end.dateTime);

    const slotDuration = APPOINTMENT_DURATION_MIN * 60 * 1000;
    const slotStep = (APPOINTMENT_DURATION_MIN + BREAK_BETWEEN_MIN) * 60 * 1000;

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
  notes?: string;
}) {
  const calendar = getCalendarClient();

  const event = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: {
      summary: `Cita: ${params.name} — ${params.service}`,
      description: [
        `Paciente: ${params.name}`,
        `Email: ${params.email}`,
        `Teléfono: ${params.phone}`,
        `Servicio: ${params.service}`,
        params.notes ? `Notas: ${params.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      start: { dateTime: params.start, timeZone: "America/Costa_Rica" },
      end: { dateTime: params.end, timeZone: "America/Costa_Rica" },
      attendees: [{ email: params.email }],
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
