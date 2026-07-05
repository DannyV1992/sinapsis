import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = "Citas Sinapsis Psicología <citas@sinapsiscr.com>";

interface ReminderEmailParams {
  to: string;
  patientName: string;
  service: string;
  date: string;
  time: string;
  modality: string;
  meetLink?: string;
}

export async function sendReminderEmail(params: ReminderEmailParams) {
  const { to, patientName, service, date, time, modality, meetLink } = params;

  const isVirtual = modality.toLowerCase() === "virtual";
  const firstName = patientName.split(" ")[0];

  const meetSection = isVirtual && meetLink
    ? `<tr>
        <td style="padding: 16px 24px; background-color: #f0eef9; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #4a3f8f; font-weight: 600;">Enlace de la sesión:</p>
          <a href="${meetLink}" style="color: #4a3f8f; font-size: 14px;">${meetLink}</a>
        </td>
      </tr>`
    : "";

  const locationText = isVirtual
    ? "Tu sesión será virtual por Google Meet."
    : "Tu sesión será presencial en el consultorio.";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #f8f7fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f7fc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(74,63,143,0.08);">
          <tr>
            <td style="background-color: #4a3f8f; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">Sinapsis</h1>
              <p style="margin: 4px 0 0; color: #d4a853; font-size: 13px;">Psicología Clínica</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #1a1a2e;">Hola ${firstName},</p>
              <p style="margin: 0 0 24px; font-size: 15px; color: #444; line-height: 1.5;">
                Te recordamos que tienes una cita programada para <strong>mañana</strong> con la Licda. Cinthya Chávez.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f7fc; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Fecha</p>
                    <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600;">${date}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Hora</p>
                    <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600;">${time}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Servicio</p>
                    <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600;">${service}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Modalidad</p>
                    <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600;">${modality}</p>
                  </td>
                </tr>
              </table>
              ${meetSection}
              <p style="margin: 20px 0 24px; font-size: 14px; color: #666; line-height: 1.5;">
                ${locationText} Recuerda que puedes reprogramar con al menos 24 horas de anticipación.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/50671398403?text=${encodeURIComponent("Hola, tengo una consulta sobre mi cita de mañana.")}"
                       style="display: inline-block; background-color: #4a3f8f; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                      ¿Necesitas reprogramar? Escríbenos
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 24px; background-color: #f8f7fc; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                Sinapsis — Psicología Clínica · Licda. Cinthya Chavez<br>
                <a href="https://sinapsiscr.com" style="color: #4a3f8f; text-decoration: none;">sinapsiscr.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Recordatorio: tu cita psicológica es mañana a las ${time}`,
    html,
  });

  if (error) {
    throw new Error(`Failed to send reminder email: ${error.message}`);
  }
}
