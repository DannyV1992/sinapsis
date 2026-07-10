import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { sendGmailNotification } from "@/lib/gmail";
import { Resend } from "resend";

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
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service, location, preferredDate, preferredTime, notes } =
      await request.json();

    if (!name || !email || !phone || !service || !location || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // Guardar en hoja "SolicitudesPresenciales"
    if (SPREADSHEET_ID) {
      const auth = getOAuth2Client();
      const sheets = google.sheets({ version: "v4", auth });
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "SolicitudesPresenciales!A:I",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            timestamp,
            name,
            email,
            phone,
            service,
            location,
            preferredDate,
            preferredTime,
            notes || "",
            "Pendiente",
          ]],
        },
      });
    }

    // Notificación interna a la psicóloga
    await sendGmailNotification(
      `Nueva solicitud presencial: ${name}`,
      `
        <h2 style="color:#4a3040">Nueva solicitud de cita presencial</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:15px">
          <tr><td style="padding:6px 16px 6px 0;color:#666">Nombre</td><td><strong>${name}</strong></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Email</td><td>${email}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Teléfono</td><td>${phone}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Servicio</td><td>${service}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Ubicación preferida</td><td>${location}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Fecha preferida</td><td>${preferredDate}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Hora preferida</td><td>${preferredTime}</td></tr>
          ${notes ? `<tr><td style="padding:6px 16px 6px 0;color:#666">Notas</td><td>${notes}</td></tr>` : ""}
        </table>
      `
    ).catch((err) => console.error("[Gmail] Error notificación presencial:", err));

    // Email de confirmación al cliente
    await resend.emails.send({
      from: "citas@sinapsiscr.com",
      to: email,
      subject: "Solicitud de cita presencial recibida — Sinapsis",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#2d2d2d">
          <h2 style="color:#4a3040;font-size:22px;margin-bottom:8px">Solicitud recibida</h2>
          <p style="color:#555;line-height:1.6">Hola <strong>${name}</strong>, recibimos tu solicitud de cita presencial.</p>
          <div style="background:#f7f4f2;border-radius:12px;padding:20px;margin:20px 0">
            <p style="margin:0 0 8px 0;font-size:14px;color:#666"><strong>Servicio:</strong> ${service}</p>
            <p style="margin:0 0 8px 0;font-size:14px;color:#666"><strong>Ubicación preferida:</strong> ${location}</p>
            <p style="margin:0 0 8px 0;font-size:14px;color:#666"><strong>Fecha preferida:</strong> ${preferredDate}</p>
            <p style="margin:0;font-size:14px;color:#666"><strong>Hora preferida:</strong> ${preferredTime}</p>
          </div>
          <p style="color:#555;line-height:1.6">
            En menos de 24 horas te confirmaré la cita por este correo o por WhatsApp, coordinando el horario y el espacio más cercano a tu preferencia.
          </p>
          <p style="color:#555;line-height:1.6">¡Gracias por tu confianza!</p>
          <p style="margin-top:24px;color:#4a3040;font-weight:600">Licda. Cinthya Chávez<br>
            <span style="font-weight:400;color:#888;font-size:13px">Psicóloga clínica — Sinapsis</span>
          </p>
        </div>
      `,
    }).catch((err) => console.error("[Resend] Error email cliente presencial:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error solicitud presencial:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
