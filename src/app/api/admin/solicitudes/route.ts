import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    if (!SPREADSHEET_ID) {
      return NextResponse.json({ solicitudes: [] });
    }

    const auth = getOAuth2Client();
    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "SolicitudesPresenciales!A:J",
    });

    const rows = res.data.values ?? [];
    // Saltar fila de encabezado (fila 1), las filas de datos empiezan en índice 2 del Sheet
    const solicitudes = rows.slice(1).map((row, i) => ({
      rowIndex: i + 2, // índice real en el Sheet (base 1, con encabezado en fila 1)
      timestamp: row[0] ?? "",
      name: row[1] ?? "",
      email: row[2] ?? "",
      phone: row[3] ?? "",
      service: row[4] ?? "",
      location: row[5] ?? "",
      preferredDate: row[6] ?? "",
      preferredTime: row[7] ?? "",
      notes: row[8] ?? "",
      status: row[9] ?? "Pendiente",
    }));

    return NextResponse.json({ solicitudes });
  } catch (error) {
    console.error("Error leyendo solicitudes:", error);
    return NextResponse.json({ error: "Error al leer solicitudes" }, { status: 500 });
  }
}
