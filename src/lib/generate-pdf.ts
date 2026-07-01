import PDFDocument from "pdfkit";

interface BookingData {
  name: string;
  email: string;
  phone: string;
  service: string;
  modality: string;
  date: string;
  time: string;
}

export function generateBookingPDF(data: BookingData): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "LETTER", margin: 60 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    // Header
    doc.fontSize(22).font("Helvetica-Bold").text("Sinapsis", { align: "center" });
    doc.fontSize(11).font("Helvetica").text("Psicología Clínica", { align: "center" });
    doc.moveDown(2);

    // Title
    doc.fontSize(16).font("Helvetica-Bold").text("Confirmación de cita", { align: "center" });
    doc.moveDown(1.5);

    // Booking details
    doc.fontSize(11).font("Helvetica-Bold").text("Datos de la cita:");
    doc.moveDown(0.5);
    doc.font("Helvetica");
    doc.text(`Paciente: ${data.name}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Teléfono: ${data.phone}`);
    doc.text(`Servicio: ${data.service}`);
    doc.text(`Modalidad: ${data.modality}`);
    doc.text(`Fecha: ${data.date}`);
    doc.text(`Hora: ${data.time}`);
    doc.moveDown(2);

    // Separator
    doc.moveTo(60, doc.y).lineTo(552, doc.y).stroke("#4a3f8f");
    doc.moveDown(1.5);

    // Policies
    doc.fontSize(14).font("Helvetica-Bold").text("Políticas de cancelación");
    doc.moveDown(1);

    doc.fontSize(10).font("Helvetica-Bold").text("1. Confirmación de cita");
    doc.font("Helvetica").text(
      "Al agendar una cita, usted recibirá un correo electrónico de confirmación. La cita se considera confirmada una vez recibido este correo."
    );
    doc.moveDown(0.8);

    doc.font("Helvetica-Bold").text("2. Cancelaciones");
    doc.font("Helvetica").text(
      "Las cancelaciones deben realizarse con un mínimo de 24 horas de anticipación. Cancelaciones con menos de 24 horas tienen un cargo del 50% del valor de la sesión."
    );
    doc.moveDown(0.8);

    doc.font("Helvetica-Bold").text("3. Reprogramación");
    doc.font("Helvetica").text(
      "Las citas pueden reprogramarse sin costo con al menos 24 horas de anticipación, sujeto a disponibilidad."
    );
    doc.moveDown(0.8);

    doc.font("Helvetica-Bold").text("4. Inasistencia");
    doc.font("Helvetica").text(
      "La inasistencia sin previo aviso se considera cancelación tardía y aplica el cargo del 50%."
    );
    doc.moveDown(0.8);

    doc.font("Helvetica-Bold").text("5. Cancelación por parte del profesional");
    doc.font("Helvetica").text(
      "En caso de cancelación por fuerza mayor, se notificará con anticipación y se reprogramará sin costo."
    );
    doc.moveDown(0.8);

    doc.font("Helvetica-Bold").text("6. Métodos de pago");
    doc.font("Helvetica").text(
      "El pago se realiza al finalizar la sesión. Aceptamos transferencia bancaria, SINPE Móvil y efectivo."
    );
    doc.moveDown(0.8);

    doc.font("Helvetica-Bold").text("7. Confidencialidad");
    doc.font("Helvetica").text(
      "Toda la información proporcionada es estrictamente confidencial, conforme al secreto profesional."
    );
    doc.moveDown(2);

    // Separator
    doc.moveTo(60, doc.y).lineTo(552, doc.y).stroke("#4a3f8f");
    doc.moveDown(1);

    // Acceptance note
    doc.fontSize(9).font("Helvetica-Oblique").text(
      `Al confirmar esta cita, ${data.name} acepta las políticas de cancelación aquí descritas.`,
      { align: "center" }
    );
    doc.moveDown(0.5);
    doc.text(`Documento generado el ${new Date().toLocaleDateString("es-CR")}`, { align: "center" });

    // Footer
    doc.fontSize(8).text("Sinapsis — Psicología Clínica | sinapsiscr.com", 60, 720, { align: "center" });

    doc.end();
  });
}
