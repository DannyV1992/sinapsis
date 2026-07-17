import { NextRequest, NextResponse } from "next/server";
import { sendReminderEmail } from "@/lib/reminders";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Test endpoint disabled in production" }, { status: 403 });
  }

  const tipo = request.nextUrl.searchParams.get("tipo") ?? "virtual";

  try {
    if (tipo === "presencial") {
      await sendReminderEmail({
        to: "dava01cr@gmail.com",
        patientName: "Danny Test",
        service: "Terapia individual",
        date: "viernes 4 de julio de 2026",
        time: "10:00 a.m.",
        modality: "Presencial",
        location: "La Aurora, Heredia — Consultorio 2-SV",
      });
    } else {
      await sendReminderEmail({
        to: "dava01cr@gmail.com",
        patientName: "Danny Test",
        service: "Terapia individual",
        date: "viernes 4 de julio de 2026",
        time: "10:00 a.m.",
        modality: "Virtual",
        meetLink: "https://meet.google.com/abc-defg-hij",
      });
    }

    return NextResponse.json({ status: "sent", tipo });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
