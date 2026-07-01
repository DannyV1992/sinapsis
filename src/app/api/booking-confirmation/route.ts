import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { generateBookingPDF } from "@/lib/generate-pdf";

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

const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service, modality, date, time } = await request.json();

    if (!name || !email || !service || !date || !time) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    // Generate PDF
    const pdfBuffer = await generateBookingPDF({
      name, email, phone, service, modality, date, time,
    });

    const auth = getOAuth2Client();
    const fileName = `Cita_${name.replace(/\s+/g, "_")}_${date}.pdf`;

    // Upload to Google Drive
    if (DRIVE_FOLDER_ID) {
      const drive = google.drive({ version: "v3", auth });

      await drive.files.create({
        requestBody: {
          name: fileName,
          parents: [DRIVE_FOLDER_ID],
          mimeType: "application/pdf",
        },
        media: {
          mimeType: "application/pdf",
          body: Buffer.from(pdfBuffer) as unknown as NodeJS.ReadableStream,
        },
      });
    }

    // Send email with PDF attached via Gmail API
    const gmail = google.gmail({ version: "v1", auth });

    const boundary = "boundary_" + Date.now();
    const emailContent = [
      `From: info@sinapsiscr.com`,
      `To: ${email}`,
      `Subject: Confirmación de cita — Sinapsis`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset="UTF-8"`,
      ``,
      `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">`,
      `  <h2 style="color: #4a3f8f;">¡Tu cita ha sido confirmada!</h2>`,
      `  <p>Hola <strong>${name}</strong>,</p>`,
      `  <p>Tu cita ha sido agendada exitosamente:</p>`,
      `  <div style="background: #f0eef8; padding: 16px; border-radius: 8px; margin: 16px 0;">`,
      `    <p style="margin: 4px 0;"><strong>Servicio:</strong> ${service}</p>`,
      `    <p style="margin: 4px 0;"><strong>Modalidad:</strong> ${modality}</p>`,
      `    <p style="margin: 4px 0;"><strong>Fecha:</strong> ${date}</p>`,
      `    <p style="margin: 4px 0;"><strong>Hora:</strong> ${time}</p>`,
      `  </div>`,
      `  <p>Adjunto encontrarás las políticas de cancelación. Por favor léelas con atención.</p>`,
      `  <p>Si necesitas cancelar o reprogramar, hazlo con al menos 24 horas de anticipación.</p>`,
      `  <br>`,
      `  <p style="color: #6b5fbf;">— Sinapsis, Psicología Clínica</p>`,
      `</div>`,
      `--${boundary}`,
      `Content-Type: application/pdf; name="${fileName}"`,
      `Content-Disposition: attachment; filename="${fileName}"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      pdfBuffer.toString("base64"),
      `--${boundary}--`,
    ].join("\r\n");

    const encodedEmail = Buffer.from(emailContent)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in booking confirmation:", error);
    return NextResponse.json({ error: "Error al enviar confirmación" }, { status: 500 });
  }
}
