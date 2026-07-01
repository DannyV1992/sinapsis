import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface BookingData {
  name: string;
  email: string;
  phone: string;
  service: string;
  modality: string;
  date: string;
  time: string;
}

export async function generateBookingPDF(data: BookingData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]); // Letter size

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const purple = rgb(0.29, 0.25, 0.56);
  const black = rgb(0, 0, 0);
  const gray = rgb(0.35, 0.35, 0.35);

  let y = 720;
  const margin = 60;

  // Header
  page.drawText("Sinapsis", { x: margin, y, font: fontBold, size: 22, color: purple });
  y -= 18;
  page.drawText("Psicología Clínica", { x: margin, y, font, size: 11, color: gray });
  y -= 40;

  // Title
  page.drawText("Confirmación de cita", { x: margin, y, font: fontBold, size: 16, color: black });
  y -= 30;

  // Booking details
  page.drawText("Datos de la cita:", { x: margin, y, font: fontBold, size: 11, color: black });
  y -= 20;

  const details = [
    `Paciente: ${data.name}`,
    `Email: ${data.email}`,
    `Teléfono: ${data.phone}`,
    `Servicio: ${data.service}`,
    `Modalidad: ${data.modality.charAt(0).toUpperCase() + data.modality.slice(1)}`,
    `Fecha: ${data.date}`,
    `Hora: ${data.time}`,
  ];

  for (const line of details) {
    page.drawText(line, { x: margin, y, font, size: 10, color: gray });
    y -= 16;
  }

  y -= 20;

  // Separator
  page.drawLine({ start: { x: margin, y }, end: { x: 552, y }, thickness: 1, color: purple });
  y -= 25;

  // Policies
  page.drawText("Políticas de cancelación", { x: margin, y, font: fontBold, size: 14, color: black });
  y -= 25;

  const policies = [
    { title: "1. Confirmación de cita", text: "Al agendar, recibirá un correo de confirmación con los detalles de su sesión. La cita queda reservada una vez recibido este correo." },
    { title: "2. Cancelaciones y reprogramación", text: "No se realizan devoluciones de dinero, pero puede reprogramar si avisa con mínimo 48 horas de anticipación. La reprogramación se coordina dentro de los 7 días hábiles siguientes a la fecha original." },
    { title: "3. Inasistencia", text: "En caso de no asistir o cancelar con menos de 48 horas, no será posible reprogramar. Para agendar una nueva sesión se deberá realizar el pago correspondiente." },
    { title: "4. Cancelación por el profesional", text: "Si la psicóloga debe cancelar por fuerza mayor, se reprogramará sin costo ni restricción de plazo, o se realizará la devolución del monto." },
    { title: "5. Recordatorios", text: "Se envían recordatorios automáticos por correo antes de cada sesión. La responsabilidad de asistir en el horario acordado es del paciente." },
    { title: "6. Continuidad del proceso", text: "Se recomienda dejar agendada la siguiente sesión al finalizar cada cita para mantener el progreso terapéutico." },
    { title: "7. Métodos de pago", text: "Aceptamos transferencia bancaria, SINPE Móvil y efectivo. El pago se realiza al finalizar cada sesión." },
  ];

  for (const policy of policies) {
    page.drawText(policy.title, { x: margin, y, font: fontBold, size: 10, color: black });
    y -= 14;

    // Word wrap the text
    const words = policy.text.split(" ");
    let line = "";
    for (const word of words) {
      const testLine = line + word + " ";
      const width = font.widthOfTextAtSize(testLine, 9);
      if (width > 490) {
        page.drawText(line.trim(), { x: margin, y, font, size: 9, color: gray });
        y -= 12;
        line = word + " ";
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      page.drawText(line.trim(), { x: margin, y, font, size: 9, color: gray });
      y -= 12;
    }
    y -= 8;
  }

  y -= 10;
  // Separator
  page.drawLine({ start: { x: margin, y }, end: { x: 552, y }, thickness: 1, color: purple });
  y -= 20;

  // Acceptance
  page.drawText(
    `Al confirmar esta cita, ${data.name} acepta las políticas de cancelación aquí descritas.`,
    { x: margin, y, font, size: 8, color: gray }
  );
  y -= 14;
  page.drawText(
    `Documento generado el ${new Date().toLocaleDateString("es-CR")}`,
    { x: margin, y, font, size: 8, color: gray }
  );

  // Footer
  page.drawText("Sinapsis — Psicología Clínica | sinapsiscr.com", {
    x: margin, y: 30, font, size: 8, color: gray,
  });

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}
