import { NextRequest, NextResponse } from "next/server";
import { bookAppointment } from "@/lib/google-calendar";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { start, end, name, email, phone, service, modality, notes } = body;

    if (!start || !end || !name || !email || !phone || !service) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const event = await bookAppointment({
      start,
      end,
      name,
      email,
      phone,
      service,
      modality,
      notes,
    });

    return NextResponse.json({
      success: true,
      eventId: event.id,
      message: "Cita agendada exitosamente",
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json(
      { error: "Error al agendar la cita" },
      { status: 500 }
    );
  }
}
