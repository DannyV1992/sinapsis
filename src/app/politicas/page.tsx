export default function PoliticasPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-8">
          Políticas de cancelación y asistencia
        </h1>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/70">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Confirmación de cita</h2>
            <p>
              Al agendar una cita a través de nuestra plataforma, recibirá un correo electrónico
              de confirmación con los detalles de su sesión (fecha, hora, modalidad y servicio).
              La cita queda reservada una vez recibido este correo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Cancelaciones y reprogramación</h2>
            <p>
              Si necesita cancelar su cita, <strong>no se realizan devoluciones de dinero</strong>,
              pero puede reprogramarla si avisa con un mínimo de{" "}
              <strong>48 horas de anticipación</strong>.
            </p>
            <p>
              La reprogramación se coordina dentro de los <strong>7 días hábiles siguientes</strong> a
              la fecha original de la cita, según disponibilidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Inasistencia</h2>
            <p>
              En caso de no asistir a la cita o cancelar con menos de 48 horas de anticipación,
              no será posible reprogramar. Para agendar una nueva sesión, se deberá realizar
              el pago correspondiente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Cancelación por parte del profesional</h2>
            <p>
              Si por alguna razón de fuerza mayor la psicóloga debe cancelar una sesión,
              se le notificará con la mayor anticipación posible. En este caso,
              se reprogramará sin costo ni restricción de plazo, o se realizará
              la devolución del monto correspondiente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Recordatorios</h2>
            <p>
              Se envían recordatorios automáticos por correo electrónico antes de cada sesión.
              Sin embargo, no es posible garantizar recordatorios adicionales.
              La responsabilidad de asistir a la cita en el horario acordado es del paciente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Continuidad del proceso</h2>
            <p>
              Para mantener el progreso terapéutico, se recomienda dejar agendada la
              siguiente sesión al finalizar cada cita. Esto ayuda a asegurar espacio
              y mantener la continuidad necesaria para alcanzar los objetivos del proceso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Métodos de pago</h2>
            <p>
              Aceptamos transferencia bancaria, SINPE Móvil y efectivo.
              El pago se realiza al finalizar cada sesión.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
