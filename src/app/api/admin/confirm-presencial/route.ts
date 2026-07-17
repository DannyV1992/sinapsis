import { NextRequest, NextResponse } from "next/server";
import { bookAppointment } from "@/lib/google-calendar";
import { google } from "googleapis";

function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/auth/callback"
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return oauth2Client;
}

const SPREADSHEET_ID = process.env.GOOGLE_CONTACT_SHEET_ID;

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service, location, consultorio, confirmedDate, confirmedTime, notes, rowIndex } =
      await request.json();

    const locationFull = [location, consultorio].filter(Boolean).join(" — ");

    if (!name || !email || !phone || !service || !confirmedDate || !confirmedTime) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Construir start/end en ISO (America/Costa_Rica = UTC-6)
    const [year, month, day] = confirmedDate.split("-").map(Number);
    const [hour, minute] = confirmedTime.split(":").map(Number);
    const offsetMs = 6 * 60 * 60 * 1000;

    const startUTC = new Date(Date.UTC(year, month - 1, day, hour, minute) + offsetMs);

    // Duración: 90 min para pareja/familiar, 60 min para individual
    const durationMin = service.includes("pareja") || service.includes("familiar") ? 90 : 60;
    const endUTC = new Date(startUTC.getTime() + durationMin * 60 * 1000);

    await bookAppointment({
      start: startUTC.toISOString(),
      end: endUTC.toISOString(),
      name,
      email,
      phone,
      service,
      modality: "presencial",
      location: locationFull || undefined,
      notes: notes || undefined,
    });

    // Actualizar estado a "Confirmada" en el Sheet
    if (SPREADSHEET_ID && rowIndex != null) {
      const auth = getOAuth2Client();
      const sheets = google.sheets({ version: "v4", auth });
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `SolicitudesPresenciales!J${rowIndex}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [["Confirmada"]] },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error confirmando cita presencial:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
