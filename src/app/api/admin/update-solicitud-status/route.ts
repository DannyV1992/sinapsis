import { NextRequest, NextResponse } from "next/server";
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
    const { rowIndex, status } = await request.json();

    if (!rowIndex || !status) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const auth = getOAuth2Client();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `SolicitudesPresenciales!J${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[status]] },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error actualizando estado:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
