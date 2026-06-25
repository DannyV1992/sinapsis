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

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function POST(request: NextRequest) {
  try {
    const { question, answered } = await request.json();

    if (!question) {
      return NextResponse.json({ error: "Pregunta requerida" }, { status: 400 });
    }

    if (!SPREADSHEET_ID) {
      // Fallback: solo log en consola si no hay sheet configurada
      console.log("[Chat Log]", { question, answered, timestamp: new Date().toISOString() });
      return NextResponse.json({ success: true, fallback: true });
    }

    const auth = getOAuth2Client();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Logs!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toISOString(),
          question,
          answered ? "Sí" : "No",
          answered ? "Respondida" : "Sin respuesta — agregar al FAQ",
        ]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging to sheet:", error);
    return NextResponse.json({ success: true });
  }
}

export async function GET() {
  if (!SPREADSHEET_ID) {
    return NextResponse.json({ logs: [], message: "No hay sheet configurada" });
  }

  try {
    const auth = getOAuth2Client();
    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Logs!A:D",
    });

    const rows = res.data.values || [];
    const logs = rows.slice(1).map((row) => ({
      timestamp: row[0],
      question: row[1],
      answered: row[2],
      status: row[3],
    }));

    return NextResponse.json({ logs, total: logs.length });
  } catch (error) {
    console.error("Error reading sheet:", error);
    return NextResponse.json({ logs: [], error: "Error al leer" });
  }
}
