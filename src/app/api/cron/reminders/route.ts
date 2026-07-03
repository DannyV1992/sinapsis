import { NextResponse } from "next/server";
import { getCalendarClient, CALENDAR_ID } from "@/lib/google-calendar";
import { sendReminderEmail } from "@/lib/email";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const calendar = getCalendarClient();

  const now = new Date();
  const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);

  const eventsRes = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: in23h.toISOString(),
    timeMax: in25h.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = eventsRes.data.items || [];
  const bookedEvents = events.filter(
    (event) => event.description?.includes("[AGENDADO]")
  );

  const results: { email: string; status: string }[] = [];

  for (const event of bookedEvents) {
    const description = event.description || "";
    const lines = description.split("\n");

    const patientName = extractField(lines, "Paciente:");
    const email = extractField(lines, "Email:");
    const service = extractField(lines, "Servicio:");
    const modality = extractField(lines, "Modalidad:") || "Virtual";

    if (!email || !patientName) {
      results.push({ email: email || "unknown", status: "skipped (missing data)" });
      continue;
    }

    const startDt = new Date(event.start?.dateTime || "");
    const date = startDt.toLocaleDateString("es-CR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Costa_Rica",
    });
    const time = startDt.toLocaleTimeString("es-CR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Costa_Rica",
    });

    const meetLink = event.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === "video"
    )?.uri;

    try {
      await sendReminderEmail({
        to: email,
        patientName,
        service,
        date,
        time,
        modality,
        meetLink: meetLink || undefined,
      });
      results.push({ email, status: "sent" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      results.push({ email, status: `error: ${msg}` });
    }
  }

  return NextResponse.json({
    processed: bookedEvents.length,
    results,
  });
}

function extractField(lines: string[], prefix: string): string {
  const line = lines.find((l) => l.startsWith(prefix));
  return line ? line.replace(prefix, "").trim() : "";
}
