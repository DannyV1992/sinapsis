import { NextRequest, NextResponse } from "next/server";
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

const SPREADSHEET_ID = process.env.GOOGLE_CONTACT_SHEET_ID;

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    if (!SPREADSHEET_ID) {
      console.log("[Contacto]", { name, email, phone, message, timestamp: new Date().toISOString() });
      return NextResponse.json({ success: true });
    }

    const auth = getOAuth2Client();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Mensajes!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toISOString(),
          name,
          email,
          phone || "No proporcionado",
          message,
        ]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving contact:", error);
    return NextResponse.json({ success: true });
  }
}
