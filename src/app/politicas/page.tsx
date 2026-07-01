export default function PoliticasPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-8">
          Políticas de cancelación
        </h1>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/70">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Confirmación de cita</h2>
            <p>
              Al agendar una cita a través de nuestra plataforma, usted recibirá un correo electrónico
              de confirmación con los detalles de su cita (fecha, hora, modalidad y servicio).
              La cita se considera confirmada una vez recibido este correo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Cancelaciones</h2>
            <p>
              Las cancelaciones deben realizarse con un mínimo de <strong>24 horas de anticipación</strong> a
              la hora programada de la cita. Las cancelaciones realizadas dentro de este plazo no
              generan ningún cargo.
            </p>
            <p>
              Las cancelaciones realizadas con menos de 24 horas de anticipación tendrán un
              cargo equivalente al <strong>50% del valor de la sesión</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Reprogramación</h2>
            <p>
              Las citas pueden reprogramarse sin costo con al menos 24 horas de anticipación,
              sujeto a disponibilidad. Para reprogramar, contacte directamente a la psicóloga
              por WhatsApp o agende una nueva cita a través de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Inasistencia</h2>
            <p>
              La inasistencia sin previo aviso (no show) se considera una cancelación tardía
              y aplica el cargo del 50% del valor de la sesión.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Cancelación por parte del profesional</h2>
            <p>
              En caso de que la psicóloga deba cancelar una cita por fuerza mayor, se le
              notificará con la mayor anticipación posible y se reprogramará sin costo
              en un horario conveniente para el paciente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Métodos de pago</h2>
            <p>
              El pago de la sesión se realiza al finalizar la misma. Aceptamos transferencia
              bancaria, SINPE Móvil y efectivo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Confidencialidad</h2>
            <p>
              Toda la información proporcionada durante el proceso de agendamiento y durante
              las sesiones es estrictamente confidencial, conforme al secreto profesional
              establecido por el Colegio de Profesionales en Psicología de Costa Rica.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
